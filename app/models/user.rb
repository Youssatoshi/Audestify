class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :social_media_accounts, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :libraries, dependent: :destroy
end
