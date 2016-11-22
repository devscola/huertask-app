require 'grape'
require 'grape-entity'
require 'data_mapper'
require 'dm-timestamps'

require_relative './models/task'
require_relative './entities/Task'
require_relative './entities/Person'
require_relative './models/participation'
require_relative './models/person'
require_relative './db/fixtures'
require_relative './repository/tasks'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        # return Huertask::Repository::Tasks.past_tasks if params[:filter] == 'past'
        # Huertask::Repository::Tasks.future_tasks

        present Huertask::Repository::Tasks.future_tasks, with: Huertask::Entities::Task
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
          post '/' do
            task = Task.get(params[:task_id])
            person = Person.get(params[:person_id])
            task.participants << person
            task.save
            present task, with: Huertask::Entities::Task
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
