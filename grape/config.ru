require 'rubygems'
require 'rack'
require 'rack/cors'
require './main'

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: :get
  end
end

run Huertask::API
