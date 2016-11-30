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
        return present Repository::Tasks.past_tasks, with: Entities::Task if params[:filter] == 'past'
        present Repository::Tasks.future_tasks, with: Entities::Task
      end

      desc 'Create a new task'
      post '/' do
        task = Task.new params
        result = task.save
        if result == true
          task
        else
          error! task.errors.to_hash, 400
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
          return error!('Unauthorized', 401) unless headers['Authorization'] == ('admin: true')

          task = Task.get(params[:id])

          return error! 'resource not found', 404 if !task

          declared(params, include_missing: false).each do |key, value|
            task.update(key => value)
          end
          if task.save
            present task, with: Entities::Task
          else
            error! task.errors.to_hash, 400
          end
        end

        delete '/' do
          return error!('Unauthorized', 401) unless headers['Authorization'] == ('admin: true')

          task = Task.get(params[:id])

          return error! 'resource not found', 404 if !task

          task.active = false;

          if task.save
            {}
          else
            error! task.errors.to_hash, 400
          end
        end

        resource :going do
          put '/' do
            task = Task.get(params[:id])
            person = Person.get(params[:person_id])

            return error! 'resource not found', 404 if !task || !person

            relation = Repository::Tasks.enroll(task, person)
            if relation.save
              present task, with: Entities::Task
            else
              error! relation.errors.to_hash, 400
            end
          end
        end

        resource :notgoing do
          put '/' do
            task = Task.get(params[:id])
            person = Person.get(params[:person_id])

            return error! 'resource not found', 404 if !task || !person

            relation = Repository::Tasks.unroll(task, person)
            if relation.save
              present task, with: Entities::Task
            else
              error! relation.errors.to_hash, 400
            end
          end
        end
      end
    end

    helpers do
      DataMapper::setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!
    end
  end
end
