require 'dm-validations'

module Huertask
  class Task
    include DataMapper::Resource

    property :id,                Serial
    property :created_at,        DateTime
    property :title,             String, :length => 1..100
    property :from_date,         DateTime
    property :to_date,           DateTime
    property :required_people,   Integer
    property :category,          String
    property :note,              Text
    property :active,            Boolean, :default  => true
    property :status,            Integer, :default  => 0

    has n, :people_relations, 'PersonTaskRelation'

    validates_presence_of :title, :from_date, :required_people, :category, :to_date

    def people_going
      people_relations.all(:type => 1)
    end

    def people_not_going
      people_relations.all(:type => 0)
    end

    validates_with_block :to_date do
      if @to_date && @from_date
        return true if @to_date > @from_date
        [false, "To date must be bigger than from date"]
      end
    end
  end
end
