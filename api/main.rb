require 'grape'
require 'data_mapper'
require 'dm-timestamps'

require_relative './models/task'
require_relative './db/fixtures'
require_relative './repository/tasks'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        return Huertask::Repository::Tasks.past_tasks if params[:filter] == 'past'
        Huertask::Repository::Tasks.future_tasks
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

      get '/create' do
        data = {"title":"","people":1,"category":"5"}
        task = Task.new(data)
        result = task.save
        p task.errors
        error! task.errors.to_hash, 400
        result
        # begin
        #   task.save
        # rescue DataMapper::SaveFailureError => e
        #   error! e.resource.errors.to_hash, 400
        # end
      end
    end

    helpers do
      DataMapper::setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!
    end
  end
end
