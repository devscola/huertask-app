module Huertask
  module Repository
    class Tasks
      def self.future_tasks
        Task.all(:from_date.gte => Time.now)
      end

      def self.past_tasks
        Task.all(:from_date.lt => Time.now)
      end
    end
  end
end
