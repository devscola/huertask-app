module Huertask
  class CommunityRevision

    include DataMapper::Resource

    property :id, Serial
    property :created_at, DateTime

    has n, :plot_revisions, 'PlotRevision'

  end
end
