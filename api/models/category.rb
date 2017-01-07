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
    property :mandatory,   Boolean, :default => false
    property :active,      Boolean, :default => true

    has n, :tasks_relations, 'CategoryTaskRelation'
    has n, :tasks, :through => :tasks_relations, :via => :task
    has n, :people_relations, 'CategoryPersonRelation'

    validates_presence_of :name

    def delete
      self.active = false
      save
    end

    class << self
      def active
        self.all(:active => true, :order => [ :name.asc ])
      end

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
