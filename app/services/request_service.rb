class RequestService
  attr_reader :url, :username, :password, :method, :response, :request_params

  def initialize(url, method, options={})
    @url = url
    @method = method || :get
    @username = options[:username]
    @password = options[:password]
    @request_params = options[:request_params]
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
                        request_params: request_params.is_a?(String) ? JSON.parse(request_params) : request_params )
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
    {url: url, method: method, :verify_ssl => false, headers: {content_type: :json}}.merge(authorization_options).merge(payload: request_params)
  end
end
