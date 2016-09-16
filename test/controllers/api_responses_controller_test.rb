require 'test_helper'

class ApiResponsesControllerTest < ActionController::TestCase

  def test_create_success
    url = "http://example.com"

    mock_response = mock('RestClient::Response')
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})

    RestClient::Request.expects(:execute).returns(mock_response)


    post :create, params: { auth: {username: ''}, url: url }

    api_response = ApiResponse.last
    assert_equal '200', api_response.status_code
    assert_equal({"body"=>"{id: 1}"}, api_response.response)
    assert_equal({"content_type" => 'application/json'}, api_response.response_headers)
    assert_redirected_to api_response_path(id: api_response.token)
  end

  def test_show_success
    service = RequestService.new("http://www.example.com", {username: "username", password: "password"})
    response = mock('RestClient::Response')
    response.expects(:body).returns('{id: 1}')
    response.expects(:headers).returns({})
    response.expects(:code).returns(200)
    RestClient::Request.expects(:execute).with(url: "http://www.example.com", method: :get, user: "username", password: "password", verify_ssl: false).returns(response)
    service.process

    api_response = ApiResponse.last

    get :show, params: { id: api_response.token }
    assert_response :success
  end
end
