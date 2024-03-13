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
    this.appendMetrics(cardContainer, true); // True indicates it's a Facebook card

    // Fetch and update Facebook-specific metrics
    this.fetchFacebookMetrics(page.id, cardContainer);

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
          return fetch(instagramUrl);
        } else {
          throw new Error('Instagram Business Account not found');
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.profile_picture_url) {
          const instagramCard = this.createInstagramCard(data.profile_picture_url);
          fbCard.after(instagramCard); // Insert the Instagram card directly after the Facebook card
        }
      })
      .catch(error => {
        console.error('Error fetching Instagram profile picture:', error);
      });
  }

  createInstagramCard(profilePictureUrl) {
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
      { name: '', iconClass: 'fas fa-chart-line chart-line-icon', animationClass: 'rise'},
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
      text.textContent = metric.emoji ? 'N/A' :  text.textContent = isFacebook ? 'Loading...' : 'N/A'; ;

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

  fetchFacebookMetrics(pageId, cardContainer) {
    const accessToken = this.authTokenValue;
    const fanCountUrl = `https://graph.facebook.com/${pageId}?fields=fan_count&access_token=${accessToken}`;
    const pageViewsUrl = `https://graph.facebook.com/${pageId}/insights/page_views_total?period=days_28&access_token=${accessToken}`;

    // Fetch fan count
    fetch(fanCountUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.fan_count !== undefined) {
          // Update fan count in the card
          const fanCountMetric = cardContainer.querySelector('.heart-icon').nextElementSibling;
          fanCountMetric.textContent = data.fan_count;
        }
      })
      .catch(error => console.error('Error fetching fan count:', error));

    // Fetch page views
    fetch(pageViewsUrl)
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.length > 0 && data.data[0].values && data.data[0].values.length > 1) {
          // Assuming data format and finding the correct metric to update
          const pageViews = data.data[0].values[1].value; // Adjust based on actual API response format
          const pageViewsMetric = cardContainer.querySelector('.eye-icon').nextElementSibling;
          pageViewsMetric.textContent = pageViews;
        } else {
          console.error('Unexpected data structure:', data);
        }
      })
      .catch(error => console.error('Error fetching page views:', error));
  }




}
