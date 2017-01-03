module Huertask
  module Entities
    class Category < Grape::Entity
      expose :id, :name, :description, :mandatory
    end
  end
end
