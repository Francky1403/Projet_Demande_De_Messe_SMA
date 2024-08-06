import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './composant/Login';
import Homes from './composant/Acceuille';
import Sidebar from './composant/sidebar';
import Messe from './composant/Messe';
import Statistique from './composant/Statistique';
import Utilisateur from './composant/Utilisateur';
import MonCompte from './composant/MonCompte';
import PrivateRoute from './composant/PrivateRoute';
import ConfirmationPage from './composant/ConfirmationPage';



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homes />} />
        <Route path="/ConfirmePage" element={<ConfirmationPage />} />
        <Route path="/Login-Admin" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1 p-4">
                <Routes>
                  <Route 
                    path="/statistique" 
                    element={
                      <PrivateRoute>
                        <Statistique />
                      </PrivateRoute>
                    } 
                  />
                   <Route 
                    path="/messe" 
                    element={
                      <PrivateRoute>
                        <Messe />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/utilisateur" 
                    element={
                      <PrivateRoute>
                        <Utilisateur />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/mon-compte" 
                    element={
                      <PrivateRoute>
                        <MonCompte />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
