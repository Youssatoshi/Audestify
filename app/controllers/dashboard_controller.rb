class DashboardController < ApplicationController
  def index
    @entity_id = params[:entity_id]
    @type = params[:type]
  end

end
