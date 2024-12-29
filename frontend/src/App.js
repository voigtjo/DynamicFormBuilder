import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestPage from './pages/TestPage';
import BuildPage from './pages/BuildPage';
import ProdPage from './pages/ProdPage';
import FormBuilder from './FormBuilder'; // Your main form builder page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/prod" element={<ProdPage />} />
      </Routes>
    </Router>
  );
}

export default App;
