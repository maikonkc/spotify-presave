import React, { useState } from 'react';

const scopes = [
  'user-library-modify',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-modify',
];

const Auth = ({ config }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  // CORREÇÃO: Adicionado o '$' e a '?' que faltavam para a URL funcionar
  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI)}&scope=${scopes.join('%20')}&show_dialog=true`;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Enviando para o Google Sheets
      await fetch(
        "https://script.google.com/macros/s/AKfycbwiG_hg-bSF3q_8PqZx2OR_iw6IrI7BcBF48QvNNBv3Nmv1z0B2PORcPTEJzTMnUo137g/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors", 
          body: JSON.stringify({ name, email, tipo: 'lead' }),
        }
      );
      
      setMensagem('Dados salvos! Redirecionando para o Spotify...');
      
      // Pequeno delay para o usuário ler a mensagem antes do redirecionamento
      setTimeout(() => {
        window.location.href = SPOTIFY_AUTH_URL;
      }, 1500);
    } catch (err) {
      console.error("Erro:", err);
      setMensagem('Erro ao enviar. Tente novamente.');
    }
  };

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
      <h1 style={styles.heading}>
        {/* Ajustado para usar os campos que definimos no fallback do App.js */}
        Faça o Presave de "{config?.titulo || 'Nova Música'}"
      </h1>
      <p style={styles.subheading}>
        {config?.subtitulo || 'Mike Keslley'} • Disponível em {formatarData(config?.dataLancamento) || 'Breve'}
      </p>
      <p style={styles.description}>
        Conecte seu Spotify para salvar automaticamente no lançamento.
      </p>
      
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Seu Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Conectar ao Spotify
        </button>
      </form>

      {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #121212 0%, #282828 100%)',
    color: '#fff'
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#1DB954'
  },
  subheading: {
    fontSize: '18px',
    marginBottom: '5px',
    opacity: 0.9,
    fontWeight: 'bold'
  },
  description: {
    fontSize: '14px',
    marginBottom: '30px',
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: '300px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '350px',
    gap: '15px'
  },
  input: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.1)',
    fontSize: '16px',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    padding: '16px 30px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'all 0.3s ease'
  },
  mensagem: {
    marginTop: '25px',
    padding: '12px 20px',
    background: 'rgba(29, 185, 84, 0.1)',
    border: '1px solid rgba(29, 185, 84, 0.3)',
    borderRadius: '15px',
    fontSize: '14px',
    color: '#1DB954',
    textAlign: 'center'
  }
};

export default Auth;