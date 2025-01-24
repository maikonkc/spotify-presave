import React, { useState } from 'react';
import Auth from '../components/Auth';
import Presave from '../components/Presave';

const LandingPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Para verificar login do usuário
  const [accessToken, setAccessToken] = useState(null); // Guardar o token após o Auth

  // Callback para lidar com a autenticação bem-sucedida
  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true);
    setAccessToken(token); // Salva o token para uso no componente Presave
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Nome:', name, 'E-mail:', email);
    alert('Informações capturadas com sucesso!');

    // Aqui você pode enviar `name` e `email` para um backend
    setName('');
    setEmail('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Faça o Pré-save da Minha Música!</h1>
      <p style={styles.subheading}>Deixe seu nome e e-mail para receber novidades exclusivas.</p>

      <form onSubmit={handleFormSubmit} style={styles.form}>
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
        <button type="submit" style={styles.button}>Enviar</button>
      </form>

      {/* Exibir o botão de autenticação */}
      {!isAuthenticated ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Presave accessToken={accessToken} />
      )}
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

export default LandingPage;
