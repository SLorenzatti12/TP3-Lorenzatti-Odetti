import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loginpage from './components/Loginpage'
import './App.css'
import Barrabusqueda from './components/Barrabusqueda'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />}/>
        <Route path="/Barrabusqueda" element={<Barrabusqueda />} />
      </Routes>
    </Router>
  )
}

export default App
