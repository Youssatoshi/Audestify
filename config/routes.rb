Rails.application.routes.draw do
  get 'settings/show'
  get 'settings/account'
  get 'settings/notifications'
  get 'settings/privacy'
  get 'settings/connected_accounts'
  get 'library/index'
  get 'posts/show'
  get 'posts/new'
  get 'posts/create'
  get 'posts/update'
  get 'dashboard/index'
  get 'social_sync/index'
  devise_for :users
  root to: "pages#home"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # Note: You have two root routes defined. Make sure to use only one to avoid conflicts.
  # root "posts#index"
  # config/routes.rb
  # If you haven't already, add a route for the callback
  # config/routes.rb




  # Home

  # Define resources for SocialSync, Dashboard, SocialMediaAccounts, Posts, and Library
  resources :social_sync, only: [:index]
  resources :dashboard, only: [:index]
  resources :social_media_accounts, only: [:create, :index]
  resources :posts
  resources :library, only: [:index]
  resources :collaboration_hubs, only: [:index]
  resource :settings, only: [:show] do
      get 'account'
      get 'notifications'
      get 'privacy'
      get 'connected_accounts'
    # Custom route for deleting SocialMediaAccount
    delete '/socialmediaaccounts/:id', to: 'social_media_accounts#destroy', as: 'destroy_social_media'
  end
  post '/social_media_accounts/receive_data', to: 'social_media_accounts#receive_data'




  # Custom route for deleting SocialMediaAccount
  delete '/socialmediaaccounts/:id', to: 'social_media_accounts#destroy', as: 'destroy_social_media'
end
