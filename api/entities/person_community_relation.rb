require_relative './Person'
require_relative './community'

module Huertask
  module Entities
    class PersonFromCommunity < Grape::Entity
      expose :person, merge: true, using: "Huertask::Entities::PersonEmail"
      expose :type
    end
    class CommunityFromPerson < Grape::Entity
      expose :community, using: Huertask::Entities::CommunitySimple
      expose :type
    end
  end
end
