require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  describe "GET /api/tasks" do

    subject(:tasks) { JSON.parse(last_response.body) }

    it "returns ok" do
      get "/api/tasks"

      expect(last_response).to be_ok
    end
  end
end
