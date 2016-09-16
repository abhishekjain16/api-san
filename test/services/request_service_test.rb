require 'test_helper'

class RequestServiceTest < ActiveSupport::TestCase
  def test_calls_rest_client_execute
    service = RequestService.new("http://www.example.com", {username: "username", password: "password"})
    response = mock('RestClient::Response')
    response.expects(:body).returns('Response')
    response.expects(:headers).returns({})
    response.expects(:code).returns(200)
    RestClient::Request.expects(:execute).with(url: "http://www.example.com", method: :get, user: "username", password: "password", verify_ssl: false).returns(response)
    service.process

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"Response"}, api_response.response)
    assert_equal({}, api_response.response_headers)
  end
end
