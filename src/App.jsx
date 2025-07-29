import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEdit';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/addtask" element={<TaskCreate />} />
          <Route path="/edittask" element={<TaskEdit />} />
          <Route path="/" element={<TaskCreate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;