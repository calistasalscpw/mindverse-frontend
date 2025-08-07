import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';
import TaskCreate from './components/TaskCreate';
import TaskEdit from './components/TaskEdit';
import Forum from './pages/Forum';
import ForumPostDetail from './pages/ForumPostDetail';

import { AuthProvider } from './context/AuthContext';
import ChatBot from './components/ChatBot';
import { Layout } from 'antd';
const { Content } = Layout;

function App() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.background = '#0f0c2a';
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
      <Layout style={{ minHeight: '100vh', background: '#0f0c2a' }}>
        <Navbar />
        <Content style={{ 
          marginTop: 64,
          padding: '24px',
          minHeight: '100vh',
          background: '#0f0c2a'
        }}>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/auth/signup' element={<Signup/>}/>
            <Route path='/auth/login' element={<Login/>}/>
            <Route path="/addtask" element={<TaskCreate />} />
            <Route path="/edittask" element={<TaskEdit />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:postId" element={<ForumPostDetail />} />
          </Routes>
        </Content>
        <ChatBot />
      </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;