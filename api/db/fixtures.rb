class Fixtures
  def self.seed
    Huertask::Participation.all.destroy
    Huertask::Task.all.destroy
    Huertask::Person.all.destroy

    (1..3).each do |n|
      Huertask::Person.create({
        id: n,
        name: "Persona #{n}"
      })
    end

    (1..6).each do |n|
      Huertask::Task.create({
        id: n,
        title: "Tarea numero #{n}",
        from_date: "2020-11-12T13:00:00+00:00",
        people: n,
        category: n,
        note: "Esta es la nota de la tarea número #{n}",
        participants: [Huertask::Person[n%2], Huertask::Person[2]]
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
