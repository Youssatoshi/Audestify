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

  ensureFBLoaded() {
    return new Promise((resolve, reject) => {
      if (window.FB) {
        resolve();
      } else {
        document.addEventListener('fbAsyncInit', resolve);
      }
    });
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
    FB.api('/me', {fields: 'name, picture.type(large)'}, (response) => {
      if (response && !response.error) {
        // Create an image element to display the profile picture
        const profilePic = `<img src="${response.picture.data.url}" alt="Profile picture">`;

        // Update the status target to show the user's name and profile picture
        this.statusTarget.innerHTML = `Logged in as ${response.name} ${profilePic}`;
      } else {
        console.error("Failed to fetch user info:", response.error);
        this.statusTarget.textContent = "Failed to fetch user information";
      }
    });
}

}
