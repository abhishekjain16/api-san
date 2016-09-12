require 'test_helper'

class ApiRequestsControllerTest < ActionController::TestCase

  def test_index_success
    get :index

    assert_response :success
  end

  def test_build_success
    url = "http://example.com"

    mock_response = RestClient::Response.new
    mock_response.expects(:code).returns(200)
    mock_response.expects(:body).returns("{id: 1}")
    mock_response.expects(:headers).returns({content_type: 'application/json'})


    RequestService.any_instance.expects(:process).returns(mock_response)

    post :build, params: { auth: {username: ''}, url: url }
    assert_response :success

    actual_response = JSON.parse(response.body)

    assert_equal 200, actual_response["response_code"]
    assert_not_nil actual_response["response_headers"]
    assert_not_nil actual_response["response_body"]
  end
end
