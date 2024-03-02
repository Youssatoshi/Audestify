require "test_helper"

class SocialSyncControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get social_sync_index_url
    assert_response :success
  end
end
