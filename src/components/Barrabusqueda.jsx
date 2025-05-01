import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Barrabusqueda.css';
import { useNavigate } from "react-router-dom";

const Barrabusqueda = () => {
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);   // Resultados de búsqueda
  const [artistas, setArtistas] = useState([]); // Favoritos
  const navigate = useNavigate();

  // Obtener token
  useEffect(() => {
    const clientId = localStorage.getItem("client_id");
    const clientSecret = localStorage.getItem("client_secret");

    if (!clientId || !clientSecret) {
      alert("Faltan las credenciales. Volvé al login.");
      return;
    }

    const authParams = new URLSearchParams();
    authParams.append("grant_type", "client_credentials");

    axios
      .post("https://accounts.spotify.com/api/token", authParams, {
        headers: {
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => setToken(res.data.access_token))
      .catch((err) => console.error("Error al obtener token", err));
  }, []);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.length === 0 || !token) {
      setArtistas([]);
      return;
    }

    Promise.all(
      favoritos.map((id) =>
        axios
          .get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)
          .catch((err) => {
            console.warn(`No se pudo cargar el artista con ID ${id}:`, err);
            return null;
          })
      )
    )
      .then((data) => {
        const filtrados = data.filter(Boolean);
        setArtistas(filtrados);
      })
      .catch((err) => console.error("Error al obtener artistas favoritos:", err));
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchTerm,
          type: "artist",
        },
      })
      .then((res) => setArtists(res.data.artists.items))
      .catch((err) => console.error("Error en la búsqueda", err));
  };

  return (
    <section className="BusquedaPage">
      <ul className="fav">
        <h2>Artistas Favoritos</h2>
        {artistas.length === 0 ? (
          <p>No hay artistas favoritos.</p>
        ) : (
          artistas.map((artist) => (
            <li
              key={artist.id}
              className="favorito-card"
              onClick={() => navigate('/DatosArtistas', { state: { id: artist.id } })}
            >
              {artist.images?.[0] && (
                <img src={artist.images[0].url} alt={artist.name} />
              )}
              <h4>{artist.name}</h4>
            </li>
          ))
        )}
      </ul>

      <div className="canciones_fav">
        <h3>Ver canciones favoritas</h3>
        <button onClick={()=>navigate('/CancionesFavoritas')}>Ir</button>
      </div>

      <div className="busqueda-container">
        <h2>Buscar Artistas</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Nombre del artista"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        <div className="resultados-artistas" style={{ display: artists.length > 0 ? "grid" : "flex", justifyContent: "center" }}>
          {artists.length > 0 ? (
            artists.map((artist) => (
              <div
                key={artist.id}
                className="artista-card"
                onClick={() => navigate('/DatosArtistas', { state: { id: artist.id } })}
              >
                {artist.images?.[0] && (
                  <img src={artist.images[0].url} alt={artist.name} />
                )}
                <p>{artist.name}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron artistas.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Barrabusqueda;
