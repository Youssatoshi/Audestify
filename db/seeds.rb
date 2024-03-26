# db/seeds.rb

# Require the Faker gem
require 'faker'

# Define the number of collaboration hubs you want to create
NUM_HUBS = 50

# Roles related to content creators and digital media
content_creator_roles = [
  "Videographer", "Scriptwriter", "Lifestyle Coach", "Model",
  "Photographer", "Digital Marketer", "Graphic Designer", "Web Developer",
  "Blogger", "Influencer", "Music Producer", "Podcaster", "Animator",
  "UI/UX Designer", "SEO Specialist", "Game Developer", "Content Strategist",
  "Social Media Manager", "Copywriter", "Art Director", "Voice Over Artist",
  "Illustrator", "Fashion Designer", "Event Planner", "PR Specialist"
]

# Create fake collaboration hubs
NUM_HUBS.times do |index|
  CollaborationHub.create!(
    name: Faker::Name.name,
    bio: Faker::Lorem.paragraph(sentence_count: 5),
    roles: content_creator_roles.sample,
    price: rand(1..99),
    profile_picture_url: "https://i.pravatar.cc/300?img=#{index + 10}",
    age: Faker::Number.between(from: 18, to: 39)
  )
end

puts "Collaboration hubs have been created successfully!"
