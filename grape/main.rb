require 'grape'
require_relative './lib/tasks'

module Huertask
  class API < Grape::API

    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :tasks do
      get "/" do
        Tasks.futures
      end
    end
  end
end
