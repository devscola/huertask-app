module Huertask
  module Repository
    class Tasks

      class TaskNotFound < StandardError
        def initialize(id)
          super("The task #{id} was not found")
        end
      end

      NOT_GOING_TYPE = 0
      GOING_TYPE = 1

      class << self

        def find_by_id(id)
          task = find_active(id)
          raise TaskNotFound.new(id) if task.nil?
          task
        end

        def future_tasks
          Task.all(:active => true, :from_date.gte => Time.now)
        end

        def past_tasks
          Task.all(:active => true, :from_date.lt => Time.now)
        end

        def enroll(task, person)
          create_or_update_relation(task, person, GOING_TYPE)
        end

        def unroll(task, person)
          create_or_update_relation(task, person, NOT_GOING_TYPE)
        end

        private

        def find_active(id)
          Task.first(id: id, active: true)
        end

        def create_or_update_relation(task, person, type)
          relation = Huertask::PersonTaskRelation.first(:task => task, :person => person)
          if relation
            relation.type = type
          else
            relation = Huertask::PersonTaskRelation.new({
              task: task,
              person: person,
              type: type
            })
          end
          relation
        end
      end
    end
  end
end
