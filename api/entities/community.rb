require_relative './person_community_relation'

module Huertask
  module Entities
    class Community < Grape::Entity
      expose :id, :name, :description, :invited
      expose :joined, using: Huertask::Entities::PersonFromCommunity
    end
  end
end
