import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../styles/DatosArtista.css'

export function DatosArtista() {
  const location = useLocation();
  const { id } = location.state || {};

  const [token, setToken] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [albums, setAlbums] = useState([]);

  // Obtener token de acceso desde client_id y client_secret
  useEffect(() => {
    const clientId = localStorage.getItem("client_id");
    const clientSecret = localStorage.getItem("client_secret");

    if (!clientId || !clientSecret) {
      alert("Faltan credenciales.");
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
      .catch((err) => console.error("Error al obtener token:", err));
  }, []);

  // Obtener datos del artista
  useEffect(() => {
    if (!id || !token) return;

    axios
      .get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setArtistData(res.data))
      .catch((err) => console.error("Error al obtener datos del artista:", err));
  }, [id, token]);

  // Obtener álbumes del artista
  useEffect(() => {
    if (!id || !token) return;

    axios
      .get(`https://api.spotify.com/v1/artists/${id}/albums`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          include_groups: "album", // También puedes incluir "single", "compilation"
          market: "US",
          limit: 10,
        },
      })
      .then((res) => setAlbums(res.data.items))
      .catch((err) => console.error("Error al obtener álbumes:", err));
  }, [id, token]);

  if (!artistData) {
    return <p>Cargando datos del artista...</p>;
  }

  return (
    <>
      <div className="datos-artista">
        {artistData.images && artistData.images[0] && (
          <img src={artistData.images[0].url} alt={artistData.name} id="img-artista"/>
        )}
        <h1>{artistData.name}</h1>
      </div>

      <section>
        <h2>Álbumes</h2>
        {albums.length > 0 ? (
          <div className="albumes-grid">
            {albums.map((album) => (
              <div key={album.id} className="album-card">
                {album.images && album.images[0] && (
                  <img src={album.images[0].url} alt={album.name} />
                )}
                <p>{album.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron álbumes.</p>
        )}
      </section>
    </>
  );
}
