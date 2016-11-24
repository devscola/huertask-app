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
        required_people: n,
        category: n,
        note: "Esta es la nota de la tarea número #{n}",
      })
    end

    (7..9).each do |n|
      Huertask::Task.create({
        id: n,
        title: "Tarea numero #{n}",
        from_date: "2000-01-10T13:00:00+00:00",
        required_people: n,
        category: 2
      })
    end

    (1..6).each do |n|
      Huertask::Participation.create({
        task: Huertask::Task[n-1],
        person: Huertask::Person[n%2],
        status: 0
      })
      Huertask::Participation.create({
        task: Huertask::Task[n-1],
        person: Huertask::Person[2],
        status: 1
      })
    end
  end
end
