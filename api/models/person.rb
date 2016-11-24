module Huertask
  class Person
    include DataMapper::Resource

    property :id, Serial
    property :name, String

    has n, :people_relations, 'PersonTaskRelation'
  end
end
