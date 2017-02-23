module Huertask
  module Entities
    class Plot < Grape::Entity
      expose :id, :name, :number, :community_id, :status
      expose :person, using: Huertask::Entities::PersonEmail
    end
  end
end
