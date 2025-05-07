import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DatosAlbum.css";

const DatosAlbum = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const navigate = useNavigate();
  const [cancionesFavoritas, setCancionesFavoritas] = useState(() => {
    return JSON.parse(localStorage.getItem("favoritos_canciones")) || [];
  });

  const toggleFavoritoCancion = (cancion) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos_canciones")) || [];
    const existe = favoritos.find((fav) => fav.id === cancion.id);
    let nuevosFavoritos;
  
    if (existe) {
      nuevosFavoritos = favoritos.filter((fav) => fav.id !== cancion.id);
    } else {
      nuevosFavoritos = [...favoritos, cancion];
    }
  
    localStorage.setItem("favoritos_canciones", JSON.stringify(nuevosFavoritos));
    setCancionesFavoritas(nuevosFavoritos); // asegurate de tener este estado
  };

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
            <button
              className="estrella-btn"
              onClick={() =>
                toggleFavoritoCancion({
                  id: track.id,
                  name: track.name,
                  artist: album.artists[0].name,
                  image: album.images[0]?.url,
                })
              }
            >
              {cancionesFavoritas.some((fav) => fav.id === track.id) ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fcd34d" className="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fcd34d" className="bi bi-star" viewBox="0 0 16 16">
                  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                </svg>
              )}
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosAlbum;