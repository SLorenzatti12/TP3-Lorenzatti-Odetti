import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DatosAlbum.css";

const DatosAlbum = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let stored = [];
    try {
      const raw = localStorage.getItem("tracks-favoritos");
      stored = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Contenido inválido en tracks-favoritos. Se reinicia:", e);
      localStorage.removeItem("tracks-favoritos");
    }
    setFavoritos(stored);
  }, []);

  const toggleFavorito = (idTrack) => {
    let nuevosFavoritos;
    if (favoritos.includes(idTrack)) {
      nuevosFavoritos = favoritos.filter(id => id !== idTrack);
    } else {
      nuevosFavoritos = [...favoritos, idTrack];
    }
    setFavoritos(nuevosFavoritos);
    localStorage.setItem("tracks-favoritos", JSON.stringify(nuevosFavoritos));
  };

  const esFavorito = (idTrack) => favoritos.includes(idTrack);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No hay token de acceso. Vuelve a la página principal.");
      navigate("/");
      return;
    }

    axios
      .get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAlbum(res.data))
      .catch((err) => {
        console.error("Error al obtener los datos del álbum:", err);
        alert("No se pudo cargar el álbum.");
      });
  }, [id, navigate]);

  if (!album) return <p>Cargando información del álbum...</p>;

  return (
    <div className="album-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>Volver</button>
      <div className="album-info">
        {album.images?.[0] && (
          <img src={album.images[0].url} alt={album.name} className="album-cover" />
        )}
        <div>
          <h2>{album.name}</h2>
          <p>Artista: {album.artists[0]?.name}</p>
          <p>Año: {album.release_date?.slice(0, 4)}</p>
        </div>
      </div>

      <h3>Lista de canciones</h3>
      <ul className="canciones-lista">
        {album.tracks.items.map((track) => (
          <li key={track.id} className="cancion-item">
            <img src={album.images[0]?.url} alt="Portada" className="cancion-img" />
            <span>{track.track_number}. {track.name}</span>
            <button className="boton_fav" onClick={() => toggleFavorito(track.id)} style={{ marginLeft: "auto" }}>
              {esFavorito(track.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosAlbum;
