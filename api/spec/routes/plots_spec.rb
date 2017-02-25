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
        name: "parcela"
      }

      header('Token', current_user.create_auth_token)

      post "/api/communities/0/plots", data

      expect(last_response).to be_not_found
      expect(response.size).to be 1
    end

    it "returns modified community with created plots" do
      data = {
        quantity: 20,
        name: "parcela"
      }

      community_id = Huertask::Community[1].id

      header('Token', current_user.create_auth_token)

      post "/api/communities/#{community_id}/plots", data
      expect(last_response).to be_created
      expect(response.size).to be data[:quantity]
    end

    it "returns 401 error if dont have valid Authorization header" do
      data = {  name: "Nuestro huerto",
                description: "" }

      post "/api/communities/1/plots", data

      expect(last_response).to be_unauthorized
      expect(response['error']).to eq "Unauthorized"
    end
  end

  describe "PUT /api/plots/:id", :now => true do
    subject(:response) { JSON.parse(last_response.body) }

    it "assign person to plot" do
      person = Huertask::Person.first
      data = { person_id: person.id }

      plot = Huertask::Plot.create(name: 'parcela 1', community_id: Huertask::Community[1].id)

      header('Token', current_user.create_auth_token)

      put "/api/plots/#{plot.id}", data

      expect(last_response).to be_ok
      expect(response['person']['id']).to be person.id
      expect(response['person']['name']).to eq person.name
    end

  end
end
