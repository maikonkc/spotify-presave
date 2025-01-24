import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Presave = ({ token }) => {
  console.log("Token recebido:", token);
  const [isSaved, setIsSaved] = useState(false);
  const saveRelease = async () => {
    const albumId = '0Aew4M8q8LSJ5xdZiwErDw'; // A Noite N Acabou
    //const albumId = '122yRf2xz5FT2ua5Vbv3tp'; // Substitua pelo ID real da música. Essa é de teste.
    const playlistId ='5CVbi440q7OBWulf30Wf10';
    const artistId = '22wbnEMDvgVIAGdFeek6ET';
    try {
      
      const response = await axios.put(
        `https://api.spotify.com/v1/me/albums?ids=${albumId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsSaved(true); // Desabilita o botão
      alert('Álbum salvo na biblioteca com sucesso!');
      console.log("Resposta da API:", response); // Deve ser 200 ou 204.

    } catch (error) {
      console.error('Erro ao salvar  o álbum:', error);
      alert('Falha ao salvar o álbum.');
    }
    try {
        const response = await axios.put(
          `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
          {}, // Corpo vazio, mas necessário para a requisição PUT
          {
            headers: {
              Authorization: `Bearer ${token}`, // Certifique-se de que o token está válido
            },
          }
        );
        console.log("Playlist salva:", response);
        alert('Playlist salva com sucesso!');
      } catch (error) {
        console.error("Erro ao salvar a playlist:", error.response || error.message);
        alert('Falha ao salvar a playlist.');
      }
    try {
        const response = await axios.put(
          `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Artista seguido:", response);
        alert('Artista seguido com sucesso!');
      } catch (error) {
        console.error("Erro ao seguir o artista:", error.response || error.message);
        alert('Falha ao seguir o artista.');
      }
  };
  useEffect(() => {
    saveRelease();
  }, []);
  return (
    <div>
    <h1>Salvando o Álbum...</h1>
    {/* Opcional: Adicione feedback visual */}
    <p>Estamos salvando o álbum na sua biblioteca do Spotify. Aguarde um momento!</p>
    <button disabled={isSaved}>
        {isSaved ? "Pré-Save Concluído" : "Fazer Pré-Save"}
    </button>
  </div>
    
  );
};
export default Presave;