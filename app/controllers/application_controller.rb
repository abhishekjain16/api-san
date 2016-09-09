class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_layout_carrier

  private

  def set_layout_carrier
    @layout_carrier = LayoutCarrier.new
  end
end
