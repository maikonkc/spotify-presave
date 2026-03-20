import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Presave = ({ token, config }) => {
  const [status, setStatus] = useState({
    album: 'loading',
    playlist: 'loading',
    artist: 'loading'
  });
  
  // Memoizamos a função para evitar re-renderizações infinitas no useEffect
  const saveRelease = useCallback(async () => {
    // Resetamos o status para loading caso seja um "Tentar Novamente"
    setStatus({ album: 'loading', playlist: 'loading', artist: 'loading' });

    const operations = [
      {
        name: 'album',
        // CORREÇÃO: Adicionado o $ para a template string
        url: `https://api.spotify.com/v1/me/albums?ids=${config?.albumId}`,
        method: 'PUT'
      },
      {
        name: 'playlist',
        // CORREÇÃO: Adicionado o $ para a template string
        url: `https://api.spotify.com/v1/playlists/${config?.playlistId}/followers`,
        method: 'PUT'
      },
      {
        name: 'artist',
        // CORREÇÃO: Adicionado o $ para a template string
        url: `https://api.spotify.com/v1/me/following?type=artist&ids=${config?.artistId}`,
        method: 'PUT'
      }
    ];

    for (const op of operations) {
      try {
        await axios({
          method: op.method,
          url: op.url,
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {}
        });
        
        setStatus(prev => ({ ...prev, [op.name]: 'success' }));
      } catch (err) {
        console.error(`Erro em ${op.name}:`, err.response?.data || err.message);
        setStatus(prev => ({ ...prev, [op.name]: 'error' }));
      }
    }
  }, [token, config]);

  useEffect(() => {
    if (config && token) {
      saveRelease();
    }
  }, [config, token, saveRelease]);

  const allSuccess = Object.values(status).every(s => s === 'success');
  const hasError = Object.values(status).some(s => s === 'error');

  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    
    try {
      const data = new Date(dataISO);
      // Verifica se a data é válida antes de formatar
      if (isNaN(data.getTime())) return dataISO; 

      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dataISO; // Se der erro, mostra o original para não quebrar a tela
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Presave Confirmado!</h1>
      <h2 style={styles.subtitle}>
        "{config?.titulo}" — {config?.subtitulo}
      </h2>
      
      <div style={styles.statusContainer}>
        <StatusItem label="Álbum na Biblioteca" status={status.album} />
        <StatusItem label="Playlist Salva" status={status.playlist} />
        <StatusItem label="Artista Seguido" status={status.artist} />
      </div>

      {allSuccess && (
        <div style={styles.successBox}>
          <p>{config?.mensagemSucesso || 'Tudo pronto! O álbum será adicionado à sua biblioteca no lançamento.'}</p>
          <p style={styles.releaseDate}>Lançamento: {formatarData(config?.dataLancamento)}</p>
          <button 
            onClick={() => window.open(`https://open.spotify.com/album/${config?.albumId}`, '_blank')}
            style={styles.spotifyButton}
          >
            Abrir no Spotify
          </button>
        </div>
      )}

      {hasError && !allSuccess && (
        <div style={styles.errorBox}>
          <p>Algumas ações falharam, mas seu interesse foi registrado!</p>
          <button onClick={saveRelease} style={styles.retryButton}>
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para os itens da lista
const StatusItem = ({ label, status }) => (
  <div style={styles.statusItem}>
    <span style={{opacity: status === 'loading' ? 0.5 : 1}}>{label}</span>
    <span style={styles.statusIcon}>
      {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
    </span>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #121212 0%, #1db95433 100%)', // Degradê sutil para o verde Spotify
    color: '#fff'
  },
  heading: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#1DB954',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '30px',
    opacity: 0.8,
    textAlign: 'center'
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '350px',
    marginBottom: '30px'
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  statusIcon: {
    fontSize: '18px'
  },
  successBox: {
    textAlign: 'center',
    padding: '25px',
    background: 'rgba(29, 185, 84, 0.15)',
    border: '1px solid #1DB954',
    borderRadius: '20px',
    maxWidth: '400px'
  },
  releaseDate: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    color: '#1DB954'
  },
  spotifyButton: {
    marginTop: '20px',
    padding: '12px 25px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  },
  errorBox: {
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(255, 50, 50, 0.1)',
    border: '1px solid #ff3232',
    borderRadius: '15px',
    maxWidth: '400px'
  },
  retryButton: {
    marginTop: '15px',
    padding: '8px 20px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Presave;