import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//incorporar css

const Login = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId || !clientSecret) {
      alert("Por favor, completá ambos campos");
      return;
    }
    localStorage.setItem("client_id", clientId);
    localStorage.setItem("client_secret", clientSecret);
    navigate("/Barrabusqueda");
  };

  return (
    <div className="login-container">
      <h2>Conectar con Spotify</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
        />
        <button type="submit">Conectar</button>
      </form>
    </div>
  );
};

export default Login;
