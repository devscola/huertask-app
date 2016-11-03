require 'grape'
require_relative './services/task_service'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        TaskService.find_future
      end
    end

  end
end
