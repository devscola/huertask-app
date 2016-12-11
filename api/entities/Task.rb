require_relative './person_task_relation'
require_relative './Category'

module Huertask
  module Entities
    class Task < Grape::Entity
      expose :id, :created_at, :title, :from_date, :to_date, :required_people, :note, :status
      expose :people_going, using: Huertask::Entities::PersonTaskRelation
      expose :people_not_going, using: Huertask::Entities::PersonTaskRelation
      expose :categories, using: Huertask::Entities::Category
    end
  end
end
