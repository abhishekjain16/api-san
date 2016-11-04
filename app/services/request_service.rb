class RequestService
  include ActiveModel::Validations

  attr_reader :url, :username, :password, :method, :response, :request_params, :request_headers, :request_body
  attr_accessor :api_response

  validates :url, :method, presence: true

  def initialize(url, method, options={})
    @url = url
    @method = method || :get
    @username = options[:username]
    @password = options[:password]
    @request_params = options[:request_params]
    @request_body = options[:request_body]
    @request_headers = options[:request_headers]
  end

  def process
    if valid?
      begin
        @response = RestClient::Request.execute(options)
      rescue RestClient::ExceptionWithResponse => e
        @response = e.response
      end
      self.api_response = save_api_response
    end
  end

  private

  def save_api_response
    ApiResponse.create!(url: url,
                        method: method.upcase,
                        response: response_body,
                        response_headers: response.headers,
                        status_code: response.code,
                        request_headers: request_headers,
                        request_params: request_params.is_a?(String) ? JSON.parse(request_params) : request_params,
                        username: username,
                        password: password,
                        request_body: request_body
                       )
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
    {url: url, method: method, :verify_ssl => false, headers: request_headers}.merge(authorization_options).merge(payload: request_params)
  end
end
