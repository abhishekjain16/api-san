class ApiAssertion < ApplicationRecord
  belongs_to :api_response

  before_create :set_results

  private

  def set_results
    response = JSON.parse(api_response.response_body)
    self.api_value = response[key]
    self.success = api_value ? assert_values : false
  rescue JSON::ParserError => e
    self.success = false
  end

  def assert_values
    case comparison
    when 'equals'
      api_value == value
    when 'contains'
      api_value.include?(value)
    when 'lesser than'
      api_value.to_i < value.to_i
    when 'greater than'
      api_value.to_i > value.to_i
    else
      false
    end
  end
end
