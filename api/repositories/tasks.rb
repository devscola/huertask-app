module Huertask
  module Repository
    class Tasks
      def self.future_tasks
        Task.all(:from_date.gte => Time.now)
      end

      def self.past_tasks
        Task.all(:from_date.lt => Time.now)
      end

      def self.create_or_update_participation(task, person, status)
        relation = Huertask::PersonTaskRelation.first(:task => task, :person => person)
        if relation
          relation.status = status
        else
          relation = Huertask::PersonTaskRelation.new({
            task: task,
            person: person,
            status: status
          })
        end
        relation
      end
    end
  end
end
