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
end
