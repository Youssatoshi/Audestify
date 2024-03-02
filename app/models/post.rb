class Post < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :social_media_accounts
  enum post_status: { unpublished: 0, published: 1, draft: 2 }
  validates :content, presence: true
end
