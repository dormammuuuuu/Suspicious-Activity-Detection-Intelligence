import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login, Setup, Documentation } from './pages';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/resetpassword' element={<ResetPassword />} />
      <Route path='/setup' element={<Setup />} />
      <Route path='/*' element={<Home />} />
      <Route path='/documentation' element={<Documentation />} />
    </Routes>

  );
}

export default App;
