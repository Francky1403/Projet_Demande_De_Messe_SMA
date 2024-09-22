import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import logo from '../assets/Logo1.png'; 
import img1 from '../assets/IMG_1556.JPG';
import img2 from '../assets/IMG_8301.JPG';
import img3 from '../assets/IMG-20230208-WA0149.jpg';

const images = [img1, img2, img3];

const Login = () => {
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const transitions = useTransition(images[index], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
    await axios.post('https://smatogo.tv/api/login', { email, password }).then((response)=>{
        window.localStorage.setItem('userAcces', response.data)
        toast.success('Connexion réussie !');
        navigate('/messe');
      }
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Email ou mot de passe incorrect');
      } else if (error.response && error.response.status === 403) {
        toast.error('Utilisateur déjà connecté');
      }else if (error.response && error.response.status === 402) {
        toast.error('Utilisateur inactif! Veuillez contacter l\'administrateur');
      } else {
        toast.error('Erreur lors de la connexion');
      }
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
      {transitions((style, item) => (
        <animated.div
          key={item}
          className="absolute w-full h-full bg-cover bg-center"
          style={{ ...style, backgroundImage: `url(${item})` }}
        />
      ))}
      <ToastContainer />
      <div className="relative z-10 bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-24 h-24 md:w-32 md:h-32" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          <br />
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
