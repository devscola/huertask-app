class TaskService
  def self.find_future
    [
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
  end

  def self.find_all
    [
      {
        title: "Regar parcela",
        date: "2016/10/31",
        category: "general",
        people_left: 2
      },
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
  end
end
