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
        participation = Huertask::Participation.first(:task => task, :person => person)
        if participation
          participation.status = status
        else
          participation = Huertask::Participation.new({
            task: task,
            person: person,
            status: status
          })
        end
        participation
      end
    end
  end
end
