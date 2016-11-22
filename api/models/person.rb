module Huertask
  class Person
    include DataMapper::Resource

    property :id, Serial
    property :name, String

    has n, :participations
    has n, :tasks, 'Task', :through => :participations, :via => :task
  end
end
