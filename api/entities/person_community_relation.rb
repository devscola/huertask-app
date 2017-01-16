require_relative './Person'

module Huertask
  module Entities
    class PersonFromCommunity < Grape::Entity
      expose :person, merge: true, using: Huertask::Entities::PersonEmail
      expose :type
    end
  end
end
