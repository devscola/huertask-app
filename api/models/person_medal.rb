module Huertask
  class PersonMedal
    include DataMapper::Resource

    property :id, Serial
    property :sender_id, String
    property :description, String
  end
end
