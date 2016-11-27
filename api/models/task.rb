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

    has n, :people_relations, 'PersonTaskRelation'

    validates_presence_of :title, :from_date, :required_people, :category

    def people_going
      people_relations.all(:type => 1)
    end

    def people_not_going
      people_relations.all(:type => 0)
    end

    if nil != @from_date
      validates_with_block @from_date do
        if @from_date > Time.now
          true
        else
          [false, "from_date must be bigger than now"]
        end
      end
    end

    if nil != @to_date && nil != @from_date
      validates_with_block @to_date do
        return true if @to_date > @from_date
        [false, "to_date must be bigger than from_date"]
      end
    end
  end
end
