# app/controllers/social_media_accounts_controller.rb

class SocialMediaAccountsController < ApplicationController
  def update_token
    platform_name = params[:platform_name]
    account = current_user.social_media_accounts.find_by(platform_name: platform_name)
    if account
      account.update(auth_token: params[:access_token])
      render json: { message: "Access token updated successfully" }
    else
      render json: { error: "Social media account not found for platform: #{platform_name}" }, status: :not_found
    end
  end
end
