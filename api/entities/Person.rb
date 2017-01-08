require_relative './Category'

module Huertask
  module Entities
    class Person < Grape::Entity
      expose :id, :name, :token
      expose :dislike_categories, using: Huertask::Entities::Category
      expose :categories, using: Huertask::Entities::Category
    end
  end
end
