require 'test_helper'

class ApiAssertionTest < ActiveSupport::TestCase

  def test_create_set_results_with_equal
    api_response = api_responses(:one)
    api_response.response = {"body"=>"{\"id\":1}"}
    api_response.save!

    api_assertion = api_response.assertions.create(key: 'id', value: '1', comparison: 'equals')

    assert api_assertion.success
    assert_equal '1', api_assertion.api_value
  end

  def test_create_set_results_with_contains
    api_response = api_responses(:one)
    api_response.response = {"body"=>"{\"id\":19}"}
    api_response.save!

    api_assertion = api_response.assertions.create(key: 'id', value: '1', comparison: 'contains')

    assert api_assertion.success
    assert_equal '19', api_assertion.api_value
  end

  def test_create_set_results_with_less_than
    api_response = api_responses(:one)
    api_response.response = {"body"=>"{\"id\":20}"}
    api_response.save!

    api_assertion = api_response.assertions.create(key: 'id', value: '100', comparison: 'lesser than')

    assert api_assertion.success
    assert_equal '20', api_assertion.api_value
  end

  def test_create_set_results_with_greater_than
    api_response = api_responses(:one)
    api_response.response = {"body"=>"{\"id\":1}"}
    api_response.save!

    api_assertion = api_response.assertions.create(key: 'id', value: '1', comparison: 'greater than')

    refute api_assertion.success
    assert_equal '1', api_assertion.api_value
  end
end
