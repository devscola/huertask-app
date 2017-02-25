module Huertask
  class Person

    DIGEST = OpenSSL::Digest.new('sha1')
    ADMIN_USER_TYPE = 2
    ATTENDED_USER_TYPE = 4

    class PersonNotFound < StandardError
      def initialize(id)
        super("The person #{id} was not found")
      end
    end

    class InsufficientAvailablePersonPoints < StandardError
      def initialize(id)
        super("The person #{id} does not have enough points")
      end
    end

    include DataMapper::Resource

    attr_accessor :password,
                  :password_confirmation,
                  :token,
                  :community_relation

    property :id, Serial
    property :name, String
    property :email, String, :required => true, :unique => true,
      :format   => :email_address,
      :messages => {
        :presence  => "Necesitamos tu email.",
        :is_unique => "El email ya existe.",
        :format    => "Formato de email incorrecto"
      }
    property :hashed_password, String
    property :salt, String, :unique => true

    property :available_person_points, Integer, :default => 1

    has n, :task_relations, 'PersonTaskRelation'
    has n, :categories_relations, 'CategoryPersonRelation'
    has n, :dislike_categories, 'Category', :through => :categories_relations, :via => :category
    has n, :community_relations, 'PersonCommunityRelation'
    has n, :person_medals, 'PersonMedal'
    has n, :plots, 'Plot', :through => :community_relations

    def categories
      Category.active.select{ |cat| !dislike_categories.include? cat }
    end

    class << self
      def signup(params)
        person = Person.new(params)
        person.set_password(params[:password])
        person
      end

      def authenticate(username_or_email, pass)
        current_user = first(:name => username_or_email) || first(:email => username_or_email)
        return nil if current_user.nil? || encrypt(pass, current_user.salt) != current_user.hashed_password
        current_user
      end

      def find_by_id(id)
        person = get(id)
        raise PersonNotFound.new(id) if person.nil?
        person
      end

      def find_by_token(token)
        return false if !token
        id = token.split(":").last
        find_by_id(id)
      end

      def get_skipped_categories(user_id)
        return [] if user_id.nil?
        Person.find_by_id(user_id).dislike_categories.map { |cat| cat.id  }
      end

      def encrypt(pass, salt)
        Digest::SHA1.hexdigest(pass + salt)
      end
    end

    def is_admin?(community_id)
      relation = self.community_relations.first(person_id: self.id, community_id: community_id)
      return true if relation.type == ADMIN_USER_TYPE
      false
    end

    def set_community(community_id)
      self.community_relation = self.community_relations.first(community_id: community_id)
    end

    def default_community
      relation = self.community_relations.first(person_id: self.id)
      return 0 unless relation
      relation.community_id
    end

    def community_id()
      return default_community unless self.community_relation
      self.community_relation.community.id
    end

    def invitations
      CommunityInvitation.all(email: self.email)
    end

    def finalized_tasks(days = nil)
      return task_relations.all(:task => {status: 1}, type: ATTENDED_USER_TYPE) unless days
      days_in_seconds = days * 24 * 60 * 60
      from_date = Time.now - days_in_seconds
      task_relations.all(:task => {status: 1, :from_date.gte => from_date}, type: ATTENDED_USER_TYPE)
    end

    def person_points(days = nil)
      community_id = self.community_relation.community.id
      return person_medals.all(community_id: community_id) unless days
      seconds = days * 24 * 60 * 60;
      person_medals.all(:created_at.gte => Time.now - seconds, community_id: community_id)
    end

    def plot_points()
      days = self.community_relation.community.plot_points_duration * 30
      self.community_relation.plot.points(days)
    end

    def create_auth_token
      key =  (ENV['AUTH_SECRET'] || "asnjlfkdlskfjlksdfjlkasdjflñaksdjfklñadjsfklñajglñkjfdlñkjlkjlñkj")
      timestamp = Time.now.to_i.to_s
      data = (self.id.to_s + "-" + timestamp)
      hmac = OpenSSL::HMAC.hexdigest(DIGEST, key, data)
      self.token = hmac + ":#{timestamp}:#{self.community_id}:#{self.id}"
    end

    def validate_auth_token(token)
      return false if !token
      key =  ENV['AUTH_SECRET'] || "asnjlfkdlskfjlksdfjlkasdjflñaksdjfklñadjsfklñajglñkjfdlñkjlkjlñkj"
      timestamp = token.split(":")[1]
      token = token.split(":").first
      data = (self.id.to_s + "-" + timestamp)
      hmac = OpenSSL::HMAC.hexdigest(DIGEST, key, data)
      return hmac == token
    end

    def add_favorite_category(category_id)
      category = Category.find_by_id(category_id)
      relation = categories_relations.first(:category => category)
      raise Huertask::CategoryPersonRelation::CategoryPersonRelationNotFound.new if relation.nil?
      relation.destroy
    end

    def remove_favorite_category(category_id)
      category = Category.find_by_id(category_id)
      self.dislike_categories << category
      self.save
    end

    def set_password(pass)
      self.salt = (1..12).map{(rand(26)+65).chr}.join if !self.salt
      self.hashed_password = Person.encrypt(pass, salt)
    end

    def donate_person_points(receiver, community_id, description)
      raise Person::InsufficientAvailablePersonPoints.new(self.id) if self.available_person_points<1
      medal =receiver.person_medals.create(sender_id: self.id, community_id: community_id, description: description)
      self.available_person_points -= 1
      medal if self.save
    end

  end
end
