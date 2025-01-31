import React, { useState } from 'react';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { name, email };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzD-dhfV96sJImt1RAkZ1QQ_U3s9AnN2YpwGrLmA4kCd_NTS4nobl8nw2cBaDXfkynfTg/exec", // Substitua pela sua URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors", // Habilita suporte a CORS
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        setMensagem("Dados enviados com sucesso!");
        setName('');
        setEmail('');
        window.location.href = SPOTIFY_AUTH_URL;
      } else {
        setMensagem(result.message || "Erro ao enviar os dados.");
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setMensagem("Erro ao enviar os dados. Verifique a conexão e tente novamente.");
    }
  };

  return (
    <div>
      <div style={styles.container}>
        <h1 style={styles.heading}>Faça o Pré-save da Minha Música!</h1>
        <p style={styles.subheading}>Deixe seu nome e e-mail para receber novidades exclusivas.</p>
        <form id="cadastro" onSubmit={handleLogin} style={styles.form}>
          <label htmlFor="nome" style={styles.label}></label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          
          <label htmlFor="email" style={styles.label}></label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          
          <button type="submit" style={styles.button}>Conectar ao Spotify</button>
        </form>

        {mensagem && <p>{mensagem}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '18px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default Auth;
