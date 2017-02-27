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
    belongs_to :community, 'Community'
    has n, :revisions, 'PlotRevision'

    class << self
      def find_by_id(id)
        plot = get(id)
        raise PlotNotFound.new(id) if plot.nil?
        plot
      end
    end

    def addRevision(status)
      self.revisions.new(:status => status, :created_at => Time.now)
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

    def points(days)
      days_in_seconds = days * 24 * 60 * 60
      from_date = Time.now - days_in_seconds
      self.revisions.all(:community_revision => {:created_at.gt => from_date}).map do |revision|
        {
          status: revision.status,
          date: revision.community_revision.created_at
        }
      end
    end
  end
end
