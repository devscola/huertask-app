require 'dm-validations'

module Huertask
  class Task
    class TaskNotFound < StandardError
      def initialize(id)
        super("The task #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id,                Serial
    property :created_at,        DateTime
    property :title,             String, :length => 1..100
    property :from_date,         DateTime
    property :to_date,           DateTime
    property :required_people,   Integer
    property :note,              Text
    property :active,            Boolean, :default  => true
    property :status,            Integer, :default  => 0

    has n, :people_relations, 'PersonTaskRelation'
    has n, :categories_relations, 'CategoryTaskRelation'
    has n, :categories, :through => :categories_relations, :via => :category

    validates_presence_of :title, :from_date, :required_people, :categories, :to_date

    def people_going
      people_relations.all(:type => 1)
    end

    def people_not_going
      people_relations.all(:type => 0)
    end

    def update_fields(params)
      params.each do |key, value|
        self.update(key => value)
      end
    end

    def delete
      self.active = false
      save
    end

    validates_with_block :to_date do
      if @to_date && @from_date
        return true if @to_date > @from_date
        [false, "To date must be bigger than from date"]
      end
    end

    class << self
      def find_by_id(id)
        task = find_active(id)
        raise TaskNotFound.new(id) if task.nil?
        task
      end

      def future_tasks
        all(:active => true, :from_date.gte => Time.now)
      end

      def past_tasks
        all(:active => true, :from_date.lt => Time.now)
      end

      def procesed(params)
        if params.categories && (params.categories.first.is_a? Integer)
          params.categories = Category.find_by_ids(params.categories)
        end
        params
      end

      private

      def find_active(id)
        first(id: id, active: true)
      end
    end

  end
end
