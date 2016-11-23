require 'grape'
require 'grape-entity'
require 'data_mapper'
require 'dm-timestamps'

require_relative './models/task'
require_relative './entities/Task'
require_relative './entities/Person'
require_relative './entities/Participation'
require_relative './models/participation'
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
          put '/' do
            task = Task.get(params[:task_id])
            person = Person.get(params[:person_id])
            participation = create_or_update_participation(task, person, PARTICIPATE_STATUS)
            if participation.save
              present task, with: Huertask::Entities::Task
            else
              error! participation.errors.to_hash, 400
            end
          end
        end

        resource :unparticipate do
          put '/' do
            task = Task.get(params[:task_id])
            person = Person.get(params[:person_id])
            participation = create_or_update_participation(task, person, UNPARTICIPATE_STATUS)
            if participation.save
              present task, with: Huertask::Entities::Task
            else
              error! participation.errors.to_hash, 400
            end
          end
        end
      end
    end

    helpers do
      DataMapper::setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!

      def create_or_update_participation(task, person, status)
        participation = Huertask::Participation.first(:task => task, :person => person)
        if participation
          participation.status = status
        else
          participation = Huertask::Participation.new({
            task: task,
            person: person,
            status: status
          })
        end
        participation
      end
    end
  end
end
