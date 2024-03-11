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

    // Create the Facebook icon
    const fbIcon = document.createElement('i');
    fbIcon.className = 'fab fa-facebook-square facebook-icon';
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


  appendMetrics(cardContainer) {
    // Metrics container
    const metricsContainer = document.createElement('div');
    metricsContainer.className = 'metrics-container mb-5';
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
      text.textContent = metric.name;
      metricElement.appendChild(text);

      metricsContainer.appendChild(metricElement);
    });


    // Insert the metrics container into the card
    const imageContainer = cardContainer.querySelector('.card-image-container');
    cardContainer.insertBefore(metricsContainer, imageContainer.nextSibling);
  }




}
