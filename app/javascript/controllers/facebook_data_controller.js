import { Controller } from "@hotwired/stimulus"




export default class extends Controller {
  static values = { authToken: String }

    connect() {
      this.dataStore = {};
      this.fetchFacebookData().then(() => {this.generateFacebookComparisonChart(); this.generateSocialMediaPieChart();
      });
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
    // Create and append the button for Facebook page card
    const button = document.createElement('button');
    button.className = 'card-button';
    button.textContent = 'Dashboard';
    button.addEventListener('click', () => {
      const userAuthToken = this.authTokenValue;
      // Redirect to the dashboard with the Facebook page ID as a parameter
      window.location.href = `/dashboard?entity_id=${page.id}&type=facebook&page_auth_token=${page.access_token}&user_auth_token=${userAuthToken}`;
    });
    cardContainer.appendChild(button);

        // Append the card container to the accounts container
        this.element.appendChild(cardContainer);

        if (!this.dataStore[page.id]) this.dataStore[page.id] = {};
        this.dataStore[page.id].profilePictureUrl = profileImage.src;

        // Continue with fetching Facebook-specific metrics

        return cardContainer;
    }

    fetchInstagramProfile(pageId, fbCard) {
      const accessToken = this.authTokenValue;
      const url = `https://graph.facebook.com/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

      fetch(url)
      .then(response => response.json())
      .then(data => {
          if (!data.instagram_business_account) throw new Error('Instagram Business Account not found');
          const instagramId = data.instagram_business_account.id;

          if (!this.dataStore[instagramId]) {
              this.dataStore[instagramId] = { platform: 'Instagram' };
          }

          // Prepare URLs for the additional data you need
          const additionalDataUrls = [
              `https://graph.facebook.com/${instagramId}?fields=profile_picture_url&access_token=${accessToken}`,
              `https://graph.facebook.com/${instagramId}?fields=followers_count&access_token=${accessToken}`,
              `https://graph.facebook.com/${instagramId}/insights?metric=profile_views&period=day&access_token=${accessToken}`,
              `https://graph.facebook.com/v11.0/${instagramId}/media?fields=id&limit=1&access_token=${accessToken}`
          ];

