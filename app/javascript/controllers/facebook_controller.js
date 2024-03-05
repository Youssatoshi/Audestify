import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.checkLoginState();
  }

  checkLoginState() {
    FB.getLoginStatus(response => {
      this.statusChangeCallback(response);
    });
  }

  statusChangeCallback(response) {
    if (response.status === 'connected') {
      this.statusTarget.textContent = 'Facebook Connected';
      console.log("User is logged in and authenticated", response);
    } else if (response.status === 'not_authorized') {
      this.statusTarget.textContent = 'Please log into this app.';
      console.log("The user is logged in to Facebook, but not your app", response);
    } else {
      this.statusTarget.textContent = 'Please log into Facebook.';
      console.log("The user isn't logged in to Facebook.", response);
    }
  }

  login() {
    FB.login(response => {
      this.checkLoginState();
    }, {scope: 'public_profile,email,instagram_basic,instagram_graph_user_media,instagram_manage_insights,pages_show_list'});
  }

  checkPermissions() {
    FB.api('/me/permissions', response => {
      console.log(response); // Log the response to see granted permissions
      // Optionally, process the response to update the UI or alert the user
      this.processPermissions(response.data);
    });
  }

  processPermissions(permissions) {
    // Example: Iterate through permissions and log them
    permissions.forEach(permission => {
      if (permission.status === 'granted') {
        console.log(`${permission.permission}: granted`);
      }
    });
    // Further processing logic here
  }

  // Modify your statusChangeCallback or login response handling to call checkPermissions
  statusChangeCallback(response) {
    if (response.status === 'connected') {
      this.statusTarget.textContent = 'Facebook Connected';
      console.log("User is logged in and authenticated", response);
      this.checkPermissions(); // Call the permission check here
    } else {
      // Handle other statuses
    }
  }

}
