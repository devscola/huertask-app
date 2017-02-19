module Huertask
  module Entities
    class CommunityRevision < Grape::Entity
      expose :id, :created_at, :plot_revisions
    end
  end
end
