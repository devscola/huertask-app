require 'grape'
require_relative './lib/tasks'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        to_json(Tasks.futures)
        #Tasks.futures
      end
    end

    helpers do
      def to_json tasks
        converted_tasks = Array.new

        tasks.each do |task|

          converted_data = {
            title: task.title,
            date: task.date,
            people_left: task.people_left,
            category: task.category
          }

          converted_tasks.push(converted_data)
        end

        converted_tasks
      end
    end
  end
end
