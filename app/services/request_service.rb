class RequestService
  attr_reader :url, :username, :password, :method, :response, :params

  def initialize(url, options={})
    @url = url
    @username = options[:username]
    @password = options[:password]
    @params = options[:params]
    @method = options[:method] || :get
  end

  def process
    begin
      @response = RestClient::Request.execute(options)
    rescue RestClient::ExceptionWithResponse => e
      @response = e.response
    end
    save_api_response
  end

  private

  def save_api_response
    ApiResponse.create!(url: url,
                        method: method.upcase,
                        response: response_body,
                        response_headers: response.headers,
                        status_code: response.code,
                        request_params: params )
  end

  def authorization_options
    if username && password
      {user: username, password: password}
    else
      {}
    end
  end

  def response_body
    {
      body: response.body
    }
  end

  def options
    {url: url, method: method, :verify_ssl => false}.merge(authorization_options)
  end
end
