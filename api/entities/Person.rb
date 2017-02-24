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
      expose :email
      expose :invitations, using: Huertask::Entities::CommunityFromPerson
      expose :active_community_relations, using: Huertask::Entities::CommunityFromPerson, as: :communities
    end
    class PersonPoints < Grape::Entity
      expose :taskpoints do
        expose :finalized_tasks, as: :list
      end
      expose :userpoints do
        expose :person_medals, as: :list
        expose :available_person_points, as: :available
      end
    end
  end
end
