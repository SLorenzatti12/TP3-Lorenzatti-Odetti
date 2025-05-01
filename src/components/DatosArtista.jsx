import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/DatosArtista.css'
import { Link } from "react-router-dom";

export function DatosArtista() {

  const navigate = useNavigate(); 
  const location = useLocation();
  const { id } = location.state || {};

  const [token, setToken] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [albums, setAlbums] = useState([]);

  const esFavorito = (idArtista) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    return favoritos.some((fav) => fav === idArtista);
  };

  const [favorito, setFav] = useState(esFavorito(id))

  const guardarFavorito = (idArtista) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    
    favoritos.push(idArtista)
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    
    setFav(true);
  };

  const eliminarFavorito = (idArtista) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  
    const nuevosFavoritos = favoritos.filter((artistaId) => artistaId !== idArtista);
  
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));

    setFav(false);
  };
  

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
      .then((res) => {
        setToken(res.data.access_token); 
        localStorage.setItem("access_token", res.data.access_token);
      })
      .catch((err) => console.error("Error al obtener token:", err));
  }, []);

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
        <div className="buttons-container">
          <button className="volver-btn" onClick={() => navigate(-1)}>Volver</button>
          <button className="boton_fav" onClick={()=>{favorito? eliminarFavorito(artistData.id) : guardarFavorito(artistData.id)}}>
            {
            favorito?
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            </svg>
          } </button>
        </div>
        
          {artistData.images && artistData.images[0] && (
            <img src={artistData.images[0].url} alt={artistData.name} id="img-artista"/>
          )}
              <h1>{artistData.name}</h1>

        <section>
          <h2>Álbumes</h2>
          {albums.length > 0 ? (
            <div className="albumes-grid">
            {albums.map((album, index) => (
              <Link key={album.id} to={`/album/${album.id}`} className="album-card" style={(index === albums.length - 1 && albums.length %2 !=0 )? { gridColumn: "1 / -1" } : {}}>
                {album.images && album.images[0] && (
                  <img src={album.images[0].url} alt={album.name} />
                )}
                <p><strong>{album.name}</strong></p>
                <p>Año: {album.release_date.slice(0, 4)}</p>
              </Link>
            ))}
          </div>
          ) : (
            <p>No se encontraron álbumes.</p>
          )}
        </section>
      </div>
    </>
  );
}
