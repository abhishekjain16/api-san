class ApiResponsesController < ApplicationController

  before_action :get_api_request, only: [:show]
  skip_before_action :verify_authenticity_token

  def show
    render
  end

  def create
    request_service = RequestService.new(params[:url], params[:method], options)
    request_service.process
    if request_service.errors.present?
      render json: request_service.errors
    else
      render json: request_service.api_response
    end
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
      requestHeaders: @api_response.request_headers,
      response: {
        response_headers: @api_response.response_headers,
        response_body: @api_response.response['body'],
        response_code: @api_response.status_code
      }
    }
  end

  helper_method :api_response

  def options
    api_request_parser_service = ApiRequestParserService.new(params)
    request_headers = api_request_parser_service.process_headers
    request_parameters = api_request_parser_service.process_parameters
    params.merge(request_params: request_parameters).merge(request_headers: request_headers).permit!.to_h
  end
end
