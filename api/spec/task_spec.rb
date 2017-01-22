require_relative '../main'
require_relative '../models/task'

describe Huertask::Task  do

  before(:each) do
    Fixtures.seed
  end

  it "should validates presence of: title, from_date, required_people and category" do
    task = Huertask::Task.new
    save_result = task.save

    expect(save_result).to be false
    expect(task.errors.size).to eq 6
    expect(task.errors[:title]).to eq ["Title must not be blank"]
    expect(task.errors[:from_date]).to eq ["From date must not be blank"]
    expect(task.errors[:categories]).to eq ["Categories must not be blank"]
    expect(task.errors[:required_people]).to eq ["Required people must not be blank"]
    expect(task.errors[:to_date]).to eq ["To date must not be blank", nil]
    expect(task.errors[:community_id]).to eq ["Community must not be blank"]
  end

  it "should validates length of: title" do
    task = Huertask::Task.new({
      "title":"",
      "from_date":"2020-01-10T13:00:00+00:00",
      "required_people":1,
      "categories": [{'id': 1, 'name': 'mantenimiento'}]
    })
    save_result = task.save

    expect(save_result).to be false
    expect(task.errors[:title]).to eq ["Title must be between 1 and 100 characters long", "Title must not be blank"]
  end

  it "should validates to_date is grather than from_date" do
    task = Huertask::Task.new({
      "title":"Fake title",
      "from_date": Time.now,
      "to_date": (Time.now - 1*60*60),
      "required_people":1,
      "categories": [{'id': 1, 'name': 'mantenimiento'}]
    })
    save_result = task.save

    expect(save_result).to be false
    expect(task.errors[:to_date]).to eq ["To date must be bigger than from date"]
  end
end

