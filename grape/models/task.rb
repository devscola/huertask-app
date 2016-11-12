module Huertask
  class Task
    include DataMapper::Resource

    property :id,          Serial
    property :title,       String, :length => 1..100
    property :from_date,   DateTime
    property :to_date,     DateTime
    property :people,      Integer
    property :category,    String
    property :note,        Text

    validates_presence_of :title, :from_date, :people, :category

    if nil != @from_date
      validates_with_block @from_date do
        return true if @from_date > Time.now
        [false, "from_date must be bigger than now"]
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
