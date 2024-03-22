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
  end
end
