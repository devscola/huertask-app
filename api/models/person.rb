module Huertask
  class Person

    DIGEST = OpenSSL::Digest.new('sha1')


    class PersonNotFound < StandardError
      def initialize(id)
        super("The person #{id} was not found")
      end
    end

    include DataMapper::Resource

    attr_accessor :password, :password_confirmation, :token

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

    has n, :people_relations, 'PersonTaskRelation'
    has n, :categories_relations, 'CategoryPersonRelation'
    has n, :dislike_categories, 'Category', :through => :categories_relations, :via => :category
    has n, :community_relations, 'PersonCommunityRelation'

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

      def get_skipped_categories(user_id)
        return [] if user_id.nil?
        Person.find_by_id(user_id).dislike_categories.map { |cat| cat.id  }
      end

      def encrypt(pass, salt)
        Digest::SHA1.hexdigest(pass + salt)
      end
    end

    def create_auth_token
      key =  ENV['AUTH_SECRET'] || "asnjlfkdlskfjlksdfjlkasdjflñaksdjfklñadjsfklñajglñkjfdlñkjlkjlñkj"
      timestamp = Time.now.to_i.to_s
      data = (self.id.to_s + "-" + timestamp)
      hmac = OpenSSL::HMAC.hexdigest(DIGEST, key, data)
      self.token = hmac + ":#{timestamp}"
    end

    def validate_auth_token(token)
      return false if !token
      key =  ENV['AUTH_SECRET']
      timestamp = token.split(":").last
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
  end
end
