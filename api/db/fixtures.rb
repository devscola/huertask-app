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
        name: categories[n-1],
        description: n%2==0 ? "Descripción de #{categories[n-1]}" : nil
      })
    end

    person = Huertask.new({
      name: "miguelonga",
      email: "miguelmundiaragones@gmail.com",
      password: "123456789",
      password_confirmation: "123456789",
      dislike_categories: [Huertask::Category[n%categories.size]]
    })
    person.set_password('123456789')
    person.save

    person = Huertask.new({
      name: "davidpardiez",
      email: "davidpardiez@gmail.com",
      password: "123456789",
      password_confirmation: "123456789",
      dislike_categories: [Huertask::Category[n%categories.size]]
    })
    person.set_password('123456789')
    person.save

    (1..20).each do |n|
      person = Huertask::Person.new({
        name: "Persona #{n}",
        email: "person#{n}@devscola.org",
        password: "123456789",
        password_confirmation: "123456789",
        dislike_categories: [Huertask::Category[n%categories.size]]
      })
      person.set_password('123456789')
      person.save
    end

    (1..6).each do |n|
      Huertask::Task.create({
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
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [Huertask::Category[(n%categories.size)-1]]
      })
    end

    (10..15).each do |n|
      Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [Huertask::Category[(n%categories.size)-1]]
      })
    end

    (1..7).each do |n|
      Huertask::PersonTaskRelation.create({
        task_id: Huertask::Task[n-1].id,
        person_id: Huertask::Person[n%2].id,
        type: 0
      })
      Huertask::PersonTaskRelation.create({
        task_id: Huertask::Task[n-1].id,
        person_id: Huertask::Person[2].id,
        type: 1
      })
    end

    (8..15).each do |n|
      Huertask::PersonTaskRelation.create({
        task_id: Huertask::Task[3].id,
        person_id: Huertask::Person[n].id,
        type: 1
      })
      Huertask::PersonTaskRelation.create({
        task_id: Huertask::Task[1].id,
        person_id: Huertask::Person[n].id,
        type: 0
      })
    end
  end
end
