import React, { useState, useEffect } from 'react';
import '../css/admin.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import Papa from 'papaparse';
import {jwtDecode} from 'jwt-decode';


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
        const response = await axios.get('https://smatogo.tv/api/messe');
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
    await axios.put(`https://smatogo.tv/api/demandes/${requestId}/traiter`);
    const response = await axios.get('https://smatogo.tv/api/messe');
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

  const handleDownloadRequestPDF = async (request) => {
    const doc = new jsPDF();
    doc.text("Informations de la messe", 10, 10);
  
    // Convertir l'image en base64 en utilisant canvas
    let imgData = '';
    if (request.photoUrl) {
      const image = new Image();
      image.crossOrigin = 'Anonymous'; // Pour les images d'un domaine différent
      image.src = request.photoUrl;
  
      await new Promise((resolve) => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          imgData = canvas.toDataURL('image/jpeg');
          resolve();
        };
      });
    }
  
    // Ajouter l'image au PDF
    if (imgData) {
      doc.addImage(imgData, 'JPEG', 10, 20, 50, 50); // Ajustez les coordonnées et la taille selon vos besoins
    }
  
    autoTable(doc, {
      startY: 80, // Assurez-vous que le texte et l'image ne se chevauchent pas
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
    doc.save(`${request.type}_${request.name}_details.pdf`);
  };

  const handleDownloadRequestImage = async (request) => {
    if (request.photoUrl) {
      const image = new Image();
      image.crossOrigin = 'Anonymous'; // Pour les images provenant d'un domaine différent
      image.src = request.photoUrl;
  
      await new Promise((resolve) => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
  
          // Obtenir l'extension de l'image (jpg ou png)
          const ext = request.photoUrl.split('.').pop().toLowerCase();
          const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  
          // Convertir l'image en base64
          const imgData = canvas.toDataURL(mimeType);
  
          // Créer un lien de téléchargement
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `image_${request.name}.${ext}`;
          link.click();
  
          resolve();
        };
      });
    }
  };
  
  const handleDownloadTablesPDF = async () => {
    const doc = new jsPDF();
  
    // Fonction pour convertir les images en base64
    const convertImageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous'; // Pour les images d'un domaine différent
        image.src = url;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        };
        image.onerror = (error) => {
          console.error('Image failed to load:', error);
          reject(error);
        };
      });
    };
  
    // Préparer les données avec les images en base64
    const requestsWithImages = await Promise.all(requests.map(async (request) => {
      let imgData = '';
      if (request.photoUrl) {
        try {
          imgData = await convertImageToBase64(request.photoUrl);
        } catch (error) {
          console.error('Error converting image to base64:', error);
        }
      }
      return {
        ...request,
        imgData
      };
    }));
  
    // Configurer autoTable
    autoTable(doc, {
      startY: 20,
      head: [['Photo', 'Type de Messe', 'Nom', 'Prénom', 'Email', 'Pays', 'Téléphone', 'Intention', 'Prix', 'Paiement', 'Date de Création', 'Statut']],
      body: requestsWithImages.map(request => [
        request.imgData ? { image: request.imgData, width: 20, height: 20 } : '',
        String(request.type),
        String(request.name),
        String(request.firstName),
        String(request.email),
        String(request.country),
        String(request.phone),
        String(request.intention),
        String(request.prix),
        String(request.payment),
        String(new Date(request.createdAt).toLocaleDateString()),
        request.traite ? 'Traité' : 'En attente'
      ]),
      columnStyles: {
        0: { cellWidth: 20 },
      },
      margin: { top: 20 },
    });
  
    doc.save('request.pdf');
  };
  

  const handleDownloadTablesCSV = () => {
    const csv = Papa.unparse(requests.map(request => ({
      'Type de Messe': request.type,
      'Nom': request.name,
      'Prénom': request.firstName,
      'Email': request.email,
      'Pays': request.country,
      'Téléphone': request.phone,
      'Intention de Messe': request.intention,
      'Type de Paiement': request.payment,
      'Montant': request.prix,
      'Date': new Date(request.createdAt).toLocaleDateString(),
      'Statut': request.traite ? 'Traité' : 'En attente',
      'Photo URL': request.photoUrl || 'Aucune photo' // Ajouter l'URL de la photo
    })));
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

  const token = window.localStorage.getItem('userAcces');
  let userProfile = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userProfile = decodedToken.userdata.user.profile; 
  }

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
        <table className="w-full min-w-[1300px] bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th className="px-2 sm:px-2 py-2">Type de Messe</th>
              <th className="py-2 px-2 sm:px-2 bg-gray-200 text-gray-600 border">Photo</th>
              <th className="px-2 sm:px-2 py-2">Nom</th>
              <th className="px-2 sm:px-2 py-2">Prénom</th>
              <th className="px-2 sm:px-2 py-2">Email</th>
              <th className="px-2 sm:px-2 py-2">Pays</th>
              <th className="px-2 sm:px-2 py-2">Numéro de Téléphone</th>
             {userProfile !== 'gestionnaire' && (
              <>
              <th className="px-3 sm:px-3 py-3">Intention de Messe</th>
             </>
             )}
              <th className="px-2 sm:px-2 py-2">Type de Paiement</th>
             {userProfile !== 'gestionnaire' && (
             <>
              <th className="px-2 sm:px-2 py-2">Montant</th>
             </>
             )}
              <th className="px-2 sm:px-2 py-2">Date</th>
              <th className="px-2 sm:px-2 py-2">Statut</th>
              <th className="px-2 sm:px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.id}>
                <td className="border px-2 sm:px-2 py-2">{request.type}</td>
                <td className="border px-2 sm:px- py-2">
                {request.photoUrl && <img src={request.photoUrl} alt="Messe" className="w-20 h-auto rounded-full" />}
                </td>
                <td className="border px-2 sm:px-2 py-2">{request.name}</td>
                <td className="border px-2 sm:px-2 py-2">{request.firstName}</td>
                <td className="border px-2 sm:px-2 py-2">{request.email}</td>
                <td className="border px-2 sm:px-2 py-2">{request.country}</td>
                <td className="border px-2 sm:px-2 py-2">{request.phone}</td>
                {userProfile !== 'gestionnaire' && (
                <>
                <td className="border px-3 sm:px-3 py-3">{request.intention}</td>
                </>
                )}
                <td className="border px-2 sm:px-2 py-2">{request.payment}</td>
               {userProfile !== 'gestionnaire' && (
               <>
                <td className="border px-2 sm:px-2 py-2">{request.prix}</td>
               </>
               )}
                <td className="border px-2 sm:px-2 py-2">{new Date(request.createdAt).toLocaleDateString()}</td>
                <td className="border px-2 sm:px-2 py-2">
                  <button 
                    onClick={() => toggleRequestStatus(request.id)}
                    className={`px-4 py-2 rounded ${request.traité ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  >
                    {request.traité ? 'En attente' : 'Traité' }
                  </button>
                </td>
                <td className="border px-3 sm:px-3 py-3">
                <button onClick={() => handleViewModalOpen(request)} className="text-blue-700">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button onClick={() => handleDownloadRequestPDF(request)} className='text-green-700'>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button onClick={() => handleDownloadRequestImage(request)} className='text-red-900'>
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
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
      <div>
        {selectedRequest.photoUrl && <img src={selectedRequest.photoUrl} alt="Messe" className="w-40 h-auto rounded-full" />}
      </div>
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
