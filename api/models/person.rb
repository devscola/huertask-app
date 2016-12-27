module Huertask
  class Person

    class PersonNotFound < StandardError
      def initialize(id)
        super("The person #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id, Serial
    property :name, String
    property :email, String

    has n, :people_relations, 'PersonTaskRelation'
    has n, :categories_relations, 'CategoryPersonRelation'
    has n, :dislike_categories, 'Category', :through => :categories_relations, :via => :category

    class << self
      def find_by_id(id)
        person = get(id)
        raise PersonNotFound.new(id) if person.nil?
        person
      end

      def find_or_create_from_auth_hash(auth_hash)
        person = Person.first('email' => auth_hash['info']['email'])
        if person.nil?
          puts 'a'
          person = Person.new(name: auth_hash['info']['name'], email: auth_hash['info']['email'])
          person.save
          puts 'b'
        end
        person
      end
    end

  end
end
