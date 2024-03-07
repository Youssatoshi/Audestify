import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.ensureFBLoaded().then(() => {
      console.log("Facebook SDK is now ready");
      // Facebook SDK is ready to use, you can add additional SDK initialization code here if needed
    }).catch(error => {
      console.error("Error loading Facebook SDK: ", error);
    });
  }

  ensureFBLoaded() {
    return new Promise((resolve, reject) => {
      if (window.FB) {
        resolve(); // FB is already loaded, resolve immediately
      } else {
        // Listen for the fbAsyncInit event
        document.addEventListener('fbAsyncInit', () => {
          resolve(); // FB is loaded, resolve the promise
        }, { once: true }); // Use the { once: true } option to automatically remove the listener after it fires
      }
    });
  }

  login() {
    this.ensureFBLoaded().then(() => {
      FB.login((response) => {
        if (response.authResponse) {
          console.log("Successfully logged in with Facebook");
          this.fetchUserInfo(); // Call fetchUserInfo to retrieve and display user data
        } else {
          console.log("Facebook login failed");
          this.statusTarget.textContent = "Login failed";
        }
      }, {scope: 'public_profile,email'}); // Request permissions
    }).catch(error => {
      console.error("Error during FB.login: ", error);
    });
  }

  fetchUserInfo() {
    FB.api('/me', {fields: 'name, picture.type(large)'}, (response) => {
      if (response && !response.error) {
        // Extract the profile picture URL
        const profilePicUrl = response.picture.data.url;
        // Update the status target to show the user's name and profile picture
        this.statusTarget.innerHTML = `Logged in as ${response.name} <img src="${profilePicUrl}" alt="Profile picture">`;
      } else {
        console.error("Failed to fetch user info:", response.error);
        this.statusTarget.textContent = "Failed to fetch user information";
      }
    });
  }
}
