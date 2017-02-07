module Huertask
  class Plot
    include DataMapper::Resource

    property :id, Serial
    property :name, String
    property :person_name, String

    belongs_to :community
  end
end
