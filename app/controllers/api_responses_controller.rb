class ApiResponsesController < ApplicationController

  before_action :get_api_request, only: [:show]
  skip_before_action :verify_authenticity_token

  def show
    render component: 'ApiResponse', props: api_response
  end

  def create
    api_response = RequestService.new(params[:url], params[:auth]).process
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
      response: {
        response_headers: @api_response.response_headers, 
        response_body: @api_response.response['body'],
        response_code: @api_response.status_code
      }
    }
  end
end
