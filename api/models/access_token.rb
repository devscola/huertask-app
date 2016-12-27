class AccessToken
  # ...

  def self.create_for(client, resource_owner, scopes = nil)
    # Creates the record in the database for the provided client and
    # resource owner with specific scopes (if present).
    # Returns an instance of that record.
  end

  def self.authenticate(token, type: :access_token)
    # Returns an Access Token instance matching the token provided.
    # Access Token can be searched by token or refresh token value. In the
    # first case :type option must be set to :access_token (default), in
    # the second case - to the :refresh_token.
    # Note that you MAY include expired access tokens in the result
    # of this method so long as you implement an instance `#expired?`
    # method.
  end

  def client
    # Returns associated Client instance. Always must be present!
    # For ORM objects it can be an association (`belongs_to :client` for ActiveRecord).
  end

  def resource_owner
    # Returns associated Resource Owner instance.
    # Can return `nil` (for Client Credentials flow as an example).
    # For ORM objects it can be an association (`belongs_to :resource_owner` for ActiveRecord).
  end

  def scopes
    # Returns Access Token authorised set of scopes. Can be a space-separated String,
    # Array or any object, that responds to `to_a`.
  end

  def expired?
    # true if the Access Token has reached its expiration.
  end

  def revoked?
    # true if the Access Token was revoked.
  end

  def revoke!(revoked_at = Time.now)
    # Revokes an Access Token (by setting its :revoked_at attribute to the
    # specific time for example).
  end

  def to_bearer_token
    # Returns a Hash of Bearer token attributes like the following:
    #   access_token: '',      # - required
    #   refresh_token: '',     # - optional
    #   token_type: 'bearer',  # - required
    #   expires_in: '',        # - required
    #   scope: ''              # - optional
  end
end
