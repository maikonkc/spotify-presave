import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Presave from './components/Presave';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !token) {
      const fetchToken = async () => {
        try {
          // O Spotify exige que o Client ID e Secret sejam enviados como Basic Auth (Base64)
          const basicAuth = btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`);

          const params = new URLSearchParams();
          params.append('grant_type', 'authorization_code');
          params.append('code', code);
          params.append('redirect_uri', process.env.REACT_APP_REDIRECT_URI);

          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
          });

          const data = await response.json();

          if (data.access_token) {
            setToken(data.access_token);
            // Limpa a URL removendo o ?code=... para o usuário ver um link limpo
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error("Erro do Spotify ao gerar token:", data);
          }
        } catch (err) {
          console.error("Erro na conexão com o Spotify:", err);
        }
      };

      fetchToken();
    }
  }, [token]);

  return (
    <div>
      {/* Se tiver o token, renderiza a lógica de salvar álbuns, senão mostra o formulário */}
      {token ? <Presave token={token} /> : <Auth />}
    </div>
  );
};

export default App;