require 'rubygems'
require 'rack'
require 'rack/cors'
require './main'

require 'omniauth'
require 'omniauth-facebook'

    use Rack::Session::Cookie
    use OmniAuth::Strategies::Developer

use OmniAuth::Builder do
  configure do |config|
      config.path_prefix = '/api/auth'
  end
  provider :facebook, '1380421321989980', '7e311914629f9e62729f54a6f0ffbd49'
end

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :options, :put, :delete]
  end
end

run Huertask::API
