require_relative './Category'

module Huertask
  module Entities
    class CategoryPersonRelation < Grape::Entity
      expose :dislike_categories, merge: true, using: Huertask::Entities::Category
    end
  end
end
