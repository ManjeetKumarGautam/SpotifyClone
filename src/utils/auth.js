// src/spotifyAuth.js

import axios from "axios";

function generateCodeVerifier(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(x => possible.charAt(x % possible.length))
        .join('');
}

async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function redirectToSpotifyAuth() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);


    window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code) {

    const verifier = localStorage.getItem("verifier");
    const body = new URLSearchParams();
    body.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
    body.append("code_verifier", verifier);


    const res = await axios.post("https://accounts.spotify.com/api/token", body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });

    const data = await res.data.access_token;

    return data.access_token;
}

export async function fetchProfile(token) {
    const result = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.data;
}
