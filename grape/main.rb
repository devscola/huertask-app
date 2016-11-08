require 'grape'
require_relative './lib/tasks'

TASKS = [
          {
            title: "Recoger tomates",
            date: "2012-01-01 00:00:00",
            category: "cosecha",
            people_left: 1
          },
          {
            title: "Barrer entrada",
            date: "2016-12-09 00:00:00",
            category: "limpieza",
            people_left: 4
          },
          {
            title: "Traer leña",
            date: "2016-12-12 00:00:00",
            category: "general",
            people_left: 1
          },
          {
            title: "Quitar malas hierbas",
            date: "2016-12-02 00:00:00",
            category: "limpieza",
            people_left: 5
          },
          {
            title: "Ampliar parcelas zona oeste",
            date: "2016-12-13 00:00:00",
            category: "general",
            people_left: 9
          }
        ]

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
