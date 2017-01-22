require_relative './Category'
require_relative './person_community_relation'

module Huertask
  module Entities
    class PersonEmail < Grape::Entity
      expose :id, :name, :email
    end
    class Person < Grape::Entity
      expose :id, :name, :token
      expose :dislike_categories, using: Huertask::Entities::Category
      expose :categories, using: Huertask::Entities::Category
    end
    class PersonAfterLogin < Person
      expose :email, :invitations
      expose :community_relations, using: Huertask::Entities::CommunityFromPerson, as: :communities
    end
  end
end
