module Huertask
  class CategoryPersonRelation

    class CategoryPersonRelationNotFound < StandardError
      def initialize()
        super("The relation was not found")
      end
    end
    include DataMapper::Resource

    property :type,      Integer

    belongs_to :category, :key => true
    belongs_to :person,   :key => true
  end
end
