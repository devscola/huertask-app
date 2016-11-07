require 'grape'

require_relative './data/tasks'
require_relative './data/users'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        future_tasks
      end
    end

    helpers do
      def future_tasks
        TASKS.select {|task| future_task?(task)}
      end

      def future_task? task
        task[:date] >= Time.now.utc
      end
    end
  end
end
