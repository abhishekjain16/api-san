class ApiRequestsController < ApplicationController

  def index
    render component: 'ApiRequestForm'
  end
end
