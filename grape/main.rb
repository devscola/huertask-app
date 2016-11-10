require 'grape'
require 'data_mapper'

require_relative './data/tasks'
require_relative './data/users'
require_relative'./models/task'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        future_tasks
      end

      desc 'Create a new task'
      post '/' do
        created_task = Task.create params[:task]
        created_task
      end
    end

    helpers do
      def future_tasks
        Task.all.select {|task| future_task?(task)}
      end

      def future_task? task
        task[:date] >= Time.now.utc
      end

      DataMapper::setup(:default, ENV['HUERTASK_DB_URL'] || "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!
    end
  end
end
