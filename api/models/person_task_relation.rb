module Huertask
  class PersonTaskRelation
    include DataMapper::Resource

    property :status,      Integer

    belongs_to :task,   :key => true
    belongs_to :person, :key => true
  end
end
