BopVerse

BopVerse is a Spotify-powered web application that allows users to explore their playlists, rate them, and even rate individual tracks. It provides a fun and interactive way to engage with your Spotify library.

Features

Login with Spotify: Authenticate using your Spotify account.

View Playlists: Fetch and display all your Spotify playlists.

Rate Playlists: Add a star rating to your playlists.

Rate Tracks: Dive into individual playlists and rate the tracks.

Profile Display: Show your Spotify profile picture and a welcome message.

Technologies Used

Frontend

React: A JavaScript library for building user interfaces.

Vite: A fast build tool for modern web applications.

Backend

Express: A Node.js framework for the server.

Spotify Web API: Fetches user playlists and tracks from Spotify.

Deployment

Hosting Platforms: Suitable for platforms like Render, Heroku, or Vercel.

Setup Instructions

Prerequisites

Node.js: Install Node.js (v14 or later).

Spotify Developer Account: Register an app on the Spotify Developer Dashboard and retrieve:

Client ID

Client Secret

Installation

Install dependencies:

npm install

Create a .env file in the root directory with the following variables:

CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:5000/callback

Start the development server:

npm run dev

Start the backend server:

node server.js

Open the app in your browser at http://localhost:3000.

Build and Deployment

Build the Frontend:

npm run build

This generates production-ready files in the dist folder.

Deploy the Backend:

Ensure the backend serves files from the dist folder.

Use platforms like Render, Heroku, or your preferred hosting provider.

Update Spotify Redirect URI:

Go to the Spotify Developer Dashboard.

Update the redirect URI to your deployed frontend URL (e.g., https://your-deployment-url.com/callback).

Usage

Visit the deployed BopVerse application.

Log in using your Spotify account.

Browse your playlists and click "View Tracks" to explore individual songs.

Use the star ratings to rate your playlists and songs.

