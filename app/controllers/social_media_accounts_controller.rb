class SocialMediaAccountsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  def create
    auth_token = params[:auth_token]
    user_id = current_user.id
    social_media_account = SocialMediaAccount.new(
      user_id: user_id,
      platform_name: 'Facebook',
      auth_token: auth_token,
      account_status: 1,
      account_name: 'test_account'
    )
    if social_media_account.save
      render json: { message: 'Social media account created successfully' }, status: :created
    else
      render json: { error: 'Failed to create social media account' }, status: :unprocessable_entity
    end
  end

  def index
    # Ensure only the logged-in user's accounts are fetched
    accounts = SocialMediaAccount.where(user_id: current_user.id, platform_name: 'Facebook').select(:id, :account_name, :auth_token)

    render json: accounts
  end



  private

  def social_media_account_params
    params.require(:social_media_account).permit(:auth_token)
  end
end
