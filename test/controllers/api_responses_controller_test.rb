require 'test_helper'

class ApiResponsesControllerTest < ActionController::TestCase

  def test_create_success_with_get_request
    mock_response = mock('RestClient::Response')
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})

    RestClient::Request.expects(:execute).returns(mock_response)

    post :create, params: { url: url, method: 'get', request_headers: {"0" => {'key' => "some_request_key", 'value' => 'some_request_value'}} }

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"{id: 1}"}, api_response.response)
    assert_equal({"content_type" => 'application/json'}, api_response.response_headers)
    assert_equal({"some_request_key" => "some_request_value"}, api_response.request_headers)
  end

  def test_create_with_post_request_and_request_params

    mock_response = mock('RestClient::Response')
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})

    RestClient::Request.expects(:execute).returns(mock_response)

    post :create, params: { url: url,
                            method: 'post',
                            request_parameters: { "0" => {'key' => "some_parameter_key", 'value' => 'some_value'} },
                            request_headers: {"0" => {'key' => "some_request_key", 'value' => 'some_request_value'} }
                          }

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"{id: 1}"}, api_response.response)
    assert_equal({"some_parameter_key" => "some_value"}, api_response.request_params)
    assert_equal({"some_request_key" => "some_request_value"}, api_response.request_headers)
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
  end

  def test_show_success
    api_response = api_responses(:one)

    get :show, params: { id: api_response.token }

    expected_response = {
      url: "http://example.com",
      httpMethod: "POST",
      requestParams: {"user[name]": "John"},
      requestHeaders: {"content_type": "application/json"},
      requestBody: '{"user[name]": "John"}',
      username: 'admin',
      password: 'password',
      assertions: api_response.assertions,
      response: {
        response_headers: {"content_type": "application/json"},
        response_body: api_response.response['body'],
        response_code: "200"
      }
    }.to_json

    assert_response :success
    assert_equal expected_response, response.body
  end

  def test_show_invalid_page
    get :show, params: { id: 'invalid_token' }
    expected_response = {error: 'Invalid Page'}

    assert_equal expected_response.to_json, response.body
  end

  private

  def url
    'http://www.example.com'
  end
end
