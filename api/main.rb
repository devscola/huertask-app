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

      UNPARTICIPATE_STATUS = 0
      PARTICIPATE_STATUS = 1

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

      params do
        requires :task_id, type: Integer
      end

      route_param :task_id do
        resource :participate do
          put '/' do
            task = Task.get(params[:task_id])
            person = Person.get(params[:person_id])
            relation = Repository::Tasks.create_or_update_participation(task, person, PARTICIPATE_STATUS)
            if relation.save
              present task, with: Entities::Task
            else
              error! relation.errors.to_hash, 400
            end
          end
        end

        resource :unparticipate do
          put '/' do
            task = Task.get(params[:task_id])
            person = Person.get(params[:person_id])
            relation = Repository::Tasks.create_or_update_participation(task, person, UNPARTICIPATE_STATUS)
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
