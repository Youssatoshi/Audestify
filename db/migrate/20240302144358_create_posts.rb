class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :content
      t.datetime :scheduled_time
      t.integer :post_status

      t.timestamps
    end
  end
end
