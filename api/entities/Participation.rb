require_relative './Person'

module Huertask
  module Entities
    class Participation < Grape::Entity
      expose :person, merge: true, using: Huertask::Entities::Person
    end
  end
end
