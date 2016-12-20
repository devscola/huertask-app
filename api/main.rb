require 'grape'
require 'grape-entity'
require 'data_mapper'
require 'dm-timestamps'

require_relative './models/task'
require_relative './models/person'
require_relative './entities/Task'
require_relative './entities/Category'
require_relative './entities/Person'
require_relative './entities/category_task_relation'
require_relative './entities/person_task_relation'
require_relative './models/category'
require_relative './models/person'
require_relative './models/category_person_relation'
require_relative './models/category_task_relation'
require_relative './models/person_task_relation'
require_relative './db/fixtures'
require_relative './repositories/tasks'

module Huertask
  class API < Grape::API
    use Rack::Session::Cookie
    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :signup do
      post "/" do
        person = Person.signup(params)
        if person.save
          session[:person] = person.id
        else
          error_400(person)
        end
      end
    end

    resource :login do
      post "/" do
        if person = Person.authenticate(params[:name], params[:password])
          session[:person] = person.id
        else
          error! "invalid username or password", 400
        end
      end
    end

    resource :tasks do

      get "/" do
        return present Task.past_tasks, with: Entities::Task if params[:filter] == 'past'
        present Task.future_tasks, with: Entities::Task
      end

      params do
        optional :title,           type: String
        optional :categories,      type: Array
        optional :from_date,       type: DateTime
        optional :to_date,         type: DateTime
        optional :required_people, type: Integer
        optional :note,            type: String
      end

      post '/' do
        admin_required

        task = Task.new filter(params)
        if task.save
          present task, with: Entities::Task
        else
          error_400(task)
        end
      end

      route_param :id do

        params do
          optional :title,           type: String
          optional :categories,      type: Array
          optional :from_date,       type: DateTime
          optional :to_date,         type: DateTime
          optional :required_people, type: Integer
          optional :note,            type: String
          optional :status,          type: Integer
        end

        put '/' do
          admin_required

          begin
            task = Task.find_by_id(params[:id])
            task.update_fields(filter(params, false))
            if task.save
              present task, with: Entities::Task
            else
              error_400(task)
            end
          rescue Task::TaskNotFound => e
            error! e.message, 404
          end
        end

        delete '/' do
          admin_required

          begin
            task = Task.find_by_id(params[:id])
            if task.delete
              {}
            else
              error! task.errors.to_hash, 400
            end
          rescue Task::TaskNotFound => e
            error! e.message, 404
          end
        end

        resource :going do
          put '/' do
            going(:yes)
          end
        end

        resource :notgoing do
          put '/' do
            going(:no)
          end
        end
      end
    end

    helpers do
      DataMapper::setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!

      def session
        env['rack.session']
      end

      def error_400(model)
        error! model.errors.to_hash, 400
      end

      def admin_required
        return error!('Unauthorized', 401) unless headers['Authorization'] == 'admin: true'
      end

      def action(is_going)
        return :unroll if is_going == :no
        :enroll if is_going == :yes
      end

      def going(is_going)
        begin
          method = action(is_going)

          task = Task.find_by_id(params[:id])
          person = Person.find_by_id(params[:person_id])

          relation = Repository::Tasks.send(method, task, person)
          if relation.save
            present task, with: Entities::Task
          else
            error_400(relation)
          end
        rescue Task::TaskNotFound => e
          error! e.message, 404
        rescue Person::PersonNotFound => e
          error! e.message, 404
        end
      end

      def filter(params, missing = true)
        params = declared(params, include_missing: missing)
        if params.key?('categories')
          params['categories'] = Category.find_by_ids(params['categories'])
        end
        params
      end
    end

    resource :categories do
      get "/" do
        present Category.all(:order => [ :name.asc ]), with: Entities::Category
      end
    end

    resource :people do
      route_param :id do
        get "/" do
          present Person.find_by_id(params[:id]), with: Entities::Person
        end

        resource :categories do
          route_param :category_id do
            post "/" do
              person = Person.find_by_id(params[:id])
              person.dislike_categories.delete_if { |cat| p cat.id; cat.id == params[:category_id].to_i }
              if person.save
                present person, with: Entities::Person
              else
                error_400(person)
              end
            end
            delete "/" do
              person = Person.find_by_id(params[:id])
              category = Category.find_by_id(params[:category_id])
              person.dislike_categories << category
              if person.save
                present person, with: Entities::Person
              else
                error_400(person)
              end
            end
          end
        end
      end
    end
  end
end

