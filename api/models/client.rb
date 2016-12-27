class Client
  # ...

  def self.authenticate(key, secret = nil)
    # Should return a Client instance matching the
    # key & secret provided (`secret` is optional).
  end
end
