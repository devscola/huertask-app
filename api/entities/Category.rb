module Huertask
  module Entities
    class Category < Grape::Entity
      expose :id, :name
    end
  end
end
