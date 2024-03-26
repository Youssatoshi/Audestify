class CollaborationHubsController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:index, :show]
  # before_action :set_collaboration_hub, only: [:show, :edit, :update, :destroy]

  def index
    @collaboration_hubs = CollaborationHub.all
  end

  def show
  end

  def new
    @collaboration_hub = CollaborationHub.new
  end

  def create
    @collaboration_hub = CollaborationHub.new(collab_params)
    @collaboration_hub.user = current_user
    if @collaboration_hub.save
      redirect_to @collaboration_hub, notice: 'Profile was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  # Ensure you define :edit, :update, :destroy actions here as needed.

  private

    def set_collaboration_hub
      @collaboration_hub = CollaborationHub.find(params[:id])
    end

    def collab_params
      params.require(:collaboration_hub).permit(:name, :bio, :roles, :price, :profile_picture_url, :age)
    end
end
