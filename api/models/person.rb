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

      def get_skipped_categories(user_id)
        return [] if user_id.nil?
        Person.find_by_id(user_id).dislike_categories.map { |cat| cat.id  }
      end
    end

    def add_favorite_category(category_id)
      category = Category.find_by_id(category_id)
      relation = categories_relations.first(:category => category)
      raise Huertask::CategoryPersonRelation::CategoryPersonRelationNotFound.new if relation.nil?
      relation.destroy
    end

    def remove_favorite_category(category_id)
      category = Category.find_by_id(category_id)
      dislike_categories << category
      save
    end

  end
end
