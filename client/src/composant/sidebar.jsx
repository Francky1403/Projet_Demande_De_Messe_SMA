import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo1.png';
import {jwtDecode} from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChurch, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const token = window.localStorage.getItem('userAcces');
  let userProfile = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userProfile = decodedToken.userdata.user.profile; 
  }

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 p-4 z-40 bg-blue-800 text-white rounded-full focus:outline-none"
        aria-label="Toggle Sidebar"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-blue-800 text-white w-64 lg:translate-x-0 lg:static lg:w-64 lg:inset-0 overflow-y-auto`}
        role="navigation"
      >
        {/* Sidebar Header */}
        <div className="p-4 font-bold text-xl border-b border-gray-700 flex items-center justify-between lg:hidden">
          <span>SMA Togo</span>
          <button
            className="text-white focus:outline-none"
            aria-label="Close Sidebar"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Sidebar Logo and Title */}
        <div className="p-4 flex items-center border-b border-gray-700">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          <span className="hidden lg:block font-bold text-xl">SMA Togo</span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex flex-col space-y-2">
          <Link
            to="/statistique"
            className="flex items-center p-4 hover:bg-gray-700 rounded transition-colors"
            onClick={toggleSidebar}
            aria-label="Statistiques"
          >
            <FontAwesomeIcon icon={faChartBar} className="mr-3" />
            Statistique
          </Link>
          <Link
            to="/messe"
            className="flex items-center p-4 hover:bg-gray-700 rounded transition-colors"
            onClick={toggleSidebar}
            aria-label="Messe"
          >
            <FontAwesomeIcon icon={faChurch} className="mr-3" />
            Messe
          </Link>
          {userProfile === 'administrateur' && (
            <Link
              to="/utilisateur"
              className="flex items-center p-4 hover:bg-gray-700 rounded transition-colors"
              onClick={toggleSidebar}
              aria-label="Utilisateurs"
            >
              <FontAwesomeIcon icon={faUser} className="mr-3" />
              Utilisateur
            </Link>
          )}
          <Link
            to="/mon-compte"
            className="flex items-center p-4 hover:bg-gray-700 rounded transition-colors"
            onClick={toggleSidebar}
            aria-label="Mon Compte"
          >
            <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
            Mon Compte
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
