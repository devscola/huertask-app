require_relative './Category'

module Huertask
  module Entities
    class PersonEmail < Grape::Entity
      expose :id, :name, :email
    end
    class Person < Grape::Entity
      expose :id, :name, :token
      expose :dislike_categories, using: Huertask::Entities::Category
      expose :categories, using: Huertask::Entities::Category
    end
  end
end
