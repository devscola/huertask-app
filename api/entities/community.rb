module Huertask
  module Entities
    class Community < Grape::Entity
      expose :id, :name, :description
    end
  end
end
