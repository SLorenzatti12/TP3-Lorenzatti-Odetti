import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loginpage from './components/Loginpage'
import './App.css'
import Barrabusqueda from './components/Barrabusqueda'
import { DatosArtista } from './components/DatosArtista'
import  DatosAlbum  from './components/DatosAlbum'
import { CancionesFavoritas } from './components/CancionesFavoritas'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />}/>
        <Route path="/Barrabusqueda" element={<Barrabusqueda />} />
        <Route path='/DatosArtistas' element={<DatosArtista />}/>
        <Route path='/album/:id' element={<DatosAlbum />}/>
        <Route path='/CancionesFavoritas' element={<CancionesFavoritas />}/>
      </Routes>
    </Router>
  )
}

export default App
