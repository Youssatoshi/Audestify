class Library < ApplicationRecord
  belongs_to :user

  validates :item_type, :content, presence: true
end
