import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Presave = ({ token }) => {
  console.log("Token recebido:", token);
  const [isSaved, setIsSaved] = useState(false);
  const saveRelease = async () => {
    const albumId = '0Aew4M8q8LSJ5xdZiwErDw'; // A Noite N Acabou
    const playlistId ='5rnWjb5X62L6Jf2I4T9jfw'; //Darkcore
    const artistId = '22M8dOOCCGRbjgc26XVmdV'; // Mike Keslley
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
      //alert('Álbum salvo na biblioteca com sucesso!');
      console.log("Album salvo:", response); // Deve ser 200 ou 204.

    } catch (error) {
      console.error('Erro ao salvar  o álbum:', error);
      //alert('Falha ao salvar o álbum.');
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
        //alert('Playlist salva com sucesso!');
      } catch (error) {
        console.error("Erro ao salvar a playlist:", error.response || error.message);
        //alert('Falha ao salvar a playlist.');
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
        //alert('Artista seguido com sucesso!');
      } catch (error) {
        console.error("Erro ao seguir o artista:", error.response || error.message);
        //alert('Falha ao seguir o artista.');
      }
  };
  useEffect(() => {
    saveRelease();
  }, []);
  return (
    <div>
      <h1>Pré-save do Spotify</h1>
      {isSaved === null && <p>Estamos salvando o álbum na sua biblioteca. Aguarde...</p>}
      {isSaved === true && <p>Álbum salvo com sucesso! Você pode conferir na sua biblioteca do Spotify na data do lançamento.<br>
                              Compartilhe com seus amigos!</br></p>}
      {isSaved === false && <p>Falha ao salvar o álbum. Por favor, tente novamente mais tarde.</p>}
    </div>
    
  );
};
export default Presave;