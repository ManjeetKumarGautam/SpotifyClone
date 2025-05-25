import React, { useEffect, useState } from 'react';
import { getAccessToken, fetchProfile, redirectToSpotifyAuth } from '../utils/auth.js';

export default function Callback() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {

            const params = new URLSearchParams(window.location.search);

            const code = params.get("code");
            console.log(code);
            if (!code) {
                redirectToSpotifyAuth();
            } else {

                const token = await getAccessToken(code);
                const userProfile = await fetchProfile(token);
                setProfile(userProfile);
            }
        };

        loadProfile();
    }, []);

    if (!profile) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h2>Welcome, {profile.display_name}</h2>
            {profile.images[0] && (
                <img src={profile.images[0].url} alt="avatar" className="avatar" />
            )}
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Spotify URL:</strong> <a href={profile.external_urls.spotify} target="_blank">{profile.external_urls.spotify}</a></p>
        </div>
    );
}
