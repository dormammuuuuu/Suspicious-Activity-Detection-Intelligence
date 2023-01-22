import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login, Setup, Documentation } from './pages';
import Home from './pages/Home';

function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/setup' element={<Setup />} />
      <Route path='/*' element={<Home />} />
      <Route path='/documentation' element={<Documentation />} />
    </Routes>

  );
}

export default App;
