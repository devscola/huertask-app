require 'grape'

module Twitter
  class API < Grape::API
    
    version 'v1', using: :header, vendor: 'twitter'
    format :json
    prefix :api

    resource :tasks do
      get :future do
        'Hello'
      end
    end
    
  end
end