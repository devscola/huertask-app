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
  let(:receiver){ Huertask::Person[1] }
  let(:community){ Huertask::Community.first }

  describe "POST /api/communities/:id/people/:id/points/donate", :focus => true do
    subject(:response) { JSON.parse(last_response.body) }

    it "returns donated point" do
      data = { receiver_id: receiver.id,
               description: "" }

      header('Token', current_user.create_auth_token)

      post "/api/communities/#{community.id}/people/#{current_user.id}/points/donate", data

      expect(last_response).to be_created
      expect(response['sender_id']).to be current_user.id
    end

    it "returns error when current_user hasn't available person_points", :focus => true do
      data = { receiver_id: receiver.id,
               description: "" }

      current_user.available_person_points = 0
      current_user.save
      header('Token', current_user.create_auth_token)

      post "/api/communities/#{community.id}/people/#{current_user.id}/points/donate", data

      expect(last_response.status).to be 405
    end
  end
end
