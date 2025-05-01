import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export function CancionesFavoritas() {
  const [favs, setFavs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("No hay token de acceso. Vuelve a la página principal.");
      navigate("/");
      return;
    }

    const ids = JSON.parse(localStorage.getItem("tracks-favoritos"));

    if (!ids || ids.length === 0) return;

    const idsParam = ids.join(",");

    axios
      .get(`https://api.spotify.com/v1/tracks?ids=${idsParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setFavs(res.data.tracks))
      .catch((err) => {
        console.error("Error al obtener los datos de las canciones:", err);
        alert("No se pudo cargar la lista de favoritos.");
      });
  }, [navigate]);

  if (favs.length === 0) {
    return <p>No hay canciones favoritas para mostrar.</p>;
  }

  return (
    <section className="cans-fav">
      <h2>Canciones Favoritas</h2>
      <ul className="canciones-lista">
        {favs.map((track) => (
          <li key={track.id} className="cancion-item">
            <Link
              to={`/album/${track.album.id}`}
              className="cancion-link"
              style={{ display: "flex", gap: "1rem", textDecoration: "none", color: "inherit" }}
            >
              <img
                src={track.album.images[0]?.url}
                alt="Portada"
                className="cancion-img"
                width={64}
              />
              <div className="cancion-info">
                <h5>{track.name} - {track.album.name}</h5>
                <p className="artist-name">{track.artists[0].name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
