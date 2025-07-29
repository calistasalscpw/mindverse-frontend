import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEdit';

function App() {
  

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/signup' element={<Signup/>}/>
        <Route path='/auth/login' element={<Login/>}/>
        <Route path="/addtask" element={<TaskCreate />} />
        <Route path="/edittask" element={<TaskEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;