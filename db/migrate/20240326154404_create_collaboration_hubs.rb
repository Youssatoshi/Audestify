class CreateCollaborationHubs < ActiveRecord::Migration[7.1]
  def change
    create_table :collaboration_hubs do |t|
      t.string :name
      t.text :bio
      t.string :address
      t.float :latitude
      t.float :longitude
      t.string :roles
      t.integer :price
      t.references :user, null: false, foreign_key: true
      t.string :profile_picture_url
      t.integer :age

      t.timestamps
    end
  end
end
