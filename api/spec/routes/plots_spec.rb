require_relative '../../main'

describe Huertask::API do

  include Rack::Test::Methods

  def app
    Huertask::API
  end

  before(:each) do
    Fixtures.seed
  end

  let(:current_user){ Huertask::Person.first }

  describe "POST /api/communities/:id/plots" do
    subject(:response) { JSON.parse(last_response.body) }

    it "returs error when community is invalid" do
      data = {
        quantity: 20,
        prefix: "parcela"
      }

      header('User-Id', current_user.id)
      header('Token', current_user.create_auth_token)

      post "/api/communities/0/plots", data

      expect(last_response.status).to be 404
      expect(response.size).to be 1
    end

    it "returns created community" do
      data = {
        quantity: 20,
        prefix: "parcela"
      }

      header('User-Id', current_user.id)
      header('Token', current_user.create_auth_token)

      post "/api/communities/1/plots", data
      expect(last_response).to be_created
      expect(response['plots'].size).to be data[:quantity]
    end

    it "returns 401 error if dont have valid Authorization header" do
      data = {  name: "Nuestro huerto",
                description: "" }

      post "/api/communities/1/plots", data

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end
end
