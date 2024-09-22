import React, { useState, useEffect } from 'react';
import { useTransition, animated, useSpring } from '@react-spring/web';
import axios from 'axios';
import logo from '../assets/Logo1.png'; 
import img1 from '../assets/IMG_1556.JPG';
import img3 from '../assets/IMG-20230208-WA0149.jpg';
import img4 from '../assets/IMG_1.jpg';
import img5 from '../assets/IMG_2.jpg';
import img6 from '../assets/IMG_3.jpg';
import img7 from '../assets/IMG_4.jpg';
import img8 from '../assets/IMG_5.jpg';
import img9 from '../assets/IMG_6.jpg';
import img10 from '../assets/IMG_7.jpg';
import img11 from '../assets/IMG_8.jpg';
import img12 from '../assets/IMG_9.jpg';
import img13 from '../assets/IMG_10.jpg';
import img14 from '../assets/IMG_11.jpg';
import img15 from '../assets/IMG_12.jpg';
import img16 from '../assets/IMG_13.jpg';
import img17 from '../assets/IMG_14.jpg';
import img18 from '../assets/IMG_15.jpg';
import img19 from '../assets/IMG_16.jpg';
import img20 from '../assets/IMG_17.jpg';
import img21 from '../assets/IMG_18.jpg';
import img22 from '../assets/IMG_19.jpg';
import { FaTwitter, FaInstagram, FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import '../css/index.css';



const images = [img1, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22];

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
  
    // Initialisation du widget de paiement
    const widget = FedaPay.init({
      public_key: 'pk_live_l5M1jWyDSP2-fq5RBO1NZfEE',
      transaction: {
        description: 'Faire un don pour la messe',
        amount: formData.prix,
        callback_url: 'https://smatogo.tv/ConfirmePage',
      },
      customer: {
        email: formData.email,
        lastname: formData.name,
        firstname: formData.firstName,
        phone: formData.phone,
      },
      onComplete: async (resp) => {
        if (resp.transaction.status === 'approved') {
          const formPayload = new FormData();
          Object.keys(formData).forEach((key) => {
            formPayload.append(key, formData[key]);
          });
  
          try {
            
            await axios.post('https://smatogo.tv/api/demande', formPayload, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            setFormData({
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
            });
            
             window.location.href = 'https://smatogo.tv/ConfirmePage';
          } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            alert('Erreur lors de la soumission du formulaire : ' + error.message);
          }
        } else {
          alert('Le paiement n\'a pas été approuvé.');
        }
      },
    });
    widget.open();
  };
  
  

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {transitions((style, item) => (
        <animated.div
          key={item}
          className="absolute w-full h-full bg-cover bg-center"
          style={{ ...style, backgroundImage: `url(${item})` }}
        />
      ))}
        {!showForm ? (
          <animated.button onClick={handleButtonClick} className="px-6 py-3 bg-blue-500 text-white font-bold rounded md:order-1 mb-4 md:mb-0"style={springProps}>
            Faire une demande de messe
          </animated.button>
        ) : (
          <div className="animate-slideup fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white bg-opacity-90 p-5 rounded shadow-md w-full max-w-lg max-h-screen overflow-y-auto">
             <a></a>
             <br /><br /><br /><br /><br />
            <button
              onClick={handleCloseClick}
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full px-3 py-1"
            >
              &times;
            </button>
            <div className="text-center mb-2">
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
  <p className="text-center text-black-700 font-bold mt-2">Le prélèvement par Carte Bancaire et le prélèvement par Mobile Money ont pour devise le FCFA</p>
  <br />
  <div className="mb-4">
    <label className="block text-gray-700">Montant (FCFA)</label>
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
 <div className="flex flex-col items-center space-y-2">
  <button type="submit" className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded">
    Soumettre
  </button>
  <button onClick={handleCloseClick} className="w-3/4 px-4 py-2 bg-red-500 text-white font-bold rounded ">
    Fermer le formulaire
  </button>
</div>
 <br /><br /><br />
  <a></a>
</form>
</div>
          </div>
        )}
      <div className="absolute top-4 left-4">
        <animated.img src={logo} alt="Logo" className="w-24 h-24 sm:w-32 sm:h-32" />
      </div>
      <footer className="absolute bottom-0 left-0 w-full bg-white bg-opacity-75 text-gray-700 py-2 text-center border-t border-gray-300">
      <div className="flex justify-center items-center space-x-1 mb-1">
      <animated.div className="p-1 bg-yellow-100 shadow-md rounded-lg transform transition-transform duration-300 scale-100 shadow-l shadow-blue-500" style={springProps}>
        <h2 className="text-2xl font-semibold">SMA TOGO TV</h2>
        <p className="text-gray-700">vous offre l'opportunité de prier pour vous et avec vous</p>
      </animated.div>
    </div>
        <p className="text-black-700 font-bold">SMA TOGO TV, La Nouvelle chaîne missionnaire</p>
        <p className="text-gray-500 font-bold">Contact: +228 90 89 77 87 | <a href="https://smatogo.tv" className="text-yellow-600 underline">smatogo.tv |<a className="text-blue-600 underline">© [2024] SMA TOGO TV. Tous droits réservés.</a> </a></p>
        <div className="flex justify-center space-x-4">
        <animated.a 
        href="https://twitter.com/smatogotv" 
        className="text-blue-500" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaTwitter size={24} />
      </animated.a>
      <animated.a
  href="https://instagram.com/smatogotv"
  className="text-pink-500"
  target="_blank"
  rel="noopener noreferrer"
  style={springProps}
>
  <FaInstagram size={24} />
</animated.a>
      <animated.a 
        href="https://www.youtube.com/@provincetogo" 
        className="text-red-500" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaYoutube size={24} />
      </animated.a>
      <animated.a 
        href="https://www.facebook.com/televisionmissionnaire" 
        className="text-blue-700" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaFacebook size={24} />
      </animated.a>
      <animated.a 
        href="https://www.tiktok.com/@smatogotv" 
        className="text-black" 
        target="_blank" 
        rel="noopener noreferrer"
        style={springProps}
      >
        <FaTiktok size={24} />
      </animated.a>
        </div>
        <p>
          <span className="text-black-600">Dev by: <a rel="noopener noreferrer" href="https://wa.me/22891147797" target="_blank" className="text-red-600 underline cursor-pointer">Tiger Kingsman(TK)</a> </span>
        </p>
      </footer>
    </div>
  );
};
export default Homes;
