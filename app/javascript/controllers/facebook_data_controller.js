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

          // Example: Display each page's name
          data.data.forEach(page => {
              const element = document.createElement('p');
              element.textContent = `Page Name: ${page.name}`;
              this.element.appendChild(element);
          });
      })
      .catch(error => {
          console.error("Error fetching Facebook data:", error);
      });
  }
}
