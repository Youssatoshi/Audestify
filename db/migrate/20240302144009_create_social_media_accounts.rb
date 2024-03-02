class CreateSocialMediaAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :social_media_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :platform_name
      t.string :account_name
      t.string :auth_token
      t.integer :account_status

      t.timestamps
    end
  end
end
