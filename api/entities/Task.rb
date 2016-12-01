require_relative './person_task_relation'

module Huertask
  module Entities
    class Task < Grape::Entity
      expose :id, :created_at, :title, :from_date, :to_date, :required_people, :category, :note, :status
      expose :people_going, using: Huertask::Entities::PersonTaskRelation
      expose :people_not_going, using: Huertask::Entities::PersonTaskRelation
    end
  end
end
