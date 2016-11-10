require 'grape'
require 'data_mapper'

require './data/tasks'
require './data/users'
require'./models/task'

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
      params do
        group :task, type: Hash do
          requires :title, type: String,  regexp: /.+/, desc: "The title of the task."
          requires :date, type: Time, regexp: /.+/, desc: "Starting date and time of the task."
          requires :people, type: Integer, regexp: /.+/, desc: "People needed to complete the task"
          requires :category, type: String, regexp: /.+/, desc: "Comments about the task."
        end
      end
      post '/' do
        task = {
          title: params[:task][:title],
          date: params[:task][:date].utc,
          people: params[:task][:people],
          category: params[:task][:category],
        }
        created_task = tasks.create task
        present :task, created_task, with: Task
      end
    end

    helpers do
      def future_tasks
        TASKS.select {|task| future_task?(task)}
      end

      def future_task? task
        task[:date] >= Time.now.utc
      end

      DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!
    end
  end
end
