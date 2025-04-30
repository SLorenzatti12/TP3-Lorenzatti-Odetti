import React, { useState, useEffect } from "react";
import axios from "axios";
import './Barrabusqueda.css'
import { useNavigate } from "react-router-dom";

const Barrabusqueda = () => {
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = localStorage.getItem("client_id");
    const clientSecret = localStorage.getItem("client_secret");

    if (!clientId || !clientSecret) {
      alert("Faltan las credenciales. Volvé al login.");
      return;
    }

    // Configuración para obtener el token
    const authParams = new URLSearchParams();
    authParams.append("grant_type", "client_credentials");

    axios
      .post("https://accounts.spotify.com/api/token", authParams, {
        headers: {
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        setToken(res.data.access_token);
      })
      .catch((err) => {
        console.error("Error al obtener token", err);
      });
  }, []);

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
      .then((res) => {
        setArtists(res.data.artists.items);
      })
      .catch((err) => {
        console.error("Error en la búsqueda", err);
      });
  };

  return (
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

      <div className="resultados-artistas">
        {artists && artists.length > 0 ? (
          artists.map((artist) => (
            <div
              key={artist.id}
              className="artista-card"
              onClick={() => navigate('/DatosArtistas', { state: { id: artist.id } })}
            >
              {artist.images && artist.images[0] && (
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
  );
};

export default Barrabusqueda;