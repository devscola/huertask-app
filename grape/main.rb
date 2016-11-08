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
      end
    end

    helpers do
      def to_json tasks
        tasks.map { |task|
          {
            title: task.title,
            date: task.date,
            people_left: task.people_left,
            category: task.category
          }
        }
      end
    end
  end
end
