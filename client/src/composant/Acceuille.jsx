import React, { useState, useEffect } from 'react';
import { useTransition, animated, useSpring } from '@react-spring/web';
import axios from 'axios';
import logo from '../assets/Logo1.png'; 
import img1 from '../assets/IMG_1556.JPG';
import img2 from '../assets/IMG_8301.JPG';
import img3 from '../assets/IMG-20230208-WA0149.jpg';
import { FaTwitter, FaInstagram, FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import '../css/index.css'


const images = [img1, img2, img3];

const Homes = () => {
  const [index, setIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    photo: null,
    name: '',
    firstName: '',
    email: '',
    country: '',
    phone: '',
    intention: '',
    prix: 0,
    paymentMethod: '',
    amount: '',
    receiptEmail: '',
    showPhotoUpload: false,
  });


  const [springProps, api] = useSpring(() => ({
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
    config: { tension: 200, friction: 10 },
    loop: { reverse: true },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showForm]);

  const transitions = useTransition(images[index], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 2000 },
  });

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseClick = () => {
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      type: value,
      showPhotoUpload: value === "messe d'anniversaire" || value === "messe de décès",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, photo: file });
  };  

 const handleSubmit = async (e) => {
    e.preventDefault();

    let widget =   FedaPay.init({
      public_key: 'pk_sandbox_ugZWRqso4-kTIwkUc57Ktb-q',
      transaction: {
        amount: formData.prix,
        description: 'Faire un don pour la messe',
        callback_url: 'http://localhost:5173/ConfirmePage',
      },
      customer: {
        email: formData.email,
        lastname: formData.name,
        firstname: formData.firstName,
        phone: formData.phone
      },
   });

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });
  
    try {
      widget.open()
      await axios.post('http://localhost:3000/api/demande', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Formulaire soumis avec succès');
     /* setFormData({
          type: '',
          photo: '',
          name: '',
          firstName: '',
          email: '',
          country: '',
          phone: '',
          intention: '',
          prix: 0,
          paymentMethod: '',
        })
          window.location.href = 'http://localhost:5173/ConfirmePage';*/
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      alert('Erreur lors de la soumission du formulaire : ' + error.message);
    }
  };
 

  return (
    <div className="relative h-screen bg-gray-100">
      {transitions((style, item) => (
        <animated.div
          key={item}
          className="absolute w-full h-full bg-cover bg-center"
          style={{ ...style, backgroundImage: `url(${item})` }}
        />
      ))}

      <div className="flex items-center justify-center h-full relative z-10 px-4">
        {!showForm ? (
          <animated.button onClick={handleButtonClick} className="px-6 py-3 bg-blue-500 text-white font-bold rounded"style={springProps}>
            Faire une demande de messe
          </animated.button>
        ) : (
          <div className="animate-slideup relative bg-white bg-opacity-90 p-5 rounded shadow-md w-full max-w-lg max-h-screen overflow-y-auto">
            <button
              onClick={handleCloseClick}
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full px-3 py-1"
            >
              &times;
            </button>
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="mx-auto w-24 h-24 sm:w-32 sm:h-32" />
            </div>
            <p>Les champs avec <span className="text-red-500 font-bold">**</span> sont obligatoires</p>
            <br />
            <form onSubmit={handleSubmit}>
  <div className="mb-4">
    <label className="block text-gray-700">Type de Messe <span className="text-red-500 font-bold">**</span></label>
    <select
      value={formData.type}
      onChange={handleTypeChange}
      name="type"
      className="w-full px-4 py-2 border rounded"
      required
    >
      <option value="">Sélectionnez une option</option>
      <option value="messe d'anniversaire">Messe d'anniversaire</option>
      <option value="messe de décès">Messe de décès</option>
      <option value="intention particulière">Intention particulière</option>
      <option value="action de grâce">Action de grâce</option>
    </select>
  </div>
  {formData.showPhotoUpload && (
    <div className="mb-4">
      <label className="block text-gray-700">Télécharger une photo</label>
      <input type="file" className="w-full px-4 py-2 border rounded" onChange={handleFileChange}/>
    </div>
  )}
  <div className="mb-4">
    <label className="block text-gray-700">Nom <span className="text-red-500 font-bold">**</span></label>
    <input type="text" name="name" className="w-full px-4 py-2 border rounded" value={formData.name} onChange={handleChange} required/>
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Prénom <span className="text-red-500 font-bold">**</span></label>
    <input type="text" name="firstName" className="w-full px-4 py-2 border rounded" value={formData.firstName} onChange={handleChange} required />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Email <span className="text-red-500 font-bold">**</span></label>
    <input type="email" name="email" className="w-full px-4 py-2 border rounded" value={formData.email} onChange={handleChange} required />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Pays <span className="text-red-500 font-bold">**</span></label>
    <input type="text" name="country" className="w-full px-4 py-2 border rounded" value={formData.country} onChange={handleChange} required/>
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Téléphone <span className="text-red-500 font-bold">**</span></label>
    <input type="text" name="phone" className="w-full px-4 py-2 border rounded" value={formData.phone} onChange={handleChange} required />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Intention <span className="text-red-500 font-bold">**</span></label>
    <textarea name="intention" className="w-full px-4 py-2 border rounded" value={formData.intention} onChange={handleChange} required></textarea>
  </div>
  <p className="text-center text-black-700 font-bold mt-2">Faire un don</p>
  <hr /><hr /><hr />
  <p className="text-center text-red-700 font-bold mt-2">Attention!!</p>
  <p className="text-center text-black-700 font-bold mt-2">Le prélèvement par Carte Bancaire a pour devise le $ et le prélèvement par Mobile Money a pour devise le FCFA</p>
  <br />
  <div className="mb-4">
    <label className="block text-gray-700">Prix ($ ou FCFA)</label>
    <input type="number" name="prix" className="w-full px-4 py-2 border rounded" value={formData.prix} onChange={handleChange} />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Sélection du mode de paiement</label>
    <select
      value={formData.paymentMethod}
      onChange={handleChange}
      name="paymentMethod"
      className="w-full px-4 py-2 border rounded"
    >
      <option value="">Sélectionnez une option</option>
      <option value="cb">Carte bancaire</option>
      <option value="mobileMoney">Mobile Money</option>
    </select>
  </div>
  <button type="submit" className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded">
    Soumettre
  </button>
</form>

          </div>
        )}
      </div>
      <div className="absolute top-4 left-4">
        <animated.img src={logo} alt="Logo" className="w-24 h-24 sm:w-32 sm:h-32" />
      </div>
      <footer className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-75 text-center">
      <div className="flex justify-center items-center space-x-4 mb-4">
      <div className="p-4 bg-white shadow-md rounded-lg transform transition-transform duration-300 scale-95 shadow-l shadow-blue-300 cursor-pointer">
        <h2 className="text-2xl font-semibold">Mission</h2>
        <p className="text-gray-700">Notre mission est de servir et aider la communauté.</p>
      </div>
      <animated.div className="p-4 bg-white shadow-md rounded-lg transform transition-transform duration-300 scale-105 shadow-xl shadow-gray-400 cursor-pointer" style={springProps}>
        <h2 className="text-2xl font-semibold">SMA-Togo TV</h2>
        <p className="text-gray-700">La SMA du Togo est une société missionnaire d'origine catholique.</p>
      </animated.div>
      <div className="p-4 bg-white shadow-md rounded-lg transform transition-transform duration-300 scale-95 shadow-l shadow-yellow-300 cursor-pointer">
        <h2 className="text-2xl font-semibold">Histoire</h2>
        <p className="text-gray-700">La SMA du Togo a une riche histoire de service et de foi.</p>
      </div>
    </div>

        <p className="text-black-700 font-bold">SMA TOGO TV, La Nouvelle chaîne missionnaire</p>
        <p>
          <a href="http://www.smatogo.tv" className="text-yellow-600 underline">www.smatogo.tv</a>
        </p>
        <p className="text-gray-500 font-bold mt-2">Contact: +228 90 89 77 87</p>
        <div className="flex justify-center space-x-4 mt-2">
        <animated.a 
        href="https://twitter.com/smatogo_tv" 
        className="text-blue-500" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaTwitter size={24} />
      </animated.a>
      <animated.a 
        href="https://instagram.com/smatogo_tv" 
        className="text-pink-500" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaInstagram size={24} />
      </animated.a>
      <animated.a 
        href="https://youtube.com/smatogo_tv" 
        className="text-red-500" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaYoutube size={24} />
      </animated.a>
      <animated.a 
        href="https://facebook.com/smatogo_tv" 
        className="text-blue-700" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaFacebook size={24} />
      </animated.a>
      <animated.a 
        href="https://tiktok.com/@smatogo_tv" 
        className="text-black" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaTiktok size={24} />
      </animated.a>

        </div>
        <p>
          <span href="http://www.horizonsmarttech.com" className="text-black-600">Dev by: <a className="text-red-600 underline">Horizon Smart Technologies</a> </span>
        </p>
      </footer>
    </div>
  );
};

export default Homes;
