require_relative '../../models/task'

filtered_json = [
  {
    title: "Recoger tomates",
    date: "2016/12/07",
    category: "cosecha",
    people_left: 1
  },
  {
    title: "Barrer entrada",
    date: "2016/12/09",
    category: "limpieza",
    people_left: 4
  },
  {
    title: "Traer leña",
    date: "2016/12/12",
    category: "general",
    people_left: 1
  },
  {
    title: "Quitar malas hierbas",
    date: "2016/12/02",
    category: "limpieza",
    people_left: 5
  },
  {
    title: "Ampliar parcelas zona oeste",
    date: "2016/12/13",
    category: "general",
    people_left: 9
  }
]

class TaskServiceStub
  def self.find_future

    future_tasks = Array.new

    filtered_json.each do |dictionary|
      task = Task.new(dictionary)
      future_tasks.push(task)
    end

    future_tasks
  end
end
