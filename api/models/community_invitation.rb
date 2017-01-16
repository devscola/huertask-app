module Huertask
  class CommunityInvitation
    include DataMapper::Resource
    property :id, Serial
    property :type,      Integer
    property :email,     String
    property :community_id, Integer
  end
end
