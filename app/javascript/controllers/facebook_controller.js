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
    // This function is called once the SDK is initialized
    console.log("Facebook SDK initialized");
    // You can check login status or call FB.login here as needed
  }

  login() {
    FB.login((response) => {
      if (response.authResponse) {
        console.log("Successfully logged in with Facebook");
        this.statusTarget.textContent = "Logged in";
        // Additional actions after successful login
      } else {
        console.log("Facebook login failed");
        this.statusTarget.textContent = "Login failed";
      }
    }, {scope: 'public_profile,email'});
  }
}
