require_relative './Participation'

module Huertask
  module Entities
    class Task < Grape::Entity
      expose :id, :created_at, :title, :from_date, :to_date, :required_people, :category, :note
      expose :positive_replies, using: Huertask::Entities::Participation
      expose :negative_replies, using: Huertask::Entities::Participation
    end
  end
end
