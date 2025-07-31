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
import TaskCreate from './components/TaskCreate';
import TaskEdit from './components/TaskEdit';
import Forum from './Pages/Forum';
import ForumPostDetail from './Pages/ForumPostDetail';
import ChatBot from './components/chatBot';

function App() {
  

  return (
    <BrowserRouter>
    <Navbar/>
    <ChatBot />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/signup' element={<Signup/>}/>
        <Route path='/auth/login' element={<Login/>}/>
        <Route path="/addtask" element={<TaskCreate />} />
        <Route path="/edittask" element={<TaskEdit />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:postId" element={<ForumPostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;