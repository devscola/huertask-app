module Huertask
  class TaskCommunityRelation
    include DataMapper::Resource

    property :type,      Integer

    belongs_to :community,   :key => true
    belongs_to :task, :key => true
  end
end
