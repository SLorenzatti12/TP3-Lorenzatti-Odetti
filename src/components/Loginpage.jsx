import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import '../styles/Loginpage.css'

//incorporar css
const Loginpage = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!clientId || !clientSecret) {
      alert("Por favor, completá ambos campos")
      return;
    }
    localStorage.setItem("client_id", clientId)
    localStorage.setItem("client_secret", clientSecret)
    navigate("/Barrabusqueda")
  }

  return (
    <div className="login-container">
      <h2>Conectar con Spotify</h2>
      <p>Con el fin de cumplir la condición de no hardcorear las claves ClientID y CLientServer, estas se encuentran en el archivo README.md en el repositorio de GitHub, copiar y pegar en las respectivas entradas de texto.</p>
      <form className="login-form" onSubmit={handleSubmit}>
        
        <label htmlFor="id">Client ID</label>
        <input
          id="id"
          type="text"
          placeholder="Client ID"
          onChange={(e)=> setClientId(e.target.value)}
        />
        <label htmlFor="secret">Client Secret</label>
        <input
        id="secret"
          type="password"
          placeholder="Client Secret"
          onChange={(e)=> setClientSecret(e.target.value)}
        />

        <button type="submit">Conectar</button>
      
      </form>
    </div>
  )
}

export default Loginpage;
