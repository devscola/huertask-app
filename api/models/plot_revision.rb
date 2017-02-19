module Huertask
  class PlotRevision

    include DataMapper::Resource

    property :id, Serial
    property :status, Integer, :default => 0

    belongs_to :plot, 'Plot'
    belongs_to :community_revision, 'CommunityRevision'

  end
end
