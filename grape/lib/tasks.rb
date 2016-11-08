class Tasks
  def self.all
    [
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
  end

  def self.futures
    all.select {|task| future_task?(task)}
  end

  private

  def self.future_task? task
        task[:date] >= Time.now.utc
  end
end
