class Task
  attr_reader :title, :date, :people_left, :category

  def initialize(dictionary)
    @title = dictionary[:title]
    @date = dictionary[:date]
    @people_left = dictionary[:people_left]
    @category = dictionary[:category]
  end

  def valid?
    return false if [@title, @date, @people_left, @category].include?(nil)
    true
  end

  def future?
    @date >= Time.now.utc
  end
end
