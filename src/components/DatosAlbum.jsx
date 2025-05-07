import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DatosAlbum.css";

const DatosAlbum = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbumData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("No hay token de acceso. Vuelve a la página principal.");
        navigate("/");
        return;
      }
      try {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlbum(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del álbum", error);
      }
    };
    fetchAlbumData();
  }, [id, navigate]);

  if (!album) return <p>Cargando información del álbum...</p>;

  return (
    <div className="album-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>Volver</button>
      <div className="album-info">
        <img src={album.images[0]?.url} alt={album.name} className="album-cover" />
        <div>
          <h2>{album.name}</h2>
          <p>Artista: {album.artists[0].name}</p>
          <p>Año: {album.release_date.slice(0, 4)}</p>
        </div>
      </div>
      <h3>Lista de canciones</h3>
      <ul className="canciones-lista">
        {album.tracks.items.map((track) => (
          <li key={track.id} className="cancion-item">
            <img src={album.images[0]?.url} alt="Portada" className="cancion-img" />
            <span>{track.track_number}. {track.name}</span>
            {track.preview_url && (
              <audio controls src={track.preview_url} className="preview-audio">
                Tu navegador no soporta el elemento de audio.
              </audio>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosAlbum;