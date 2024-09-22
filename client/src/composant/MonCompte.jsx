import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Assurez-vous d'avoir cette dépendance installée
import { ToastContainer, toast } from 'react-toastify'; // Importation de Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importation des styles Toastify
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MonCompte = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = window.localStorage.getItem('userAcces'); 
        let userId = null;

        if (token) {
          const decodedToken = jwtDecode(token);
          userId = decodedToken.userdata.user.id;
        }
        
        const response = await axios.get(`https://smatogo.tv/api/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        toast.error('Erreur lors de la récupération des informations utilisateur.');
      }
    };
    
    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Les nouveaux mots de passe ne correspondent pas.');
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      const token = window.localStorage.getItem('userAcces');
      let userId = null;

      if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userdata.user.id;
      }

      await axios.put(`https://smatogo.tv/api/user/${userId}/password`, {
        oldPassword,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Réinitialisation des champs de saisie
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('');
      toast.success('Mot de passe mis à jour avec succès.');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du mot de passe.');
      toast.error('Erreur lors de la mise à jour du mot de passe.');
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
    }
  };

  const handleSaveUserInfo = async () => {
    try {
      const token = window.localStorage.getItem('userAcces');
      let userId = null;

      if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userdata.user.id;
      }

      const updatedUser = {
        username: user.username,
        email: user.email
      };
      const response = await axios.put(`https://smatogo.tv/api/user/${userId}`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      toast.success('Informations utilisateur mises à jour avec succès.');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des informations utilisateur.');
      console.error('Erreur lors de la mise à jour des informations utilisateur:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = window.localStorage.getItem('userAcces');
      await axios.post('https://smatogo.tv/api/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      window.localStorage.removeItem('userAcces');
      navigate('/Login-Admin');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion.');
    }
  };

  if (!user) {
    return <div>Chargement...</div>; // Affiche un message de chargement pendant la récupération des données
  }

  return (
    <div className="p-6 sm:p-10 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">Mon Compte</h1>
      <hr /><hr /><br />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Informations de l'utilisateur</h2>
        <div className="space-y-2">
          <p className="text-lg text-gray-600"><strong>Nom d'utilisateur:</strong> {user.username}</p>
          <p className="text-lg text-gray-600"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg text-gray-600"><strong>Profil:</strong> {user.profile}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 hover:bg-red-600 transition duration-200"
        >
          Se déconnecter
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 ml-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 hover:bg-green-600 transition duration-200"
        >
          Modifier les informations
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Changer le mot de passe</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Ancien mot de passe</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 hover:bg-blue-600 transition duration-200"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-700 hover:text-gray-900 text-lg absolute top-4 right-4"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Modifier les informations</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveUserInfo}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-green-600 hover:bg-green-600 transition duration-200"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonCompte;
