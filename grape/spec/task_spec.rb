class Task
  attr_reader :title, :date, :people_left, :category

  def initialize(dictionary)
    @title = dictionary[:title]
    @date = dictionary[:date]
    @people_left = dictionary[:people_left]
    @category = dictionary[:category]

    validate_properties
  end

  def validate_properties
    raise ArgumentError if [@title, @date, @people_left, @category].include?(nil)
  end
end

describe Task  do

  let(:data) {{title: "recoger lechugas", date: Date.new(2016, 10, 10), people_left: 5, category: "Cosecha"}}

  it 'has a title' do
    task = Task.new(data)

    title = task.title

    expect(title).to eq(data[:title])
  end

  it 'has a date' do
    task = Task.new(data)

    date = task.date

    expect(date).to eq(data[:date])
  end

  it 'has a number of people to fill' do
    task = Task.new(data)

    people = task.people_left

    expect(people).to eq(data[:people_left])
  end

  it 'has a category' do
    task = Task.new(data)

    category = task.category

    expect(category).to eq(data[:category])
  end

  it 'cannot has a nil member' do
    data_without_people = {title: "recoger lechugas", date: Date.new(2016, 02, 10)}

    expect {Task.new(data_without_people)}.to raise_error(ArgumentError)
  end
end
