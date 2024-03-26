class RemoveUserFromCollaborationHubs < ActiveRecord::Migration[7.1]
  def change
    remove_reference :collaboration_hubs, :user, index: true, foreign_key: true
  end
end
