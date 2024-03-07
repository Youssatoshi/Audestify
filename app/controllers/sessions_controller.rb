# app/controllers/sessions_controller.rb
class SessionsController < ApplicationController
  def create
    # This is where you handle the callback from Facebook
    user_data = request.env['omniauth.auth']
    # Find or create a user in your database using the data from Facebook
    # For example:
    @user = User.find_or_create_from_auth_hash(user_data)
    # Set up your session and redirect as appropriate
    session[:user_id] = @user.id
    redirect_to root_path, notice: "Connected to Facebook successfully!"
  end
end
