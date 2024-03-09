class SocialMediaAccount < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :posts
  enum account_status: { inactive: 0, active: 1, suspended: 2 }
  validates :platform_name, :account_name, presence: true

  def self.facebook_tokens_for_user(user_id)
    where(user_id: user_id, platform_name: 'Facebook').pluck(:auth_token)
  end
end
