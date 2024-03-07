class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :social_media_accounts, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :libraries, dependent: :destroy

  def self.find_or_create_from_auth_hash(auth_hash)
    # Extract the provider (facebook) and the user's UID from the auth hash
    provider = auth_hash.provider
    uid = auth_hash.uid
    email = auth_hash.info.email
    name = auth_hash.info.name # Assuming you want to store the user's name

    # Use find_or_create_by to find an existing user or create a new one
    find_or_create_by(email: email) do |user|
      user.password = Devise.friendly_token[0, 20] # Generate a random password
      # Set other user attributes as needed
      user.name = name
    end
  end
end
