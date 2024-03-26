class SettingsController < ApplicationController
  def show
    def show
      @general_settings = Setting.all
    end
  end

  def account
  end

  def notifications
  end

  def privacy
  end

  def connected_accounts
  end
end
