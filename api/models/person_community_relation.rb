module Huertask
  class PersonCommunityRelation
    include DataMapper::Resource

    property :type,      Integer

    belongs_to :community,   :key => true
    belongs_to :person, :key => true
  end
end
