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
