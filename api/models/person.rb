module Huertask
  class Person

    class PersonNotFound < StandardError
      def initialize(id)
        super("The person #{id} was not found")
      end
    end

    include DataMapper::Resource

    attr_accessor :password, :password_confirmation

    property :id, Serial
    property :name, String
    property :email, String, :required => true, :unique => true,
      :format   => :email_address,
      :messages => {
        :presence  => "Necesitamos tu email.",
        :is_unique => "El email ya existe.",
        :format    => "Formato de email incorrecto"
      }
    property :hashed_password, String, :writer => :protected
    property :salt, String, :writer => :protected, :unique => true

    validates_presence_of :password_confirmation
    validates_confirmation_of :password

    has n, :people_relations, 'PersonTaskRelation'
    has n, :categories_relations, 'CategoryPersonRelation'
    has n, :dislike_categories, 'Category', :through => :categories_relations, :via => :category

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
