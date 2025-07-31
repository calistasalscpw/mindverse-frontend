import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';
import Forum from './pages/Forum'; 
import ForumPostDetail from './pages/ForumPostDetail'; 
import ChatBot from './components/chatBot';
import { Layout } from 'antd';
import React from 'react';

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
      <Layout style={{ minHeight: '100vh', background: '#0f0c2a' }}>
        <Navbar />
        <Content style={{ 
          marginTop: 64,
          padding: '24px',
          minHeight: '100vh',
          background: '#0f0c2a'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/forum" />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumPostDetail />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
          </Routes>
        </Content>
        <ChatBot />
      </Layout>
    </BrowserRouter>
  );
}

export default App;