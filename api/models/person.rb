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

    has n, :people_relations, 'PersonTaskRelation'
    has n, :categories_relations, 'CategoryPersonRelation'
    has n, :dislike_categories, 'Category', :through => :categories_relations, :via => :category

    class << self
      def find_by_id(id)
        person = get(id)
        raise PersonNotFound.new(id) if person.nil?
        person
      end
    end

  end
end
