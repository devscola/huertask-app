require 'grape'
require 'grape-entity'
require 'data_mapper'
require 'dm-timestamps'

require_relative './models/task'
require_relative './entities/Task'
require_relative './entities/Person'
require_relative './entities/person_task_relation'
require_relative './models/person_task_relation'
require_relative './models/person'
require_relative './db/fixtures'
require_relative './repositories/tasks'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do

      get "/" do
        return present Task.past_tasks, with: Entities::Task if params[:filter] == 'past'
        present Task.future_tasks, with: Entities::Task
      end

      desc 'Create a new task'
      post '/' do
        task = Task.new params
        result = task.save
        if result == true
          task
        else
          error_400(task)
        end
      end

      route_param :id do
        params do
          optional :title,           type: String
          optional :category,        type: String
          optional :from_date,       type: DateTime
          optional :to_date,         type: DateTime
          optional :required_people, type: Integer
          optional :note,            type: String
        end
        put '/' do
          begin
            task = Task.find_by_id(params[:id])
            task.update_fields(declared(params, include_missing: false))
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
          begin
            task = Task.find_by_id(params[:id])
            task.active = false
            if task.save
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

      def error_400(model)
        error! model.errors.to_hash, 400
      end

      def action(is_going)
        return :unroll if is_going == :no
        :enroll if is_going == :yes
      end

      def going(is_going)
        begin
          method = action(is_going)

          task = Task.find_by_id(params[:id])
          person = Person.get(params[:person_id])

          return error! 'resource not found', 404 if !person

          relation = Repository::Tasks.send(method, task, person)
          if relation.save
            present task, with: Entities::Task
          else
            error_400(relation)
          end
        rescue Task::TaskNotFound => e
          error! e.message, 404
        end
      end
    end
  end
end

