require "test_helper"

class SocialMediaAccountsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get social_media_accounts_show_url
    assert_response :success
  end
end
