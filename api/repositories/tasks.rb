module Huertask
  module Repository
    class Tasks

      NOT_GOING_TYPE = 0
      GOING_TYPE = 1

      class << self

        def enroll(task, person)
          create_or_update_relation(task, person, GOING_TYPE)
        end

        def unroll(task, person)
          create_or_update_relation(task, person, NOT_GOING_TYPE)
        end

        private

        def create_or_update_relation(task, person, type)
          relation = Huertask::PersonTaskRelation.first(:task => task, :person => person)
          if relation
            relation.type = type
          else
            relation = Huertask::PersonTaskRelation.new({
              task_id: task.id,
              person_id: person.id,
              type: type
            })
          end
          relation
        end
      end
    end
  end
end
