module Huertask
  class CommunityInvitation
    include DataMapper::Resource
    property :id, Serial
    property :type,      Integer
    property :email,     String
    belongs_to :community
  end
end
