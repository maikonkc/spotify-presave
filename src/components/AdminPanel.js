import React, { useState } from 'react';

const AdminPanel = ({ config }) => {
  const [formData, setFormData] = useState({
    albumId: config?.albumId || '',
    playlistId: config?.playlistId || '',
    artistId: config?.artistId || '',
    titulo: config?.titulo || '',
    subtitulo: config?.subtitulo || '',
    dataLancamento: config?.dataLancamento || '',
    mensagemSucesso: config?.mensagemSucesso || ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('Atualizando planilha...');

    try {
      // Usamos a mesma URL do seu Apps Script
      await fetch(
        "https://script.google.com/macros/s/AKfycbwiG_hg-bSF3q_8PqZx2OR_iw6IrI7BcBF48QvNNBv3Nmv1z0B2PORcPTEJzTMnUo137g/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors", // Necessário para Google Apps Script
          body: JSON.stringify({ ...formData, tipo: 'config' }),
        }
      );

      setStatus('Configurações enviadas! Recarregue a página para aplicar.');
      setTimeout(() => setStatus(''), 4000);
    } catch (err) {
      console.error(err);
      setStatus('Erro ao atualizar. Verifique o console.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>⚙️ Painel de Controle (Admin)</h2>
        <p style={styles.info}>Altere os IDs e textos da planilha diretamente por aqui.</p>
        
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.grid}>
            <label style={styles.label}>ID do Álbum:</label>
            <input style={styles.input} name="albumId" value={formData.albumId} onChange={handleChange} />

            <label style={styles.label}>ID da Playlist:</label>
            <input style={styles.input} name="playlistId" value={formData.playlistId} onChange={handleChange} />

            <label style={styles.label}>ID do Artista:</label>
            <input style={styles.input} name="artistId" value={formData.artistId} onChange={handleChange} />

            <label style={styles.label}>Título da Música:</label>
            <input style={styles.input} name="titulo" value={formData.titulo} onChange={handleChange} />

            <label style={styles.label}>Subtítulo (Artista):</label>
            <input style={styles.input} name="subtitulo" value={formData.subtitulo} onChange={handleChange} />

            <label style={styles.label}>Data de Lançamento:</label>
            <input style={styles.input} name="dataLancamento" value={formData.dataLancamento} onChange={handleChange} />

            <label style={styles.label}>Mensagem de Sucesso:</label>
            <textarea style={styles.textarea} name="mensagemSucesso" value={formData.mensagemSucesso} onChange={handleChange} />
          </div>

          <button type="submit" style={styles.button}>Salvar na Planilha</button>
        </form>

        {status && <p style={styles.status}>{status}</p>}
        <p style={styles.closeHint}>Segure ALT e clique fora para fechar</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '15px',
    maxWidth: '600px',
    width: '100%',
    color: '#fff',
    border: '1px solid #1DB954',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  title: { color: '#1DB954', marginBottom: '10px' },
  info: { fontSize: '14px', marginBottom: '20px', opacity: 0.7 },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  grid: { display: 'grid', gap: '10px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#1DB954' },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    minHeight: '60px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  status: { marginTop: '15px', textAlign: 'center', color: '#1DB954', fontWeight: 'bold' },
  closeHint: { fontSize: '10px', textAlign: 'center', marginTop: '20px', opacity: 0.5 }
};

export default AdminPanel;