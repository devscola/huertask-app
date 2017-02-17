module Huertask
  class PersonCommunityRelation
    include DataMapper::Resource

    property   :type, Integer
    belongs_to :plot, 'Plot', :required => false

    belongs_to :community,   :key => true
    belongs_to :person, :key => true
  end
end
