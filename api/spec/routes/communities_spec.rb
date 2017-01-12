require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  before(:each) do
    Fixtures.seed
  end

  describe "POST /api/communities" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returs error when community is invalid" do
      data = { name: "",
               description: "" }

      person = Huertask::Person.first

      header('Authorization', 'admin: true')
      header('User-Id', person.id)
      header('Token', person.create_auth_token)

      post "/api/communities", data

      expect(last_response).to be_bad_request
      expect(response.size).to be 1
    end

    it "returns created community" do
      data = {  name: "Nuestro huerto",
                description: "" }

      person = Huertask::Person.first

      header('Authorization', 'admin: true')
      header('User-Id', person.id)
      header('Token', person.create_auth_token)

      post "/api/communities", data

      expect(last_response).to be_created
    end

    it "returns 401 error if dont have valid Authorization header" do
      data = {  name: "Nuestro huerto",
                description: "" }

      header('Authorization', 'admin: false')
      post "/api/communities", data

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end

  describe "POST /api/communities/:id/invite" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returs error when community is invalid" do
      data = {
        "simple_users" => ["person1@devscola.org", "person2@devscola.org"],
        "admin_users" => ["person3@devscola.org"]
      }

      person = Huertask::Person.first

      header('Authorization', 'admin: true')
      header('User-Id', person.id)
      header('Token', person.create_auth_token)

      post "/api/communities/0/invite", data

      expect(last_response).to be_not_found
      expect(response['error']).to eq "The community 0 was not found"
    end

    it "returs community when is valid" do
      data = {
        "simple_users" => ["person1@devscola.org", "person2@devscola.org"],
        "admin_users" => ["person3@devscola.org"]
      }

      person = Huertask::Person.first
      community = Huertask::Community.first

      header('Authorization', 'admin: true')
      header('User-Id', person.id)
      header('Token', person.create_auth_token)

      post "/api/communities/#{community.id}/invite", data

      community = Huertask::Community.first

      expect(last_response).to be_created
      expect(community.people_relations.size).to be 3
    end

    it "join person in community when both are valid", :focus => true do
      data = {
        "simple_users" => ["person1@devscola.org", "person2@devscola.org", "fake@mail.fake"],
        "admin_users" => ["person3@devscola.org"]
      }

      person = Huertask::Person.first
      community = Huertask::Community.first

      header('Authorization', 'admin: true')
      header('User-Id', person.id)
      header('Token', person.create_auth_token)

      post "/api/communities/#{community.id}/invite", data

      community = Huertask::Community.first

      expect(last_response).to be_created
      expect(community.people_relations.size).to be 3
    end
  end
end
