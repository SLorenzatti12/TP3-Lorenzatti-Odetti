
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loginpage from './components/Loginpage'
import './App.css'
import Barrabusqueda from './components/Barrabusqueda'
import { DatosArtista } from './components/DatosArtista'
import { DatosAlbum } from './components/DatosAlbum'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />}/>
        <Route path="/Barrabusqueda" element={<Barrabusqueda />} />
        <Route path='/DatosArtistas' element={<DatosArtista />}/>
        <Route path='/DatosAlbum' element={<DatosAlbum />}/>
      </Routes>
    </Router>
  )
}

export default App
