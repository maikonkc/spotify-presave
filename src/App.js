import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Presave from './components/Presave';
import AdminPanel from './components/AdminPanel'; // Componente que criaremos a seguir

const App = () => {
  const [token, setToken] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  // 1. Busca configuração dinâmica da Planilha
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwiG_hg-bSF3q_8PqZx2OR_iw6IrI7BcBF48QvNNBv3Nmv1z0B2PORcPTEJzTMnUo137g/exec?sheet=Config"
        );
        const data = await response.json();
        
        const configObj = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            // Ajuste para ler a sua coluna D (Ativo) e pegar o valor da coluna B (Valor)
            const isAtivo = String(item.Ativo).toUpperCase() === 'TRUE';
            if (isAtivo) {
              configObj[item.Campo] = item.Valor;
            }
          });
        }
        
        if (Object.keys(configObj).length > 0) {
          setConfig(configObj);
        } else {
          throw new Error("Nenhuma configuração ativa encontrada.");
        }
      } catch (err) {
        console.error("Usando fallback de segurança:", err);
        setConfig({
          albumId: '0Aew4M8q8LSJ5xdZiwErDw',
          playlistId: '5rnWjb5X62L6Jf2I4T9jfw',
          artistId: '22M8dOOCCGRbjgc26XVmdV',
          titulo: 'A Noite N Acabou',
          subtitulo: 'Mike Keslley',
          dataLancamento: '21/02/2026',
          mensagemSucesso: 'Tudo pronto! O álbum será salvo na sua biblioteca.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // 2. Handler do Spotify (Troca de Code por Token)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !token) {
      const fetchToken = async () => {
        try {
          const basicAuth = btoa(
            `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`
          );

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
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error("Erro na autenticação Spotify:", err);
        }
      };
      fetchToken();
    }
  }, [token]);

  if (loading) return <div style={styles.loading}>Carregando configurações...</div>;

  return (
    // Atalho: Segure ALT e clique no container principal para abrir o Admin
    <div onClick={(e) => e.altKey && setShowAdmin(!showAdmin)} style={{ minHeight: '100vh' }}>
      
      {showAdmin && <AdminPanel config={config} />}

      {token ? (
        <Presave token={token} config={config} />
      ) : (
        <Auth config={config} />
      )}
    </div>
  );
};

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#121212',
    color: '#1DB954'
  }
};

export default App;