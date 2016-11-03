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

    it "returns an array of tasks" do
      get "/api/tasks"
      non_tasks = Array.new

      tasks.each do |element|
        non_tasks.push(element) if element.is_a?(Task)
      end

      expect(non_tasks.size).to eq(0)
    end
  end
end
