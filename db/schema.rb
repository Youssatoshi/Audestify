# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_03_26_155114) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "collaboration_hubs", force: :cascade do |t|
    t.string "name"
    t.text "bio"
    t.string "address"
    t.float "latitude"
    t.float "longitude"
    t.string "roles"
    t.integer "price"
    t.string "profile_picture_url"
    t.integer "age"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "libraries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "item_type"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_libraries_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "content"
    t.datetime "scheduled_time"
    t.integer "post_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "posts_social_media_accounts", id: false, force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "social_media_account_id", null: false
    t.index ["post_id"], name: "index_posts_social_media_accounts_on_post_id"
    t.index ["social_media_account_id"], name: "index_posts_social_media_accounts_on_social_media_account_id"
  end

  create_table "social_media_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "platform_name"
    t.string "account_name"
    t.string "auth_token"
    t.integer "account_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_social_media_accounts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "libraries", "users"
  add_foreign_key "posts", "users"
  add_foreign_key "social_media_accounts", "users"
end
