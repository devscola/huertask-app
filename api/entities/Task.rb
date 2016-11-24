require_relative './person_task_relation'

module Huertask
  module Entities
    class Task < Grape::Entity
      expose :id, :created_at, :title, :from_date, :to_date, :required_people, :category, :note
      expose :people_going, using: Huertask::Entities::PersonTaskRelation
      expose :negative_replies, using: Huertask::Entities::PersonTaskRelation
    end
  end
end
