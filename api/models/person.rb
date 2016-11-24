module Huertask
  class Person
    include DataMapper::Resource

    property :id, Serial
    property :name, String

    has n, :people_relations, 'PersonTaskRelation'
    has n, :tasks, 'Task', :through => :people_relations, :via => :task
  end
end
