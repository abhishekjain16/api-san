class RequestService
  attr_reader :url, :username, :password, :method

  def initialize(url, options={})
    @url = url
    @username = options[:username]
    @password = options[:password]
    @method = options[:method] || :get
  end

  def process
    RestClient::Request.execute(options)
  end

  private

  def authorization_options
    if username && password
      {user: username, password: password}
    else
      {}
    end
  end

  def options
    {url: url, method: method}.merge(authorization_options)
  end
end
