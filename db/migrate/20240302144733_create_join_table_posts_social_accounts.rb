class CreateJoinTablePostsSocialAccounts < ActiveRecord::Migration[7.1]
  def change
    create_join_table :posts, :social_media_accounts do |t|
      # Adds index on :post_id for faster querying through posts
      t.index :post_id
      # Adds index on :social_media_account_id for faster querying through social media accounts
      t.index :social_media_account_id
    end
  end
end
