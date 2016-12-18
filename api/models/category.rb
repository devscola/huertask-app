require 'dm-validations'

module Huertask
  class Category
    class CategoryNotFound < StandardError
      def initialize(id)
        super("The category #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id,          Serial
    property :name,        String
    property :description, String, :default => "", :length => 0..35

    has n, :tasks_relations, 'CategoryTaskRelation'
    has n, :tasks, :through => :tasks_relations, :via => :task
    has n, :people_relations, 'CategoryPersonRelation'

    validates_presence_of :name


    class << self
      def find_by_ids(ids)
        ids.map{ |id| find_by_id(id) }
      end

      def find_by_id(id)
        category = first(id: id)
        raise CategoryNotFound.new(id) if category.nil?
        category
      end
    end
  end
end
