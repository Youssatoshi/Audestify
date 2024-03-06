import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["status", "name", "posts"]

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
      this.fetchUserData();
    } else if (response.status === 'not_authorized') {
      this.statusTarget.textContent = 'Please log into this app.';
    } else {
      this.statusTarget.textContent = 'Please log into Facebook.';
    }
  }

  login() {
    FB.login(response => {
      this.checkLoginState();
    }, {scope: 'public_profile,email,user_posts'});
  }

  fetchUserData() {
    FB.api('/me', {fields: 'name,email'}, (response) => {
      if (response && !response.error) {
        this.nameTarget.textContent = `Welcome, ${response.name}`;
        this.fetchUserPosts();
      }
    });
  }

  fetchUserPosts() {
    FB.api('/me/posts', {limit: 5, fields: 'message,created_time'}, (response) => {
      if (response && !response.error) {
        let postsContent = "Latest posts:<br>";
        response.data.forEach((post) => {
          postsContent += `${post.message} (Posted on: ${new Date(post.created_time).toLocaleDateString()})<br>`;
        });
        this.postsTarget.innerHTML = postsContent;
      }
    });
  }
}
