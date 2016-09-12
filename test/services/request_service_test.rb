require 'test_helper'

class RequestServiceTest < ActiveSupport::TestCase
  def test_calls_rest_client_execute
    service = RequestService.new("http://www.example.com", {username: "username", password: "password"})
    RestClient::Request.expects(:execute).with(url: "http://www.example.com", method: :get, user: "username", password: "password")
    service.process
  end
end
