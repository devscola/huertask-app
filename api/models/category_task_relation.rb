module Huertask
  class CategoryTaskRelation
    include DataMapper::Resource

    belongs_to :task,     :key => true
    belongs_to :category, :key => true
  end
end
