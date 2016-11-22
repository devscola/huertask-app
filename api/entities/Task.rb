module Huertask
  module Entities
    class Task < Grape::Entity
      expose :id, :created_at, :title, :from_date, :to_date, :people, :category, :note
      expose :participants, :using => 'Huertask::Entities::Person'
    end
  end
end
