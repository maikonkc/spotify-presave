import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Presave from './components/Presave';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      setToken(params.get('access_token'));
      window.location.hash = ''; // Limpa o hash da URL.
    }
  }, []);

  return (
    <div>
      {token ? <Presave token={token} /> : <Auth />}
    </div>
  );
};

export default App;
