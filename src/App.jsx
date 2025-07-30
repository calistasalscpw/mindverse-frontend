import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Forum from './Pages/Forum';
import ForumPostDetail from './Pages/ForumPostDetail';
import ChatBot from './components/chatBot';

function App() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.background = 'transparent';
  }, []);

  return (
    <Router>
       <ChatBot />
      <Routes>
        <Route path="/" element={<Navigate to="/Forum" />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ForumPostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;