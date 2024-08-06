import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTimes, faDownload, faLock } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const Utilisateur = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', profile: '', isActive: true });

  const itemsPerPage = 7;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user'); 
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.toLowerCase().includes(searchTerm.toLowerCase())||
    new Date(request.createdAt).toLocaleDateString().includes(searchTerm.toLowerCase()) 
  );

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleModifStatus = async (utilisateurId) => {
    try {
        await axios.put(`http://localhost:3000/api/utilisateurs/${utilisateurId}/statuts`);
        toast.success('Statut mis à jour avec succès !');
        const response = await axios.get('http://localhost:3000/api/user'); 
        setUsers(response.data)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'état d'activation de l'utilisateur avec l'ID ${utilisateurId}.`, error);
      toast.error('Échec de la mise à jour du statut.');
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setNewUser({ username: '', email: '', password: '', profile: '', isActive: true });
  };

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewModalOpen = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditModalOpen = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handlePassModalClose = () => {
    setIsPassModalOpen(false);
    setSelectedUser(null);
  };

  const handlePassModalOpen = (user) => {
    setSelectedUser(user);
    setIsPassModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handlePassChange = (e) => {
    setSelectedUser({ ...selectedUser, newPassword: e.target.value });
  };

  const handleclosecreatemodal = () =>{
    handleCreateModalClose();
    refreshPage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/utilisateur', newUser);
      setUsers([...users, response.data.user]);
      toast.success('Utilisateur créé avec succès !');
      setNewUser({ username: '', email: '', password: '', profile: '', isActive: true });
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Échec de la création de l\'utilisateur.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Données envoyées pour la mise à jour :', selectedUser);
    try {
      await axios.put(`http://localhost:3000/api/user/${selectedUser.id}`, selectedUser);
      setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
      toast.success('Utilisateur mis à jour avec succès !');
      handleEditModalClose();
    } catch (error) {
      console.error('Échec de la mise à jour de l\'utilisateur :', error);
      toast.error('Échec de la mise à jour de l\'utilisateur.');
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/user/${selectedUser.id}/passwords`, {
        newPasswords: selectedUser.newPassword
      });
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, password: selectedUser.newPassword } : user));
      toast.success('Mot de passe mis à jour avec succès !');
      handlePassModalClose();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Échec de la mise à jour du mot de passe.');
    }
  };
  
  const refreshPage = () => {
    window.location.reload();
  };

  const handleDownloadUserPDF = (user) => {
    const doc = new jsPDF();
    doc.text("Informations de l'utilisateur", 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Champ', 'Valeur']],
      body: [
        ['Nom d\'utilisateur', user.username],
        ['Email', user.email],
        ['Profil', user.profile],
        ['Date de Création', new Date(user.createdAt).toLocaleDateString()],
        ['Statut', user.isActive ? 'A Activer' : 'A Désactiver']
      ]
    });
    doc.save(`${user.username}_details.pdf`);
  };

  const handleDownloadTablePDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des utilisateurs", 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Nom d\'utilisateur', 'Email', 'Profil', 'Statut']],
      body: users.map(user => [
        user.username,
        user.email,
        user.profile,
        new Date(user.createdAt).toLocaleDateString(),
        user.isActive ? 'Actif' : 'Inactif'
      ])
    });
    doc.save('utilisateurs.pdf');
  };

  const handleDownloadTableCSV = () => {
    const csv = Papa.unparse(users);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'utilisateurs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Gestion Des Utilisateurs</h2>
        <button
          onClick={handleCreateModalOpen}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Créer un Utilisateur
        </button>
      </div>
      <hr /><hr /><br />
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded border"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2">Nom d'utilisateur</th>
              <th className="px-2 sm:px-4 py-2">Email</th>
              <th className="px-2 sm:px-4 py-2">Profil</th>
              <th className="px-2 sm:px-4 py-2">Date</th>
              <th className="px-2 sm:px-4 py-2">Status</th>
              <th className="px-2 sm:px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td className="border px-2 sm:px-4 py-2">{user.username}</td>
                <td className="border px-2 sm:px-4 py-2">{user.email}</td>
                <td className="border px-2 sm:px-4 py-2">{user.profile}</td>
                <td className="border px-2 sm:px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="border px-2 sm:px-4 py-2">
                  <button 
                    onClick={() => handleModifStatus(user.id)}
                    className={`px-4 py-2 rounded ${user.IsActive ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  >
                    {user.IsActive ? 'Désactiver Moi' : 'Activer Moi' }
                  </button>
                </td>
                <td className="border px-2 sm:px-4 py-2 flex space-x-2">
                  <button onClick={() => handleViewModalOpen(user)} className="text-blue-700">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button onClick={() => handleEditModalOpen(user)} className='text-yellow-300'>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handlePassModalOpen(user)} className='text-gray-700'>
                    <FontAwesomeIcon icon={faLock} />
                  </button>
                  <button onClick={() => handleDownloadUserPDF(user)} className='text-green-700'>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1} 
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages} 
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
        <div className="mt-4 flex justify-between">
          <button onClick={handleDownloadTablePDF} className="px-4 py-2 bg-blue-500 text-white rounded">
            Télécharger en PDF
          </button>
          <button onClick={handleDownloadTableCSV} className="px-4 py-2 bg-green-500 text-white rounded">
            Télécharger en CSV
          </button>
        </div>
      </div>
      <Modal
  isOpen={isCreateModalOpen}
  onRequestClose={handleCreateModalClose}
  contentLabel="Créer un Utilisateur"
  ariaHideApp={false}
  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
  <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
    <button
      onClick={handleclosecreatemodal}
      className="text-gray-700 hover:text-gray-900 text-lg absolute top-4 right-4"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
    <h2 className="text-2xl mb-4 font-bold">Créer un Utilisateur</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2">Nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          value={newUser.username}
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Mot de passe</label>
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Profil</label>
        <select
          name="profile"
          value={newUser.profile}
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        >
          <option value="">Sélectionnez un profil</option>
          <option value="gestionnaire">Gestionnaire</option>
          <option value="administrateur">Administrateur</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        Créer
      </button>
    </form>
  </div>
      </Modal>
      <Modal
  isOpen={isViewModalOpen}
  onRequestClose={handleViewModalClose}
  contentLabel="Voir les informations de l'utilisateur"
  ariaHideApp={false}
  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
  <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
    <button
      onClick={handleViewModalClose}
      className="text-gray-700 hover:text-gray-900 text-lg absolute top-4 right-4"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
    {selectedUser && (
      <>
        <h2 className="text-2xl mb-4 font-bold">Informations de l'utilisateur</h2>
        <p><strong>Nom d'utilisateur:</strong> {selectedUser.username}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Profil:</strong> {selectedUser.profile}</p>
        <p><strong>Date de Création:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
        <p><strong>Statut:</strong> {selectedUser.isActive ? 'A Activer' : 'A Désactiver'}</p>
      </>
    )}
  </div>
      </Modal>
      <Modal
  isOpen={isEditModalOpen}
  onRequestClose={handleEditModalClose}
  contentLabel="Modifier Utilisateur"
  ariaHideApp={false}
  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
  <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
    <button
      onClick={handleEditModalClose}
      className="text-gray-700 hover:text-gray-900 text-lg absolute top-4 right-4"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
    {selectedUser && (
      <>
        <h2 className="text-2xl mb-4 font-bold">Modifier Utilisateur</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={selectedUser.username}
              onChange={handleEditChange}
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={selectedUser.email}
              onChange={handleEditChange}
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Profil</label>
            <select
              name="profile"
              value={selectedUser.profile}
              onChange={handleEditChange}
              className="w-full p-2 rounded border"
              required
            >
              <option value="">Sélectionnez un profil</option>
              <option value="gestionnaire">Gestionnaire</option>
              <option value="administrateur">Administrateur</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Modifier
          </button>
        </form>
      </>
    )}
  </div>
      </Modal>
      <Modal
  isOpen={isPassModalOpen}
  onRequestClose={handlePassModalClose}
  contentLabel="Modifier Mot de Passe"
  ariaHideApp={false}
  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
  <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
    <button
      onClick={handlePassModalClose}
      className="text-gray-700 hover:text-gray-900 text-lg absolute top-4 right-4"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
    {selectedUser && (
      <>
        <h2 className="text-2xl mb-4 font-bold">Modifier Mot de Passe</h2>
        <form onSubmit={handlePassSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              name="password"
              onChange={handlePassChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Modifier Mot de Passe
          </button>
        </form>
      </>
    )}
  </div>
      </Modal>
    </div>
  );
};

export default Utilisateur;
