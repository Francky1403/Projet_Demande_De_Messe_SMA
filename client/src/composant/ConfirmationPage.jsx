import React, { useState, useEffect } from 'react';
import "../css/admin.css"
import logo from '../assets/Logo1.png'; 

const ConfirmationPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="loader mb-4"></div>
          <p>Chargement en cours, veuillez patienter...</p>
        </div>
      ) : (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
          <img src={logo} alt="Logo" className="mx-auto w-24 h-24 sm:w-32 sm:h-32" />
          <h1 className="text-2xl font-bold mb-4">Merci pour votre don !</h1>
          <p className="mb-6">Votre don a été bien reçu. Nous vous remercions chaleureusement pour votre générosité.</p>
          <h2 className="text-xl font-semibold mb-4">Psaume 23</h2>
          <p className="italic mb-6">
            Le Seigneur est mon berger : <br />
            je ne manque de rien. <br />
            Sur des prés d'herbe fraîche, il me fait reposer. <br />
            Il me mène vers les eaux tranquilles <br />
            et me fait revivre ; <br />
            il me conduit par le juste chemin <br />
            pour l'honneur de son nom. <br />
            Si je traverse les ravins de la mort, <br />
            je ne crains aucun mal, <br />
            car tu es avec moi : <br />
            ton bâton me guide et me rassure. <br />
            Tu prépares la table pour moi <br />
            devant mes ennemis ; <br />
            tu répands le parfum sur ma tête, <br />
            ma coupe est débordante. <br />
            Grâce et bonheur m'accompagnent <br />
            tous les jours de ma vie ; <br />
            j'habiterai la maison du Seigneur <br />
            pour la durée de mes jours.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmationPage;
