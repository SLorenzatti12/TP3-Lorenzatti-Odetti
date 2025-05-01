
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loginpage from './components/Loginpage'
import './App.css'
import Barrabusqueda from './components/Barrabusqueda'
import { DatosArtista } from './components/DatosArtista'
<<<<<<< HEAD
import  DatosAlbum  from './components/DatosAlbum'
=======
 import { DatosAlbum } from './components/DatosAlbum'
>>>>>>> 7a0351d (Incorporación de css Responsive en los datos del artista)

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />}/>
        <Route path="/Barrabusqueda" element={<Barrabusqueda />} />
        <Route path='/DatosArtistas' element={<DatosArtista />}/>
<<<<<<< HEAD
        <Route path='/album/:id' element={<DatosAlbum />}/>
=======
        <Route path='/DatosAlbum' element={<DatosAlbum />}/>
>>>>>>> 7a0351d (Incorporación de css Responsive en los datos del artista)
      </Routes>
    </Router>
  )
}

export default App
