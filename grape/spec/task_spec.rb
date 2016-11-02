class Task
  attr_reader :title

  def initialize(dictionary)
    @title = dictionary[:title]
  end
end

describe Task  do
  it 'has a title' do
    data = {title: "recoger lechugas"}
    task = Task.new(data)

    title = task.title

    expect(title).to eq(data[:title])
  end
end
