require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  before(:each) do
    Fixtures.seed
  end

  let(:current_user) { Huertask::Person.first }
  let(:request_time) { Time.now.utc }

  describe "GET /api/tasks" do
    subject(:tasks) { JSON.parse(last_response.body) }

    it "returns ok" do
      get "/api/tasks"

      expect(last_response).to be_ok
    end

    it "returns future tasks" do
      task = Huertask::Task.first
      task.active = false
      task.save

      get "api/tasks"

      expect(last_response).to be_ok
      expect(past_tasks).to be_empty
      expect(tasks.include?(task)).to be false
    end

    it "return only tasks of fav categories if param user_id is present" do
      user_id = Huertask::Person.last.id
      get "api/tasks?user_id=#{user_id}"

      expect(last_response).to be_ok
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

    let(:category) { Huertask::Category.first }

    it "returs error when task is invalid" do
      data = { title: "",
               categories: [category.id],
               from_date: Time.now,
               to_date: (Time.now - 60*60) }

      header('User-Id', current_user.id)
      post "/api/tasks", data

      expect(last_response).to be_bad_request
      expect(response.size).to be 3
    end

    it "returns created task" do
      data = {  title: "Limpiar lechugas",
                required_people: 1,
                categories: [category.id],
                from_date: Time.now,
                to_date: (Time.now + 60*60) }

      header('User-Id', current_user.id)
      post "/api/tasks", data

      expect(last_response).to be_created
    end

    it "returns 401 error if dont have valid Authorization header" do
      data = {  title: "Limpiar lechugas",
                required_people: 1,
                categories: [category.id],
                from_date: Time.now,
                to_date: (Time.now + 60*60) }

      header('Authorization', 'admin: false')
      post "/api/tasks", data

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end

  describe "PUT /api/tasks/:id" do
    subject(:response) { JSON.parse(last_response.body) }

    let(:task) { Huertask::Task.first }

    it "returs error when task is invalid" do
      body = { title: "" }

      header('User-Id', current_user.id)
      put "/api/tasks/#{task.id}", body

      expect(last_response).to be_bad_request
      expect(response.size).to be 1
    end

    it "returns edited task" do
      body = { title: "Limpiar lechugas",
               ignored_param: "Este paremetro se ignorará" }

      header('User-Id', current_user.id)
      put "/api/tasks/#{task.id}", body

      expect(last_response).to be_ok
    end

    it "returns 404 error if dont find task with invalid id" do
      body = { title: "Limpiar lechugas" }

      header('User-Id', current_user.id)
      put "/api/tasks/0", body

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The task 0 was not found"
    end

    it "returns 401 error if dont have valid Authorization header" do
      body = { title: "Limpiar lechugas" }

      header('Authorization', 'admin: false')
      put "/api/tasks/#{task.id}", body

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end

  describe "DELETE /api/tasks/:id" do
    subject(:response) { JSON.parse(last_response.body) }

    let(:task) { Huertask::Task.first }

    it "change task active status and returs {}" do
      active_status = task.active
      expect(active_status).to be true

      header('User-Id', current_user.id)
      delete "/api/tasks/#{task.id}"
      task = Huertask::Task.first
      active_status = task.active

      expect(active_status).to be false
      expect(last_response).to be_ok
      expect(response.size).to be {}
    end

    it "returns 404 error if dont find task with invalid id" do
      header('User-Id', current_user.id)
      delete "/api/tasks/0"

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The task 0 was not found"
    end

    it "returns 401 error if dont have valid Authorization header" do
      body = { title: "Limpiar lechugas" }

      header('Authorization', 'admin: false')
      delete "/api/tasks/#{task.id}", body

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end

  describe "PUT /api/tasks/:id/going" do
    subject(:response) { JSON.parse(last_response.body) }
    let(:person) { Huertask::Person.first }
    let(:task) { Huertask::Task.first }

    it "returns edited task" do
      data = { person_id: person.id }
      previous_people_going = task.people_going.size
      expected_people_going = previous_people_going + 1

      put "/api/tasks/#{task.id}/going", data

      expect(last_response).to be_ok
      expect(response['people_going'].size).to be expected_people_going
    end

    it "returns 404 error if dont find task with invalid id" do
      data = { person_id: person.id }

      put "/api/tasks/0/going", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The task 0 was not found"
    end

    it "returns 404 error if dont find person with invalid id" do
      data = { person_id: 0 }

      put "/api/tasks/#{task.id}/going", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The person 0 was not found"
    end
  end

  describe "PUT /api/tasks/:id/notgoing" do
    subject(:response) { JSON.parse(last_response.body) }

    let(:person) { Huertask::Person[2] }
    let(:task) { Huertask::Task.first }

    it "returns edited task" do
      data = { person_id: person.id }

      previous_people_not_going = task.people_not_going.size
      expected_people_not_going = previous_people_not_going + 1

      previous_people_going = task.people_going.size
      expected_people_going = previous_people_going - 1

      put "/api/tasks/#{task.id}/notgoing", data

      expect(last_response).to be_ok
      expect(response['people_not_going'].size).to be expected_people_not_going
      expect(response['people_going'].size).to be expected_people_going
    end

    it "returns 404 error if dont find task with invalid id" do
      data = { person_id: person.id }

      put "/api/tasks/0/notgoing", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The task 0 was not found"
    end

    it "returns 404 error if dont find person with invalid id" do
      data = { person_id: 0 }

      put "/api/tasks/#{task.id}/notgoing", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The person 0 was not found"
    end
  end
end
