require_relative './person_community_relation'

module Huertask
  module Entities
    class CommunitySimple < Grape::Entity
      expose :id, :name, :description
    end
    class Community < CommunitySimple
      expose :invited
      expose :joined, using: "Huertask::Entities::PersonFromCommunity"
    end
  end
end
