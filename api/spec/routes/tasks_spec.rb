require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  let(:request_time) { Time.now.utc }

  describe "GET /api/tasks" do
    subject(:tasks) { JSON.parse(last_response.body) }

    it "returns ok" do
      get "/api/tasks"

      expect(last_response).to be_ok
    end

    it "returns future tasks" do
      get "api/tasks"

      expect(last_response).to be_ok
      expect(past_tasks).to be_empty
    end

    def past_tasks
      tasks.select {|task| past_task?(task)}
    end

    def past_task? task
      task["from_date"] < request_time
    end
  end
end
