require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  before(:each) do
    Fixtures.seed
  end

  let(:normal_user) { Huertask::Person[6] }
  let(:admin_user) { Huertask::Person[1] }
  let(:community) { Huertask::Community[0] }
  let(:request_time) { Time.now.utc }

  describe "GET api/communities/:community_id/people/:person_id/tasks" do
    subject(:tasks) { JSON.parse(last_response.body) }

    it "returns ok" do
      header('Token', normal_user.token)
      get "api/communities/#{community.id}/people/#{normal_user.id}/tasks"

      expect(last_response).to be_ok
    end

    it "returns future tasks" do
      task = Huertask::Task.first
      task.active = false
      task.save

      get "api/communities/#{community.id}/people/#{normal_user.id}/tasks"

      expect(last_response).to be_ok
      expect(past_tasks).to be_empty
      expect(tasks.include?(task)).to be false
    end

    it "return only tasks of fav categories" do
      get "api/communities/#{community.id}/people/#{normal_user.id}/tasks"

      expect(last_response).to be_ok
    end

    def past_tasks
      tasks.select {|task| past_task?(task)}
    end

    def past_task? task
      task["from_date"] < request_time
    end
  end

  describe "POST api/communities/:community_id/people/:person_id/tasks" do
    subject(:response) { JSON.parse(last_response.body) }

    let(:category) { Huertask::Category.first }

    it "returs error when task is invalid" do
      data = { title: "",
               categories: [category.id],
               from_date: Time.now,
               to_date: (Time.now - 60*60) }

      header('Token', admin_user.create_auth_token)
      post "/api/communities/#{community.id}/people/#{admin_user.id}/tasks", data

      expect(last_response).to be_bad_request
      expect(response.size).to be 3
    end

    it "returns created task" do
      data = {  title: "Limpiar lechugas",
                required_people: 1,
                categories: [category.id],
                from_date: Time.now,
                to_date: (Time.now + 60*60) }

      header('Token', admin_user.create_auth_token)
      post "/api/communities/#{community.id}/people/#{admin_user.id}/tasks", data

      expect(last_response).to be_created
    end

    it "returns 401 error if dont have valid Authorization header" do
      data = {  title: "Limpiar lechugas",
                required_people: 1,
                categories: [category.id],
                from_date: Time.now,
                to_date: (Time.now + 60*60) }

      post "/api/communities/#{community.id}/people/#{normal_user.id}/tasks", data

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end

  describe "api/tasks/:task_id" do
    subject(:response) { JSON.parse(last_response.body) }

    let(:task) { Huertask::Task.first }

    it "returs error when task is invalid" do
      body = { title: "" }

      header('Token', admin_user.create_auth_token)
      put "/api/tasks/#{task.id}", body

      expect(last_response).to be_bad_request
      expect(response.size).to be 1
    end

    it "returns edited task" do
      body = { title: "Limpiar lechugas",
               ignored_param: "Este paremetro se ignorará" }

      header('Token', admin_user.create_auth_token)
      put "/api/tasks/#{task.id}", body

      expect(last_response).to be_ok
    end

    it "returns 404 error if dont find task with invalid id" do
      body = { title: "Limpiar lechugas" }

      header('Token', admin_user.create_auth_token)
      put "/api/tasks/0", body

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The task 0 was not found"
    end

    it "returns 401 error if dont have valid Authorization header" do
      body = { title: "Limpiar lechugas" }

      header('Token', normal_user.token)
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

      header('Token', admin_user.create_auth_token)
      delete "/api/tasks/#{task.id}"
      task = Huertask::Task.first
      active_status = task.active

      expect(active_status).to be false
      expect(last_response).to be_ok
      expect(response.size).to be {}
    end

    it "returns 404 error if dont find task with invalid id" do
      header('Token', admin_user.create_auth_token)
      delete "/api/tasks/0"

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The task 0 was not found"
    end

    it "returns 401 error if dont have valid Authorization header" do

      header('Token', normal_user.token)
      delete "/api/tasks/#{task.id}"

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
