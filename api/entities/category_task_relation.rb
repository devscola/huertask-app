require_relative './Category'

module Huertask
  module Entities
    class CategoryTaskRelation < Grape::Entity
      expose :category, merge: true, using: Huertask::Entities::Category
    end
  end
end
