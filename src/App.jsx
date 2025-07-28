import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.jsx';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/signup' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;