import React from 'react';

// Definindo os escopos necessários para as ações
const scopes = [
  'user-library-modify',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-modify',
];

// Montando a URL de autenticação com os escopos corretos
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=${scopes.join('%20')}&show_dialog=true`;

const Auth = () => {
  const handleLogin = () => {
    window.location.href = SPOTIFY_AUTH_URL;
  };

  return (
    <div>
      <h1>Presave no Spotify</h1>
      <button onClick={handleLogin}>Conectar ao Spotify</button>
    </div>
  );
};

export default Auth;
