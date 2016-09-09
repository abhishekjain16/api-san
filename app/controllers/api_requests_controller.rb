class ApiRequestsController < ApplicationController

  def index
    render component: 'ApiRequest'
  end

  def build
    response = RequestService.new(params[:url], params[:auth]).process
    render json: {response_headers: response.headers, response_code: response.code, response_body: JSON.parse(response.body)}
  end
end
