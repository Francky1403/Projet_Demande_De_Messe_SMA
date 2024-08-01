import React, { useState } from 'react';
import logo from '../assets/Logo1.png';
import '../css/admin.css'

const Administrateur = () => {
  const requests = [
    {
      id: 1, 
      typeMesse: 'Messe d\'anniversaire', 
      photo: 'path_to_photo.jpg',
      name: 'John Doe', 
      firstName: 'John',
      email: 'john@example.com', 
      phoneNumber: '+1234567890',
      paymentType: 'Carte bancaire',
      amount: '50€',
      date: '2024-07-01', 
      status: 'Pending'
    },
    {
      id: 2, 
      typeMesse: 'Messe d\'anniversaire', 
      photo: 'path_to_photo.jpg',
      name: 'Jane Doe', 
      firstName: 'Jane',
      email: 'jane@example.com', 
      phoneNumber: '+0987654321',
      paymentType: 'Carte bancaire',
      amount: '60€',
      date: '2024-07-02', 
      status: 'Pending'
    },
   
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  
  const totalPages = Math.ceil(requests.length / itemsPerPage);

 
  const currentRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="p-4 sm:p-8 bg-gray-300 min-h-screen">
      <div className="text-center mb-8">
        <img src={logo} alt="Logo" className="mx-auto w-24 h-24 sm:w-32 sm:h-32" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Demandes de Messe</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2">Type de messe</th>
              <th className="px-2 sm:px-4 py-2">Photo</th>
              <th className="px-2 sm:px-4 py-2">Nom</th>
              <th className="px-2 sm:px-4 py-2">Prénom</th>
              <th className="px-2 sm:px-4 py-2">Email</th>
              <th className="px-2 sm:px-4 py-2">Numéro de Téléphone</th>
              <th className="px-2 sm:px-4 py-2">Type de paiement</th>
              <th className="px-2 sm:px-4 py-2">Montant</th>
              <th className="px-2 sm:px-4 py-2">Date</th>
              <th className="px-2 sm:px-4 py-2">Status</th>
              <th className="px-2 sm:px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.id}>
                <td className="border px-2 sm:px-4 py-2">{request.typeMesse}</td>
                <td className="border px-2 sm:px-4 py-2">
                  <img src={request.photo} alt="Photo" className="w-16 h-16 object-cover" />
                </td>
                <td className="border px-2 sm:px-4 py-2">{request.name}</td>
                <td className="border px-2 sm:px-4 py-2">{request.firstName}</td>
                <td className="border px-2 sm:px-4 py-2">{request.email}</td>
                <td className="border px-2 sm:px-4 py-2">{request.phoneNumber}</td>
                <td className="border px-2 sm:px-4 py-2">{request.paymentType}</td>
                <td className="border px-2 sm:px-4 py-2">{request.amount}</td>
                <td className="border px-2 sm:px-4 py-2">{request.date}</td>
                <td className="border px-2 sm:px-4 py-2">{request.status}</td>
                <td className="border px-2 sm:px-4 py-2">
                  <button className="bg-green-500 text-white px-4 py-2 rounded">Valider</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">Refuser</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Précédent
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Administrateur;
