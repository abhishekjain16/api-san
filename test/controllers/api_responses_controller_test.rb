require 'test_helper'

class ApiResponsesControllerTest < ActionController::TestCase

  def test_create_success_with_get_request
    mock_response = mock('RestClient::Response')
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})

    RestClient::Request.expects(:execute).returns(mock_response)

    post :create, params: { url: url, method: 'get', request_headers: [{'key' => "some_request_key", 'value' => 'some_request_value'}] }

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"{id: 1}"}, api_response.response)
    assert_equal({"content_type" => 'application/json'}, api_response.response_headers)
    assert_equal({"some_request_key" => "some_request_value"}, api_response.request_headers)
    assert_redirected_to api_response_path(id: api_response.token)
  end

  def test_create_with_post_request_and_request_params

    mock_response = mock('RestClient::Response')
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})

    RestClient::Request.expects(:execute).returns(mock_response)

    post :create, params: { url: url,
                            method: 'post',
                            request_parameters: [{'key' => "some_parameter_key", 'value' => 'some_value'}],
                            request_headers: [{'key' => "some_request_key", 'value' => 'some_request_value'}]
                          }

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"{id: 1}"}, api_response.response)
    assert_equal({"some_parameter_key" => "some_value"}, api_response.request_params)
    assert_equal({"some_request_key" => "some_request_value"}, api_response.request_headers)
    assert_redirected_to api_response_path(id: api_response.token)
  end

  def test_create_with_put_request_and_request_body

    mock_response = mock('RestClient::Response')
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})

    RestClient::Request.expects(:execute).returns(mock_response)

    post :create, params: { url: url, method: 'put', request_body: '{"post": {"title": "New title"}}' }

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"post"=>"{\"title\"=>\"New title\"}"}, api_response.request_params)
    assert_redirected_to api_response_path(id: api_response.token)
  end

  def test_show_success
    service = RequestService.new(url, 'get', {username: "username", password: "password", request_params: {}, request_headers: {"Content_Type" => "application/json"}})
    response = mock('RestClient::Response')
    response.expects(:body).returns('{id: 1}')
    response.expects(:headers).returns({})
    response.expects(:code).returns(200)
    RestClient::Request.expects(:execute).with(url: "http://www.example.com", method: 'get', verify_ssl: false, user: "username", password: "password", :headers => {"Content_Type" => "application/json"}, :payload => {}).returns(response)
    service.process

    api_response = ApiResponse.last

    get :show, params: { id: api_response.token }
    assert_response :success
  end

  private

  def url
    'http://www.example.com'
  end
end
