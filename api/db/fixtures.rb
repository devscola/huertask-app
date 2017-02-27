class Fixtures
  def self.seed
    Huertask::PlotRevision.all.destroy
    Huertask::CommunityRevision.all.destroy
    Huertask::PersonTaskRelation.all.destroy
    Huertask::PersonCommunityRelation.all.destroy
    Huertask::PersonMedal.all.destroy
    Huertask::CommunityInvitation.all.destroy
    Huertask::CategoryTaskRelation.all.destroy
    Huertask::CategoryPersonRelation.all.destroy
    Huertask::TaskCommunityRelation.all.destroy
    Huertask::Task.all.destroy
    Huertask::Category.all.destroy
    Huertask::Plot.all.destroy
    Huertask::Person.all.destroy
    Huertask::Community.all.destroy

    categories = ["mantenimiento",
                  "riego",
                  "carpinteria",
                  "jardineria",
                  "cultivo",
                  "cultura"]

    (1..2).each do |n|
      Huertask::Community.create({
        name: "Comunidad #{n}",
        description: "Información sobre la comunidad #{n}"
      })
    end

    (1..categories.size).each do |n|
      Huertask::Category.create({
        name: categories[n-1],
        description: n%2==0 ? "Descripción de #{categories[n-1]}" : nil,
        community: Huertask::Community.first
      })
    end

    (1..categories.size).each do |n|
      Huertask::Category.create({
        name: "#{categories[n/2-1]} (com2)",
        description: n%2==0 ? "Descripción de #{categories[n-1]}" : nil,
        community: Huertask::Community.last
      })
    end

    community = Huertask::Community.first

    community.people_invitations.create({email: "person4@devscola.org", type: 2})
    community.save

    person = Huertask::Person.new({
      name: "miguelonga",
      email: "miguelmundiaragones@gmail.com",
      password: "123456789",
      password_confirmation: "123456789",
      dislike_categories: [Huertask::Category.first]
    })
    person.set_password('123456789')
    person.save

    person = Huertask::Person.new({
      name: "davidpardiez",
      email: "davidpardiez@gmail.com",
      password: "123456789",
      password_confirmation: "123456789",
      dislike_categories: [Huertask::Category.first]
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

    (1..20).each do |n|
      Huertask::PersonCommunityRelation.create({
        person_id: Huertask::Person[n-1].id,
        community_id: Huertask::Community[n%2].id,
        type: n<5 ?
              Huertask::Community::ADMIN_USER_TYPE :
              Huertask::Community::SIMPLE_USER_TYPE
      })
    end

    (1..6).each do |n|
      task = Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now + 30*24*60*60),
        to_date: (Time.now + 30*24*60*60 + 3*60*60),
        required_people: n,
        categories: [community.categories[(n%categories.size)-1]],
        note: "Esta es la nota de la tarea número #{n}",
        community_id: community.id
      })
      community.tasks << task
      community.save
    end

    (7..9).each do |n|
      task = Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [community.categories[(n%categories.size)-1]],
        community_id: community.id
      })
      community.tasks << task
      community.save
    end

    (10..15).each do |n|
      task = Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [community.categories[(n%categories.size)-1]],
        community_id: community.id
      })
      community.tasks << task
      community.save
    end

    community = Huertask::Community.last

    (1..6).each do |n|
      task = Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now + 30*24*60*60),
        to_date: (Time.now + 30*24*60*60 + 3*60*60),
        required_people: n,
        categories: [community.categories[(n%categories.size)-1]],
        note: "Esta es la nota de la tarea número #{n}",
        community_id: community.id
      })
      community.tasks << task
      community.save
    end

    (7..9).each do |n|
      task = Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [community.categories[(n%categories.size)-1]],
        community_id: community.id
      })
      community.tasks << task
      community.save
    end

    (10..15).each do |n|
      task = Huertask::Task.create({
        title: "Tarea numero #{n}",
        from_date: (Time.now - 2*60*60),
        to_date: n.odd? ? (Time.now - 1*60) : (Time.now + 1*60),
        required_people: n,
        categories: [community.categories[(n%categories.size)-1]],
        community_id: community.id
      })
      community.tasks << task
      community.save
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
