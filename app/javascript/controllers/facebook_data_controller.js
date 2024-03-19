import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { authToken: String }

    connect() {
      this.fetchFacebookData();
    }

    fetchFacebookData() {
      const accessToken = this.authTokenValue;
      const url = `https://graph.facebook.com/me/accounts?access_token=${accessToken}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          // Here you would process and display your data
          console.log(data);
          this.element.innerHTML = '';

          // Example: Display each page's name
          data.data.forEach(page => {
            const fbCard = this.createPageCard(page);
            this.fetchInstagramProfile(page.id, fbCard);

          });
      })
      .catch(error => {
          console.error("Error fetching Facebook data:", error);
      });
  }



  createPageCard(page) {
    // Create the card container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'accounts-card';

    // Create the image container and the image element
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image-container';
    const profileImage = document.createElement('img');
    profileImage.src = `https://graph.facebook.com/${page.id}/picture?type=large&access_token=${this.authTokenValue}`;
    profileImage.alt = 'Profile';
    profileImage.className = 'card-image';
    imageContainer.appendChild(profileImage);

    // Append the image container to the card container
    cardContainer.appendChild(imageContainer);

    // Create the Facebook icon
    const fbIcon = document.createElement('i');
    fbIcon.className = 'fab fa-facebook-square facebook-icon';
    imageContainer.appendChild(fbIcon);

    // Append metrics container to the card
    this.appendMetrics(cardContainer, true);
    console.log(page.id);
    console.log(page.access_token);
    // Fetch and update Facebook-specific metrics

    this.fetchFacebookMetrics(page.id, cardContainer, page.access_token);

    // Create and append the button
    const button = document.createElement('button');
    button.className = 'card-button';
    button.textContent = 'Dashboard';
    cardContainer.appendChild(button);

    // Append the card container to the accounts container
    this.element.appendChild(cardContainer);
    return cardContainer;
}

  fetchInstagramProfile(pageId, fbCard) {
    const accessToken = this.authTokenValue;
    const url = `https://graph.facebook.com/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.instagram_business_account) {
          const instagramId = data.instagram_business_account.id;
          const instagramUrl = `https://graph.facebook.com/${instagramId}?fields=profile_picture_url&access_token=${accessToken}`;
          const followsCountUrl = `https://graph.facebook.com/${instagramId}?fields=followers_count&access_token=${accessToken}`;
          const profileViewsUrl = `https://graph.facebook.com/${instagramId}/insights?metric=profile_views&period=day&access_token=${accessToken}`;
          const latestMediaUrl = `https://graph.facebook.com/v11.0/${instagramId}/media?fields=id&limit=1&access_token=${accessToken}`;

          // Initial Promise.all to fetch profile picture, followers count, and profile views
          return Promise.all([fetch(instagramUrl), fetch(followsCountUrl), fetch(profileViewsUrl), fetch(latestMediaUrl)]);
        } else {
          throw new Error('Instagram Business Account not found');
        }
      })
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        const profile_picture_url = data[0].profile_picture_url;
        const followers_count = data[1].followers_count;
        const profile_views = data[2].data[0].values[0].value;

        if(data[3].data.length > 0) {
          const latestMediaId = data[3].data[0].id;
          const likesUrl = `https://graph.facebook.com/v11.0/${latestMediaId}/insights?metric=likes&access_token=${accessToken}`;

          // Fetch likes for the latest media post
          fetch(likesUrl)
            .then(response => response.json())
            .then(likesData => {
              const likesCount = likesData.data[0].values[0].value;

              // Now, with likesCount, create the Instagram card
              const instagramCard = this.createInstagramCard(profile_picture_url, followers_count, profile_views, likesCount);
              fbCard.after(instagramCard);
            })
            .catch(error => console.error('Error fetching likes:', error));
        }
      })
      .catch(error => {
        console.error('Error fetching Instagram profile details:', error);
      });
  }



  createInstagramCard(profilePictureUrl, followers_count, profile_views, likesCount) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'accounts-card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image-container';

    const profileImage = document.createElement('img');
    profileImage.src = profilePictureUrl;
    profileImage.alt = 'Instagram Profile';
    profileImage.className = 'card-image';
    imageContainer.appendChild(profileImage);

    // Create the Facebook icon
    const fbIcon = document.createElement('i');
    fbIcon.className = 'fab fa-instagram-square instagram-icon';
    imageContainer.appendChild(fbIcon);

    // Append the image container to the card container
    cardContainer.appendChild(imageContainer);

    // Create the first card content container
    this.appendMetrics(cardContainer);
    // Create the button
    const button = document.createElement('button');
    button.className = 'card-button';
    button.textContent = 'Dashboard';
    cardContainer.appendChild(button);

    // Finally, append the card container to the accounts container
    this.element.appendChild(cardContainer);
    const pageViewsMetric = cardContainer.querySelector('.chart-line-icon').nextElementSibling;
    pageViewsMetric.textContent = followers_count;
    const profileViewsMetric = cardContainer.querySelector('.eye-icon').nextElementSibling;
    profileViewsMetric.textContent = profile_views;
    const likesMetric = cardContainer.querySelector('.heart-icon').nextElementSibling;
    likesMetric.textContent = likesCount;
    return cardContainer;
  }


  appendMetrics(cardContainer, isFacebook = true) {
    // Metrics container
    const metricsContainer = document.createElement('div');
    metricsContainer.className = 'metrics-container mb-3';
    metricsContainer.style.display = 'flex';
    metricsContainer.style.justifyContent = 'space-between';
    metricsContainer.style.alignItems = 'center';
    metricsContainer.style.marginTop = '10px';

    // Define metrics and icons with additional classes for color and animation
    const metrics = [
      { name: '', iconClass: 'fas fa-heart heart-icon', animationClass: 'beat' },
      { name: '', iconClass: 'fas fa-user-group chart-line-icon', animationClass: 'rise'},
      { name: '', iconClass: 'fas fa-eye eye-icon', animationClass: 'blink', value: '' },
      { name: 'Sentiment', emoji: '🤔', animationClass: 'curious' }
    ];

    // Create metric elements
    metrics.forEach(metric => {
      const metricElement = document.createElement('div');
      metricElement.className = 'metric-element';
      metricElement.style.display = 'flex';
      metricElement.style.flexDirection = 'column';
      metricElement.style.alignItems = 'center';

      const icon = document.createElement('div');
      if (metric.emoji) {
        icon.textContent = metric.emoji;
        icon.className = `metric-icon ${metric.animationClass}`;
      } else {
        icon.className = `${metric.iconClass} metric-icon`;
      }
      metricElement.appendChild(icon);

      const text = document.createElement('span');
      text.className = 'metric-text';
      text.textContent = metric.emoji ? 'N/A' :  text.textContent = isFacebook ? 'NPY' : 'N/A'; ;

      // Add a special class if the metric has an emoji
      if (metric.emoji) {
        text.classList.add('emoji-text-adjustment');
      }

      metricElement.appendChild(text);
      metricsContainer.appendChild(metricElement);
    });

    // Insert the metrics container into the card
    const imageContainer = cardContainer.querySelector('.card-image-container');
    cardContainer.insertBefore(metricsContainer, imageContainer.nextSibling);
  }

  fetchFacebookMetrics(pageId, cardContainer, pageAccessToken) {
    const accessToken = this.authTokenValue;
    let totalScore = 0; // Initialize total score

    const fanCountUrl = `https://graph.facebook.com/${pageId}?fields=fan_count&access_token=${accessToken}`;
    const pageViewsUrl = `https://graph.facebook.com/${pageId}/insights/page_views_total?access_token=${pageAccessToken}`;
    const latestPostUrl = `https://graph.facebook.com/${pageId}/posts?limit=1&access_token=${pageAccessToken}`;

    // Helper function to handle metric values, converting "NPY" or undefined to 0
    const handleMetricResponse = (metricValue) => {
      return (!isNaN(metricValue) && metricValue !== undefined && metricValue !== "NPY") ? parseInt(metricValue, 10) : 0;
    };

    // Fetch fan count
    fetch(fanCountUrl)
      .then(response => response.json())
      .then(data => {
        const fanCount = handleMetricResponse(data.fan_count);
        totalScore += fanCount;
        return fetch(pageViewsUrl); // Chain the next fetch call
      })
      .then(response => response.json())
      .then(data => {
        const pageViews = data.data && data.data.length > 0 ? handleMetricResponse(data.data[0].values[0].value) : 0;
        totalScore += pageViews;
        return fetch(latestPostUrl); // Chain the next fetch call
      })
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          const latestPostId = data.data[0].id;
          const latestPostLikesUrl = `https://graph.facebook.com/${latestPostId}/insights?metric=post_reactions_by_type_total&access_token=${pageAccessToken}`;
          return fetch(latestPostLikesUrl); // Fetch reactions for the latest post
        } else {
          console.log("No posts available for this page.");
          return { data: [{ values: [{ value: {} }] }] }; // Default to 0 likes if no posts are found
        }
      })
      .then(response => {
        if (response.json) return response.json();
        return response; // Handle the direct return in case of no posts
      })
      .then(data => {
        const totalReactions = data.data && data.data.length > 0 ? handleMetricResponse(Object.values(data.data[0].values[0].value).reduce((sum, current) => sum + current, 0)) : 0;
        totalScore += totalReactions;
        console.log(`Total Score for account ${pageId}:`, totalScore); // Log the total score for this account
      })
      .catch(error => console.error('Error fetching metrics for account ID ' + pageId + ':', error)); // Catch any errors in the fetch chain
  }

}
