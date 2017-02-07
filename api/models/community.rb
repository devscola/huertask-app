require 'dm-validations'
require_relative './task'

module Huertask
  class Community

    UNJOINED_USER_TYPE = -1
    INVITATED_USER_TYPE = 0
    SIMPLE_USER_TYPE = 1
    ADMIN_USER_TYPE = 2

    class CommunityNotFound < StandardError
      def initialize(id)
        super("The community #{id} was not found")
      end
    end

    include DataMapper::Resource

    property :id,                     Serial
    property :name,                   String,  :length => 1..100
    property :description,            String,  :default => "", :length => 0..200
    property :task_points_enabled,    Boolean, :default => true
    property :task_points_duration,   Integer, :default => 4
    property :person_points_enabled,  Boolean, :default => true
    property :person_points_amount,   Integer, :default => 2
    property :person_points_reload,   Integer, :default => 1
    property :person_points_duration, Integer, :default => 4
    property :last_reload,           DateTime, :default => DateTime.now

    validates_presence_of :name

    has n, :people_relations, 'PersonCommunityRelation'
    has n, :people_invitations, 'CommunityInvitation'
    has n, :tasks_relations, 'TaskCommunityRelation'
    has n, :tasks, :through => :tasks_relations, :via => :task
    has n, :categories
    has n, :plots, 'Plot'

    class << self
      def find_by_id(id)
        community = get(id)
        raise CommunityNotFound.new(id) if community.nil?
        community
      end
    end

    def create_plots(prefix, quantity)
      (1..quantity.to_i).each do |n|
        name = prefix + '-' + n.to_s
        plot = Plot.new(name: name, community_id: self.id)
        self.plots << plot
      end
    end

    def next_reload
      self.last_reload + (self.person_points_reload * 30)
    end

    def update_fields(params)
      params.each do |key, value|
        self.send("#{key}=", value)
      end
    end

    def joined
      people_relations.all(:type.gte => 1, :order => [ :type.desc ])
    end

    def invited
      people_invitations.all
    end

    def invite_people(params)
      params[:simple_users].each do |email|
        invite_person(email, SIMPLE_USER_TYPE)
      end
      params[:admin_users].each do |email|
        invite_person(email, ADMIN_USER_TYPE)
      end
    end

    def invite_person(email, type)
      return if email == ""
      self.create_or_update_invitation(email, type)
      Mailer.send_invitation(email)
    end

    def create_or_update_invitation(email, type)
      invitation = CommunityInvitation.first(:community_id => self.id, :email => email)
      if invitation
        invitation.type = type
      else
        invitation = CommunityInvitation.new({
          community_id: self.id,
          email: email,
          type: type
        })
      end
      if invitation.save
        invitation
      else
        error_400(invitation)
      end
    end

    def join(person)
      if invitation = CommunityInvitation.first(:email => person.email)
        person.community_relations.all.destroy
        self.create_or_update_relation(person, invitation.type)
        invitation.destroy
      end
    end

    def unjoin(person)
        self.create_or_update_relation(person, UNJOINED_USER_TYPE)
    end

    def toggle_admin(person)
      relation = PersonCommunityRelation.first(:community_id => self.id, :person_id => person.id)
      if relation.type == ADMIN_USER_TYPE
        self.create_or_update_relation(person, SIMPLE_USER_TYPE)
      else
        self.create_or_update_relation(person, ADMIN_USER_TYPE)
      end
    end

    def create_or_update_relation(person, type)
      relation = PersonCommunityRelation.first(:community_id => self.id, :person_id => person.id)
      if relation
        relation.type = type
      else
        relation = PersonCommunityRelation.new({
          community_id: self.id,
          person_id: person.id,
          type: type
        })
      end
      if relation.save
        relation
      else
        error_400(relation)
      end
    end

    def future_tasks(skip_categories)
      tasks.all(:active => true, :from_date.gte => Time.now, :categories_relations => {:category_id.not => skip_categories }, :order => [ :from_date.asc ])
    end

    def past_tasks(skip_categories)
      tasks.all(:active => true, :from_date.lt => Time.now, :categories_relations => {:category_id.not => skip_categories }, :order => [ :from_date.desc ])
    end
  end
end
