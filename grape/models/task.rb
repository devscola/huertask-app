module Huertask
  class Task
    include DataMapper::Resource

    property :id,          Serial
    property :title,       String
    property :date,        DateTime
    property :people,      Integer
    property :category,    String
  end
end
