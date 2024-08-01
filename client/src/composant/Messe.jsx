import React, { useState, useEffect } from 'react';
import '../css/admin.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faTimes, } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';


const Messe = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpens, setIsViewModalOpens] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/messe');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request =>
    request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.intention.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.prix.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(request.createdAt).toLocaleDateString().includes(searchTerm.toLowerCase()) ||
    (request.traite ? 'Traité' : 'En attente').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRequestStatus = async (requestId) => {
  try {
    await axios.put(`http://localhost:3000/api/demandes/${requestId}/traiter`);
    const response = await axios.get('http://localhost:3000/api/messe');
        setRequests(response.data);
  } catch (error) {
    console.error('Échec de la mise à jour du statut de la demande:', error);   
  }
  };
  

  const handleViewModalCloses = () => {
    setIsViewModalOpens(false);
    setSelectedRequest(null);
  };

  const handleViewModalOpen = (request) => {
    setSelectedRequest(request);
    setIsViewModalOpens(true);
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

  const handleDownloadRequestPDF = (request) => {
    const doc = new jsPDF();
    doc.text("Informations de la messe", 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Champ', 'Valeur']],
      body: [
        ['Type de Messe', request.type],
        ['Nom', request.name],
        ['Prénom', request.firstName],
        ['Email', request.email],
        ['Pays', request.country],
        ['Téléphone', request.phone],
        ['Intention', request.intention],
        ['Prix', request.prix],
        ['Mode de Paiement', request.payment],
        ['Date de Création', new Date(request.createdAt).toLocaleDateString()],
        ['Statut', request.traite ? 'Traité' : 'En attente']
    ]
    });
    doc.save(`${request.type}_details.pdf`);
  };

  const handleDownloadTablesPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des messes", 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Type de Messe', 'Nom', 'Prénom', 'Email', 'Pays', 'Téléphone', 'Intention', 'Prix', 'Paiement', 'Date de Création', 'Statut']],
      body : requests.map(request => [
        request.type, 
        request.name, 
        request.firstName, 
        request.email, 
        request.country, 
        request.phone, 
        request.intention, 
        request.prix, 
        request.payment, 
        new Date(request.createdAt).toLocaleDateString(), 
        request.traite ? 'Traité' : 'En attente' 
      ])
    });
    doc.save('request.pdf');
  };

  const handleDownloadTablesCSV = () => {
    const csv = Papa.unparse(users);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'request.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Demandes De Messe</h2>
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
        <table className="w-full min-w-[1200px] bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2">Type de Messe</th>
              <th className="px-2 sm:px-4 py-2">Photo</th>
              <th className="px-2 sm:px-4 py-2">Nom</th>
              <th className="px-2 sm:px-4 py-2">Prénom</th>
              <th className="px-2 sm:px-4 py-2">Email</th>
              <th className="px-2 sm:px-4 py-2">Pays</th>
              <th className="px-2 sm:px-4 py-2">Numéro de Téléphone</th>
              <th className="px-2 sm:px-4 py-2">Intention de Messe</th>
              <th className="px-2 sm:px-4 py-2">Montant</th>
              <th className="px-2 sm:px-4 py-2">Type de Paiement</th>
              <th className="px-2 sm:px-4 py-2">Date</th>
              <th className="px-2 sm:px-4 py-2">Statut</th>
              <th className="px-2 sm:px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.id}>
                <td className="border px-2 sm:px-4 py-2">{request.type}</td>
                <td className="border px-2 sm:px-4 py-2">
                  <img src={request.photo || 'default_photo_path.jpg'} alt="Photo" className="w-16 h-16 object-cover" />
                </td>
                <td className="border px-2 sm:px-4 py-2">{request.name}</td>
                <td className="border px-2 sm:px-4 py-2">{request.firstName}</td>
                <td className="border px-2 sm:px-4 py-2">{request.email}</td>
                <td className="border px-2 sm:px-4 py-2">{request.country}</td>
                <td className="border px-2 sm:px-4 py-2">{request.phone}</td>
                <td className="border px-2 sm:px-4 py-2">{request.intention}</td>
                <td className="border px-2 sm:px-4 py-2">{request.payment}</td>
                <td className="border px-2 sm:px-4 py-2">{request.prix}</td>
                <td className="border px-2 sm:px-4 py-2">{new Date(request.createdAt).toLocaleDateString()}</td>
                <td className="border px-2 sm:px-4 py-2">
                  <button 
                    onClick={() => toggleRequestStatus(request.id)}
                    className={`px-4 py-2 rounded ${request.traité ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  >
                    {request.traité ? 'En attente' : 'Traité' }
                  </button>
                </td>
                <td className="border px-2 sm:px-4 py-2">
                <button onClick={() => handleViewModalOpen(request)} className="text-blue-700">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button onClick={() => handleDownloadRequestPDF(request)} className='text-green-700'>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="mt-4 flex justify-between">
          <button onClick={handleDownloadTablesPDF} className="px-4 py-2 bg-blue-500 text-white rounded">
            Télécharger en PDF
          </button>
          <button onClick={handleDownloadTablesCSV} className="px-4 py-2 bg-green-500 text-white rounded">
            Télécharger en CSV
          </button>
      </div>
      <Modal
  isOpen={isViewModalOpens}
  onRequestClose={handleViewModalCloses}
  contentLabel="Voir les informations de la messe"
  ariaHideApp={false}
  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
  <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
    <button
      onClick={handleViewModalCloses}
      className="text-gray-700 hover:text-gray-900 text-lg absolute top-4 right-4"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
    {selectedRequest && (
      <>
        <h2 className="text-2xl mb-4 font-bold">Informations de la messe</h2>
        <p><strong>Type de Messe:</strong> {selectedRequest.type}</p>
    <p><strong>Nom:</strong> {selectedRequest.name}</p>
    <p><strong>Prénom:</strong> {selectedRequest.firstName}</p>
    <p><strong>Email:</strong> {selectedRequest.email}</p>
    <p><strong>Pays:</strong> {selectedRequest.country}</p>
    <p><strong>Téléphone:</strong> {selectedRequest.phone}</p>
    <p><strong>Intention:</strong> {selectedRequest.intention}</p>
    <p><strong>Prix:</strong> {selectedRequest.prix}</p>
    <p><strong>Paiement:</strong> {selectedRequest.payment}</p>
    <p><strong>Date de Création:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
    <p><strong>Statut:</strong> {selectedRequest.traite ? 'Traité' : 'En attente'}</p>
      </>
    )}
  </div>
</Modal>
      </div>
  );
};

export default Messe;
