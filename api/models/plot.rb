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

    has 1, :personRelation, 'PersonCommunityRelation'
    has 1, :person, :through => :personRelation
    has 1, :community, :through => :personRelation

    class << self
      def find_by_id(id)
        plot = get(id)
        raise PlotNotFound.new(id) if plot.nil?
        plot
      end
    end

    def update_fields(params)
      if Plot.count(:id.not => self.id, :name=>self.name, :number=>self.number) > 0
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
  end
end
