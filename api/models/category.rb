require 'dm-validations'

module Huertask
  class Category
    class CategoryNotFound < StandardError
      def initialize(id)
        super("The category #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id,    Serial
    property :name,  String

    validates_presence_of :name
  end
end
