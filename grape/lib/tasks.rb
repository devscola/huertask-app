require_relative './task'

class Tasks
  def self.all
    tasks = Array.new

    raw_data = [
      {
        title: "Recoger tomates",
        date: "2012-01-01 00:00:00",
        category: "cosecha",
        people_left: 1
      },
      {
        title: "Barrer entrada",
        date: "2016-12-09 00:00:00",
        category: "limpieza",
        people_left: 4
      },
      {
        title: "Traer leña",
        date: "2016-12-12 00:00:00",
        category: "general",
        people_left: 1
      },
      {
        title: "Quitar malas hierbas",
        date: "2016-12-02 00:00:00",
        category: "limpieza",
        people_left: 5
      },
      {
        title: "Ampliar parcelas zona oeste",
        date: "2016-12-13 00:00:00",
        category: "general",
        people_left: 9
      }
    ]

    raw_data.each do |data_chunk|
      new_task = Task.new(data_chunk)
      tasks.push(new_task)
    end

    tasks
  end

  def self.futures
    all.select {|task| task.future?}
  end
end
