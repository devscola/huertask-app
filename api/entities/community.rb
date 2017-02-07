require_relative './person_community_relation'

module Huertask
  module Entities
    class CommunitySimple < Grape::Entity
      expose :id, :name, :description
    end
    class Community < CommunitySimple
      expose :invited
      expose :joined, using: "Huertask::Entities::PersonFromCommunity"
      expose :task_points_enabled
      expose :task_points_duration
      expose :person_points_enabled
      expose :person_points_amount
      expose :person_points_reload
      expose :person_points_duration
      expose :next_reload
      expose :plots
    end
  end
end
