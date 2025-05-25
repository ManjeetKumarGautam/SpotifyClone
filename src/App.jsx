import React from 'react';
import { redirectToSpotifyAuth } from './utils/auth.js';
import './index.css';

export default function App() {
  return (
    <div className="container">
      <h1>Spotify PKCE Login</h1>
      <button className="login-btn" onClick={redirectToSpotifyAuth}>
        Login with Spotify
      </button>
    </div>
  );
}
