module Huertask
  module Repository
    class Tasks
      def self.future_tasks
        Task.all(:active => true, :from_date.gte => Time.now)
      end

      def self.past_tasks
        Task.all(:active => true, :from_date.lt => Time.now)
      end

      def self.create_or_update_relation(task, person, type)
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
