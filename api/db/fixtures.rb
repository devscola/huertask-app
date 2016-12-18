class Fixtures
  def self.seed
    Huertask::PersonTaskRelation.all.destroy
    Huertask::CategoryTaskRelation.all.destroy
    Huertask::CategoryPersonRelation.all.destroy
    Huertask::Task.all.destroy
    Huertask::Category.all.destroy
    Huertask::Person.all.destroy

    categories = ["mantenimiento",
                  "riego",
                  "carpinteria",
                  "jardineria",
                  "cultivo",
                  "cultura"]

    (1..categories.size).each do |n|
      Huertask::Category.create({
        id: n,
        name: categories[n-1],
        description: n%2==0 ? "Esta es la descripción correspondiente a la categoría #{categories[n-1]}" : nil
      })
    end

    (1..20).each do |n|
      Huertask::Person.create({
        id: n,
        name: "Persona #{n}",
        dislike_categories: [Huertask::Category[n%categories.size]]
      })
    end

    (1..6).each do |n|
      Huertask::Task.create({
        id: n,
        title: "Tarea numero #{n}",
        from_date: (Time.now + 30*24*60*60),
        to_date: (Time.now + 30*24*60*60 + 3*60*60),
        required_people: n,
        categories: [Huertask::Category[(n%categories.size)-1]],
        note: "Esta es la nota de la tarea número #{n}",
      })
    end

    (7..9).each do |n|
      Huertask::Task.create({
        id: n,
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [Huertask::Category[(n%categories.size)-1]]
      })
    end

    (1..6).each do |n|
      Huertask::PersonTaskRelation.create({
        task: Huertask::Task[n-1],
        person: Huertask::Person[n%2],
        type: 0
      })
      Huertask::PersonTaskRelation.create({
        task: Huertask::Task[n-1],
        person: Huertask::Person[2],
        type: 1
      })
    end

    (8..15).each do |n|
      Huertask::PersonTaskRelation.create({
        task: Huertask::Task[3],
        person: Huertask::Person[n],
        type: 1
      })
      Huertask::PersonTaskRelation.create({
        task: Huertask::Task[1],
        person: Huertask::Person[n],
        type: 0
      })
    end
  end
end
