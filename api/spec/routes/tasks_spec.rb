require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  before(:each) do
    Fixtures.seed
  end

  let(:request_time) { Time.now.utc }

  describe "GET /api/tasks" do
    subject(:tasks) { JSON.parse(last_response.body) }

    it "returns ok" do
      get "/api/tasks"

      expect(last_response).to be_ok
    end

    it "returns future tasks" do
      task = Huertask::Task.get(1)
      task.active = false
      task.save

      get "api/tasks"

      expect(last_response).to be_ok
      expect(past_tasks).to be_empty
      expect(tasks.include?(task)).to be false
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

  describe "PUT /api/tasks/:id" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returs error when task is invalid" do
      body = { title: "" }

      put "/api/tasks/1", body

      expect(last_response).to be_bad_request
      expect(response.size).to be 1
    end

    it "returns edited task" do
      body = { title: "Limpiar lechugas",
               ignored_param: "Este paremetro se ignorará" }

      put "/api/tasks/1", body

      expect(last_response).to be_ok
    end

    it "returns 404 error if dont find task with invalid id" do
      body = { title: "Limpiar lechugas" }

      put "/api/tasks/0", body

      expect(last_response).to be_not_found
      expect(response['error']).to eq "resource not found"
    end
  end

  describe "DELETE /api/tasks/:id" do
    subject(:response) { JSON.parse(last_response.body) }

    it "change task active status and returs {}" do
      task = Huertask::Task.get(1)
      active_status = task.active
      expect(active_status).to be true

      delete "/api/tasks/1"

      task = Huertask::Task.get(1)
      active_status = task.active

      expect(active_status).to be false
      expect(last_response).to be_ok
      expect(response.size).to be {}
    end

    it "returns 404 error if dont find task with invalid id" do
      delete "/api/tasks/0"

      expect(last_response).to be_not_found
      expect(response['error']).to eq "resource not found"
    end
  end

  describe "PUT /api/tasks/:id/going" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returns edited task" do
      data = { person_id: 1 }
      task = Huertask::Task.get(1)
      previous_people_going = task.people_going.size
      expected_people_going = previous_people_going + 1

      put "/api/tasks/1/going", data

      expect(last_response).to be_ok
      expect(response['people_going'].size).to be expected_people_going
    end

    it "returns 404 error if dont find task with invalid id" do
      data = { person_id: 1 }

      put "/api/tasks/0/going", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "resource not found"
    end

    it "returns 404 error if dont find person with invalid id" do
      data = { person_id: 0 }

      put "/api/tasks/1/going", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "resource not found"
    end
  end

  describe "PUT /api/tasks/:id/notgoing" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returns edited task" do
      data = { person_id: 3 }
      task = Huertask::Task.get(1)

      previous_people_not_going = task.people_not_going.size
      expected_people_not_going = previous_people_not_going + 1

      previous_people_going = task.people_going.size
      expected_people_going = previous_people_going - 1

      put "/api/tasks/1/notgoing", data

      expect(last_response).to be_ok
      expect(response['people_not_going'].size).to be expected_people_not_going
      expect(response['people_going'].size).to be expected_people_going
    end

    it "returns 404 error if dont find task with invalid id" do
      data = { person_id: 1 }

      put "/api/tasks/0/notgoing", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "resource not found"
    end

    it "returns 404 error if dont find person with invalid id" do
      data = { person_id: 0 }

      put "/api/tasks/1/notgoing", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "resource not found"
    end
  end
end
