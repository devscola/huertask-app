module Huertask
  class Participation
    include DataMapper::Resource

    belongs_to :task,   :key => true
    belongs_to :person, :key => true
  end
end
