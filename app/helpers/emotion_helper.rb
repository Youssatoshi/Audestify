# app/helpers/emotion_helper.rb
module EmotionHelper
  def generate_random_emotion
    emotions = [
      "admiration", "amusement", "anger", "annoyance", "approval",
      "caring", "confusion", "curiosity", "desire", "disappointment",
      "disapproval", "disgust", "embarrassment", "excitement", "fear",
      "gratitude", "grief", "joy", "love", "nervousness",
      "optimism", "pride", "realization", "relief", "remorse",
      "sadness", "surprise", "neutral"
    ]

    emojis = [
      "👏", "😄", "😠", "😒", "👍",
      "❤️", "😕", "🤔", "😍", "😞",
      "👎", "🤢", "😳", "😃", "😨",
      "🙏", "😢", "😂", "❤️", "😬",
      "😌", "😊", "💡", "😅", "😔",
      "😞", "😯", "😐"
    ]

    random_index = rand(emotions.length)
    "#{emotions[random_index]}: #{emojis[random_index]}"
  end
end
