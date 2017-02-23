module Huertask
  class Plot

    class PlotNotFound < StandardError
      def initialize(id)
        super("The plot #{id} was not found")
      end
    end

    class PlotNameAlreadyUsed < StandardError
      def initialize(name, number)
        super("Plot '#{name} #{number}' already exists")
      end
    end

    include DataMapper::Resource

    property :id, Serial
    property :name, String
    property :number, Integer
    property :active, Boolean, :default => true
    property :status, Integer, :required => false

    has 1, :personRelation, 'PersonCommunityRelation'
    has 1, :person, :through => :personRelation

    class << self
      def find_by_id(id)
        plot = get(id)
        raise PlotNotFound.new(id) if plot.nil?
        plot
      end
    end

    def update_fields(params)
      if Plot.count(:id.not => self.id, :active => true, :name => self.name, :number => self.number) > 0
        raise PlotNameAlreadyUsed.new(self.name, self.number)
      end
      params.each do |key, value|
        if key == 'person_id'
          self.setPerson(value)
        else
          self.send("#{key}=", value)
        end
      end
    end

    def setPerson(person_id)
      personRelation = Huertask::PersonCommunityRelation.first(person_id: person_id, community_id: self.community_id)
      self.personRelation = personRelation
    end

    def delete
      self.personRelation = nil
      self.active = false
      save
    end
  end
end