          // Fetch additional data and pass instagramId along with the fetched data
          return Promise.all(additionalDataUrls.map(url => fetch(url)))
          .then(responses => Promise.all(responses.map(response => response.json())))
          .then(results => ({ results, instagramId }));
      })
      .then(({ results, instagramId }) => {
          const [profilePictureData, followersCountData, profileViewsData, latestMediaData] = results;

          this.dataStore[instagramId].profilePictureUrl = profilePictureData.profile_picture_url;
          this.dataStore[instagramId].followersCount = followersCountData.followers_count;
          this.dataStore[instagramId].profileViews = profileViewsData.data[0].values[0].value;

          let likesCount = 0;

          // Assuming latestMediaData has the information about the latest media
          if (latestMediaData.data.length > 0) {
              const latestMediaId = latestMediaData.data[0].id;
              const likesUrl = `https://graph.facebook.com/v11.0/${latestMediaId}/insights?metric=likes&access_token=${accessToken}`;

              return fetch(likesUrl) // Fetch likes for the latest media post
              .then(response => response.json())
              .then(likesData => {
                  likesCount = likesData.data[0].values[0].value;
                  this.dataStore[instagramId].likesCount = likesCount;
                  // Now, with all data including instagramId, create the Instagram card
                  const instagramCard = this.createInstagramCard(
                      this.dataStore[instagramId].profilePictureUrl,
                      this.dataStore[instagramId].followersCount,
                      this.dataStore[instagramId].profileViews,
                      likesCount,
                      instagramId
                  );
                  fbCard.after(instagramCard);
              });
          } else {
              // No posts available
              this.dataStore[instagramId].likesCount = "N/A";
              // Even without likes data, create and append the Instagram card
              const instagramCard = this.createInstagramCard(
                  this.dataStore[instagramId].profilePictureUrl,
                  this.dataStore[instagramId].followersCount,
                  this.dataStore[instagramId].profileViews,
                  "N/A", // Placeholder for no likes data
                  instagramId
              );
              fbCard.after(instagramCard);
          }
      })
      .catch(error => console.error('Error:', error));
  }



  createInstagramCard(profilePictureUrl, followers_count, profile_views, likesCount, instagramId) {
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
// Assuming this is within the createInstagramCard function and you have access to an instagramId variable
// Assuming instagramId is passed as an argument to createInstagramCard function
    const button = document.createElement('button');
    button.className = 'card-button';
    button.textContent = 'Dashboard';
    button.addEventListener('click', () => {
      const dashboardPath = `/dashboard?entity_id=${instagramId}&type=instagram`; // Make sure instagramId is available
      window.location.href = dashboardPath; // Modify this line to use Turbolinks if applicable
    });
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
      text.textContent = metric.emoji ? 'N/A' :  text.textContent = isFacebook ? 0 : 'N/A'; ;

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
    const fanCountUrl = `https://graph.facebook.com/${pageId}?fields=fan_count&access_token=${accessToken}`;
    const pageViewsUrl = `https://graph.facebook.com/${pageId}/insights/page_views_total?access_token=${pageAccessToken}`;

    if (!this.dataStore[pageId]) {
      this.dataStore[pageId] = {};
    }

    // Fetch fan count
    fetch(fanCountUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.fan_count !== undefined) {
          const fanCountMetric = cardContainer.querySelector('.chart-line-icon').nextElementSibling;
          fanCountMetric.textContent = data.fan_count;
          this.dataStore[pageId].fanCount = data.fan_count;
          this.checkDataLoaded();
        }
      })
      .catch(error => console.error('Error fetching fan count:', error));

    // Fetch page views
    fetch(pageViewsUrl)
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.length > 0 && data.data[0].values && data.data[0].values.length > 1) {
          const pageViews = data.data[0].values[0].value;
          const pageViewsMetric = cardContainer.querySelector('.eye-icon').nextElementSibling;
          pageViewsMetric.textContent = pageViews;
          this.dataStore[pageId].pageViews = pageViews;
          console.log(`Page views for page ${pageId}:`, pageViews);
          this.checkDataLoaded();
        }
      })
      .catch(error => console.error('Error fetching page views:', error));

    // Fetch latest post's likes
    const latestPostUrl = `https://graph.facebook.com/${pageId}/posts?limit=1&access_token=${pageAccessToken}`; // Note: Using pageAccessToken here
    fetch(latestPostUrl)
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          const latestPostId = data.data[0].id;
          const latestPostLikesUrl = `https://graph.facebook.com/${latestPostId}/insights?metric=post_reactions_by_type_total&access_token=${pageAccessToken}`;

          return fetch(latestPostLikesUrl);
        } else {
          // No posts found
          console.log("No posts available for this page.");
          return Promise.resolve("N/A"); // Handle no posts found scenario
        }
      })
      .then(response => response === "N/A" ? "N/A" : response.json())
      .then(data => {
        if (data !== "N/A" && data.data && data.data.length > 0) {
          // Sum all types of reactions
          const reactions = data.data[0].values[0].value;
          const totalReactions = Object.values(reactions).reduce((sum, current) => sum + current, 0);
          this.dataStore[pageId].totalReactions = totalReactions;
          this.checkDataLoaded();

          // Log the total reactions count
          console.log("Total Reactions for the latest post:", totalReactions);

          // Example: Update a metric in the card with totalReactions
          // This assumes you have a place in your card specifically for this metric.
          // For demonstration purposes only; adjust according to your actual UI element.
          const reactionsMetric = cardContainer.querySelector('.heart-icon').nextElementSibling;
          reactionsMetric.textContent = totalReactions.toString();
        }
      })
      .catch(error => console.error('Error fetching latest post likes:', error));


}
     // Inside your Stimulus controller

      checkDataLoaded() {
        // Assuming this method checks if all data is loaded
        console.log("DataStore contents:", this.dataStore);
        this.generateFacebookComparisonChart(); // Call chart generation here
        this.generateSocialMediaPieChart()
      }

      generateFacebookComparisonChart() {
        const labels = [];
        const facebookEngagementData = [];
        const instagramEngagementData = [];

        // Go through each entry in the data store
        Object.entries(this.dataStore).forEach(([pageId, pageInfo]) => {
          // For Facebook pages
          if (!pageInfo.platform) { // Assuming no platform specified means it's a Facebook page
            labels.push(`Fb.#${labels.length + 1}`);
            facebookEngagementData.push((pageInfo.fanCount || 0) + (pageInfo.pageViews || 0) + (pageInfo.totalReactions || 0));
            instagramEngagementData.push(0); // Push zero to keep the arrays aligned
          }
          // For Instagram accounts
          else if (pageInfo.platform === 'Instagram') {
            labels.push(`Ig.#${labels.length + 1}`);
            instagramEngagementData.push((pageInfo.followersCount || 0) + (pageInfo.profileViews || 0) + (pageInfo.likesCount || 0));
            facebookEngagementData.push(0); // Push zero to keep the arrays aligned
          }
        });

        const ctx = document.getElementById('barChartCanvas').getContext('2d');
        // Destroy the chart before creating a new one if it already exists
        if (window.myFacebookComparisonChart) {
          window.myFacebookComparisonChart.destroy();
        }

        // Create a new chart
        window.myFacebookComparisonChart = new Chart(ctx, {
          type: 'bar', // This specifies that the base chart is a bar chart
          data: {
            labels: labels,
            datasets: [
              // Facebook Bar Dataset
              {
                label: 'Facebook Engagement',
                data: facebookEngagementData,
                backgroundColor: 'rgba(59, 89, 152, 0.6)',
                borderColor: 'rgba(59, 89, 152, 1)',
                borderWidth: 1,
                type: 'bar',
              },
              // Instagram Bar Dataset
              {
                label: 'Instagram Engagement',
                data: instagramEngagementData,
                backgroundColor: 'rgba(193, 53, 132, 0.6)',
                borderColor: 'rgba(193, 53, 132, 1)',
                borderWidth: 1,
                type: 'bar',
              },
              // Progression Lines
              // They simply mirror the data in the bar datasets to trace the top
              {
                label: 'Facebook Progression',
                data: facebookEngagementData, // Same data as Facebook bar
                borderColor: 'rgba(59, 89, 152, 1)',
                type: 'line',
                fill: false,
                pointRadius: 0, // No points, just a line
              },
              {
                label: 'Instagram Progression',
                data: instagramEngagementData, // Same data as Instagram bar
                borderColor: 'rgba(193, 53, 132, 1)',
                type: 'line',
                fill: false,
                pointRadius: 0, // No points, just a line
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }

      generateSocialMediaPieChart() {
        let totalFacebookEngagement = 0;
        let totalInstagramEngagement = 0;

        // Sum up engagement for each platform
        Object.entries(this.dataStore).forEach(([pageId, pageInfo]) => {
          if (!pageInfo.platform) { // Sum for Facebook pages
            totalFacebookEngagement += Number(pageInfo.fanCount || 0) + Number(pageInfo.pageViews || 0) + Number(pageInfo.totalReactions || 0);
          } else if (pageInfo.platform === 'Instagram') { // Sum for Instagram accounts
            totalInstagramEngagement += Number(pageInfo.followersCount || 0) + Number(pageInfo.profileViews || 0) + Number(pageInfo.likesCount || 0);
          }
        });

        const ctx = document.getElementById('pieChartCanvas').getContext('2d');
        if (window.mySocialMediaPieChart) {
          window.mySocialMediaPieChart.destroy();
        }

        window.mySocialMediaPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Facebook', 'Instagram'],
            datasets: [{
              data: [totalFacebookEngagement, totalInstagramEngagement],
              backgroundColor: [
                'rgba(59, 89, 152, 0.6)', // Facebook color
                'rgba(193, 53, 132, 0.6)' // Instagram color
              ],
              borderColor: [
                'rgba(59, 89, 152, 1)',
                'rgba(193, 53, 132, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            legend: {
              position: 'top',
            },
            animation: {
              animateScale: true,
              animateRotate: true
            }
          }
        });
      }




}
