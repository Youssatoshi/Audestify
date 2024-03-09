// app/javascript/controllers/social_media_accounts_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["cardsContainer"]

  connect() {
    this.fetchSocialMediaAccounts();
  }

  fetchSocialMediaAccounts() {
    // Endpoint in your Rails app that returns the user's social media accounts with access tokens
    fetch('/your_endpoint_to_get_social_media_accounts_with_tokens')
      .then(response => response.json())
      .then(data => {
        if (data.accounts) {
          data.accounts.forEach(account => {
            this.fetchPages(account.auth_token);
          });
        }
      })
      .catch(error => console.error('Error fetching social media accounts:', error));
  }

  fetchPages(accessToken) {
    const url = `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          data.data.forEach(page => {
            this.fetchPageProfilePicture(page.id, accessToken);
          });
        }
      })
      .catch(error => console.error('Error fetching pages:', error));
  }

  fetchPageProfilePicture(pageId, accessToken) {
    const url = `https://graph.facebook.com/v19.0/${pageId}?fields=picture&access_token=${accessToken}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.picture) {
          this.displayPage(data.picture.data.url, pageId);
        }
      })
      .catch(error => console.error('Error fetching profile picture:', error));
  }

  displayPage(pictureUrl, pageId) {
    const cardHtml = `
      <div class="card" style="width: 18rem;">
        <img src="${pictureUrl}" class="card-img-top" alt="Page Profile Picture">
        <div class="card-body">
          <h5 class="card-title">Page ID: ${pageId}</h5>
        </div>
      </div>
    `;
    this.cardsContainerTarget.innerHTML += cardHtml;
  }
}
