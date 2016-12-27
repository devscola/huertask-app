module Huertask
  class Authorization

    include DataMapper::Resource

    belongs_to :user
    validates_presence_of :user_id, :uid, :provider
    validates_uniqueness_of :uid, :scope => :provider
  end
end
