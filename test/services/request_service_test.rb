require 'test_helper'

class RequestServiceTest < ActiveSupport::TestCase

  def test_calls_rest_client_execute
    service = RequestService.new(url, 'get', {username: "username", password: "password", request_params: {}})
    response = mock('RestClient::Response')
    response.expects(:body).returns('Response')
    response.expects(:headers).returns({})
    response.expects(:code).returns(200)
    RestClient::Request.expects(:execute).with(url: url, method: 'get', verify_ssl: false, user: "username", password: "password", :headers => {:content_type => :json}, :payload => {}).returns(response)
    service.process

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"Response"}, api_response.response)
    assert_equal({}, api_response.response_headers)
  end

  def test_calls_rest_client_execute_with_post_and_request_params
    request_params = {"post[title]" => "My new post", "post[user_id]" => "18"}
    service = RequestService.new(url, 'post', {username: "username", password: "password", request_params: request_params})
    response = mock('RestClient::Response')
    response.expects(:body).returns('Response')
    response.expects(:headers).returns({})
    response.expects(:code).returns(200)
    RestClient::Request.expects(:execute).with(url: url, method: 'post', verify_ssl: false, user: "username", password: "password", :headers => {:content_type => :json}, :payload => request_params).returns(response)
    service.process

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"Response"}, api_response.response)
    assert_equal(request_params, api_response.request_params)
  end

  def test_calls_rest_client_execute_with_post_and_request_body
    request_params = '{"post": {"title": "My new title"}}'
    service = RequestService.new(url, 'post', {username: "username", password: "password", request_params: request_params})
    response = mock('RestClient::Response')
    response.expects(:body).returns('Response')
    response.expects(:headers).returns({})
    response.expects(:code).returns(200)
    RestClient::Request.expects(:execute).with(url: url, method: 'post', verify_ssl: false, user: "username", password: "password", :headers => {:content_type => :json}, :payload => request_params).returns(response)
    service.process

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"Response"}, api_response.response)
    assert_equal({"post"=>"{\"title\"=>\"My new title\"}"}, api_response.request_params)
  end
  private

  def url
    "http://www.example.com"
  end
end
