class ApiResponsesController < ApplicationController

  before_action :get_api_request, only: [:show]
  skip_before_action :verify_authenticity_token

  def show
    render
  end

  def create
    api_response = RequestService.new(params[:url], params[:method], options).process
    redirect_to api_response_path(id: api_response.token)
  end

  private

  def get_api_request
    unless @api_response = ApiResponse.find_by({token: params[:id]})
      render 404
    end
  end

  def api_response
    {
      url: @api_response.url,
      httpMethod: @api_response.method,
      requestParams: @api_response.request_params,
      response: {
        response_headers: @api_response.response_headers,
        response_body: @api_response.response['body'],
        response_code: @api_response.status_code
      }
    }
  end

  helper_method :api_response

  def request_parameters
    ApiRequestParameterParserService.new(params).process
  end

  def options
    params.merge(request_params: request_parameters).permit!.to_h
  end
end
