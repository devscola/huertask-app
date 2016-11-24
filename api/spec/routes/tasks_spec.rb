require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  Fixtures.seed

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

  describe "POST /api/tasks" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returs error when task is invalid" do
      data = { title: "",
               category: "limpieza" }

      post "/api/tasks", data

      expect(last_response).to be_bad_request
      expect(response.size).to be 3
    end

    it "returns created task" do
      data = {  title: "Limpiar lechugas",
                required_people: 1,
                category: "limpieza",
                from_date: "2016-12-19 00:00:00" }

      post "/api/tasks", data

      expect(last_response).to be_created
    end
  end

  describe "PUT /api/tasks/:id/participate" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returns edited task" do
      data = { person_id: 1 }
      task = Huertask::Task.get(1)
      previous_positive_replies = task.positive_replies.size
      expected_positive_replies = previous_positive_replies + 1

      put "/api/tasks/1/participate", data

      expect(last_response).to be_ok
      expect(response['positive_replies'].size).to be expected_positive_replies
    end
  end

  describe "PUT /api/tasks/:id/unparticipate" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returns edited task" do
      data = { person_id: 3 }
      task = Huertask::Task.get(1)

      previous_negative_replies = task.negative_replies.size
      expected_negative_replies = previous_negative_replies + 1

      previous_positive_replies = task.positive_replies.size
      expected_positive_replies = previous_positive_replies - 1

      put "/api/tasks/1/unparticipate", data

      expect(last_response).to be_ok
      expect(response['negative_replies'].size).to be expected_negative_replies
      expect(response['positive_replies'].size).to be expected_positive_replies
    end
  end
end
