module Huertask
  class PersonTaskRelation
    include DataMapper::Resource

    property :type,      Integer

    belongs_to :task,   :key => true
    belongs_to :person, :key => true
  end
end
