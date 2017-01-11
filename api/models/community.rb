require 'dm-validations'

module Huertask
  class Community

    include DataMapper::Resource

    property :id,          Serial
    property :name,        String, :length => 1..100
    property :description, String, :default => "", :length => 0..200

    validates_presence_of :name

    has n, :people_relations, 'PersonCommunityRelation'
  end
end
