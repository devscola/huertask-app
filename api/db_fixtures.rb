class DbFixtures
  def self.seed
    Huertask::Task.all.destroy

    (1..6).each do |n|
      Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: "2020-11-12T13:00:00+00:00",
        people: n,
        category: n
      })
    end

    (1..3).each do |n|
      Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: "2016-01-10T13:00:00+00:00",
        people: n,
        category: n
      })
    end
  end
end
