module Huertask
  module Entities
    class Person < Grape::Entity
      expose :id, :name
    end
  end
end
