class ApiRequestParameterParserService

  attr_reader :request_parameters, :request_body

  def initialize(parameters)
    @request_parameters = parameters[:request_parameters]
    @request_body = parameters[:request_body]
  end

  def process
    if request_parameters.present?
      parsed_params = {}
      request_parameters.each do |param|
        parsed_params[param[:key]] = param[:value]
      end
      parsed_params
    elsif request_body.present?
      request_body
    else
      {}
    end
  end
end
