module Huertask
  class Tasks
    def future_tasks
      Task.all.sort{|x,y| y <=> x }.select {|task| future_task?(task)}
    end

    def past_tasks
      Task.all.sort{|x,y| y <=> x }.select {|task| past_task?(task)}
    end
  end
end

