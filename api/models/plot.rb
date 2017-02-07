module Huertask
  class Plot

    class PlotNotFound < StandardError
      def initialize(id)
        super("The plot #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id, Serial
    property :name, String

    belongs_to :person, required: false
    belongs_to :community

    class << self
      def find_by_id(id)
        plot = get(id)
        raise PlotNotFound.new(id) if plot.nil?
        plot
      end
    end

    def assign_person(person)
      self.person = person
    end
  end
end
