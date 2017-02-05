module Huertask
  class PersonMedal
    include DataMapper::Resource

    property :id, Serial
    property :sender_id, Integer
    property :community_id, Integer
    property :description, String
    property :created_at, DateTime
  end
end
