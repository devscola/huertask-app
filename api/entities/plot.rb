module Huertask
  module Entities
    class Plot < Grape::Entity
      expose :id, :name, :community_id, :person_name
    end
  end
end
