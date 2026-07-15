import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Reminders from './pages/Reminders';
import MedicineLookup from './pages/MedicineLookup';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';


function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<Layout />}>
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/reminders" 
          element={isAuthenticated ? <Reminders /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/medicine-lookup" 
          element={isAuthenticated ? <MedicineLookup /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} 
        />
         {/* <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        /> */}
        <Route 
          path="/notifications" 
          element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} 
        />
      </Route>
     
    </Routes>
  );
}

export default App;