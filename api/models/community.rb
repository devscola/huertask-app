require 'dm-validations'

module Huertask
  class Community

    INVITATED_USER_TYPE = 0
    SIMPLE_USER_TYPE = 1
    ADMIN_USER_TYPE = 2

    class CommunityNotFound < StandardError
      def initialize(id)
        super("The community #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id,          Serial
    property :name,        String, :length => 1..100
    property :description, String, :default => "", :length => 0..200

    validates_presence_of :name

    has n, :people_relations, 'PersonCommunityRelation'

    class << self
      def find_by_id(id)
        community = get(id)
        raise CommunityNotFound.new(id) if community.nil?
        community
      end
    end

    def invite_people(params)
      params[:simple_users].each do |email|
        invite_person(email, SIMPLE_USER_TYPE)
      end
      params[:admin_users].each do |email|
        invite_person(email, ADMIN_USER_TYPE)
      end
    end

    def invite_person(email, type)
      if person = Person.first(email: email)
        self.create_or_update_relation(person, type)
      else
        p "no existe esta persona #{email}"
      end
    end

    def create_or_update_relation(person, type)
      relation = PersonCommunityRelation.first(:community_id => self.id, :person_id => person.id)
      if relation
        relation.type = type
      else
        relation = PersonCommunityRelation.new({
          community_id: self.id,
          person_id: person.id,
          type: type
        })
      end
      if relation.save
        relation
      else
        error_400(relation)
      end
    end
  end
end
