class DashboardController < ApplicationController
  require 'open-uri'
  require 'json'
  before_action :permit_media_params, only: [:index]

  def index
    @type = params[:type]
    @media_data = []

    if @type == 'instagram'
      access_token = SocialMediaAccount.any_token_for_user(current_user.id)
      if access_token.present?
        media_urls = fetch_instagram_media_urls_simple(params[:entity_id], access_token)
        media_insights = fetch_media_insights(params[:entity_id], access_token)

        @media_data = media_urls.zip(media_insights).map do |url, insights|
          { url: url, insights: insights }
        end
      else
        Rails.logger.info "No access token found for user #{current_user.id}"
      end
    end
  end

  private

  def fetch_media_insights(instagram_id, access_token)
    media_ids = fetch_media_ids(instagram_id, access_token)

    threads = media_ids.map do |media_id|
      Thread.new do
        Thread.current[:insight] = {
          id: media_id,
          likes: fetch_insight(media_id, 'likes', access_token),
          comments_count: fetch_comments_count(media_id, access_token),
          reach: fetch_insight(media_id, 'reach', access_token),
          total_interactions: fetch_insight(media_id, 'total_interactions', access_token)
        }
      end
    end

    insights_data = threads.map do |thread|
      thread.join
      thread[:insight]
    end

    insights_data
  end

  def fetch_insight(media_id, metric, access_token)
    cache_key = "insight_#{media_id}_#{metric}"
    Rails.cache.fetch(cache_key, expires_in: 10.minutes) do
      insights_url = "https://graph.facebook.com/v19.0/#{media_id}/insights?metric=#{metric}&access_token=#{access_token}"
      insights_response = fetch_url(insights_url)
      insights_response['data'].first['values'].first['value'] rescue 0
    end
  end

  def fetch_comments_count(media_id, access_token)
    cache_key = "comments_count_#{media_id}"
    Rails.cache.fetch(cache_key, expires_in: 10.minutes) do
      media_info_url = "https://graph.facebook.com/v19.0/#{media_id}?fields=comments_count&access_token=#{access_token}"
      media_info_response = fetch_url(media_info_url)
      media_info_response['comments_count'] rescue 0
    end
  end

  def fetch_instagram_media_urls_simple(instagram_id, access_token)
    media_ids = fetch_media_ids(instagram_id, access_token)

    threads = media_ids.map do |media_id|
      Thread.new do
        media_url_info_url = "https://graph.facebook.com/v19.0/#{media_id}?fields=media_url&access_token=#{access_token}"
        Thread.current[:media_url] = fetch_url(media_url_info_url)['media_url'] rescue nil
      end
    end

    media_urls = threads.map do |thread|
      thread.join
      thread[:media_url]
    end.compact

    media_urls
  end

# Adjust fetch_media_ids to limit the media IDs right after fetching
    def fetch_media_ids(instagram_id, access_token)
      cache_key = "media_ids_#{instagram_id}"
      Rails.cache.fetch(cache_key, expires_in: 60.minutes) do
        media_ids_url = "https://graph.facebook.com/#{instagram_id}/media?access_token=#{access_token}"
        media_ids_response = fetch_url(media_ids_url)
        # Directly limit the number of media IDs to 6 after fetching
        (media_ids_response['data'].map { |media| media['id'] } rescue []).take(6)
      end
    end

  def fetch_url(url)
    JSON.parse(URI.open(url).read)
  rescue OpenURI::HTTPError, JSON::ParserError => e
    Rails.logger.debug "Error fetching URL: #{e.message}"
    {}
  end

  def permit_media_params
    params.permit(:entity_id, :user_auth_token, :type)
  end
end
