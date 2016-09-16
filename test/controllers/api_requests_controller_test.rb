require 'test_helper'

class ApiRequestsControllerTest < ActionController::TestCase

  def test_index_success
    get :index

    assert_response :success
  end
end
