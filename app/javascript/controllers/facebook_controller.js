import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    if (typeof FB !== 'undefined') {
      this.initializeFacebookSDK();
    } else {
      document.addEventListener('fbAsyncInit', this.initializeFacebookSDK.bind(this));
    }
  }

  initializeFacebookSDK() {
    console.log("Facebook SDK initialized");
    // Now that the SDK is initialized, you can check login status or call FB.login here as needed
  }

  login() {
    FB.login((response) => {
      if (response.authResponse) {
        console.log("Successfully logged in with Facebook");
        this.fetchUserInfo(); // Call fetchUserInfo to retrieve and display user data
      } else {
        console.log("Facebook login failed");
        this.statusTarget.textContent = "Login failed";
      }
    }, {scope: 'public_profile,email'});
  }

  fetchUserInfo() {
    FB.api('/me', {fields: 'name'}, (response) => {
      if (response && !response.error) {
        // Update the status target to show the user's name
        this.statusTarget.textContent = `Logged in as ${response.name}`;
        console.log(response); // Log the response to see all available user info
      }
    });
  }
}
