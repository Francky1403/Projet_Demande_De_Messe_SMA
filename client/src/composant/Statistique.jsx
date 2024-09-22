import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistique = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMesseRequests: 0,
    totalMesseRequestsTraite: 0,
    totalMesseRequestsNTraite: 0,
    totalAdministrateurs: 0,
    totalGestionnaires: 0,
    totalPrêtre: 0,
    totalmesseanif: 0,
    totalmessedeces: 0,
    totalintentionpart: 0,
    totalactiongrace: 0,
    utilisateursActifs: 0,
    utilisateursInActifs: 0,
    totalAmount: 0,
    totalAmountMobile: 0,
    totalAmountCB: 0,
    messeData: [],
    pieData: [],
    monthlyData: []
  });

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        axios.get('https://smatogo.tv/api/stats/total-utilisateurs'),
        axios.get('https://smatogo.tv/api/stats/total-administrateurs'),
        axios.get('https://smatogo.tv/api/stats/total-gestionnaires'),
        axios.get('https://smatogo.tv/api/stats/total-pretre'),
        axios.get('https://smatogo.tv/api/stats/messe-anniversaire'),
        axios.get('https://smatogo.tv/api/stats/messe-deces'),
        axios.get('https://smatogo.tv/api/stats/intention-particuliere'),
        axios.get('https://smatogo.tv/api/stats/action-grace'),
        axios.get('https://smatogo.tv/api/stats/utilisateurs-actifs'),
        axios.get('https://smatogo.tv/api/stats/utilisateurs-inactifs'),
        axios.get('https://smatogo.tv/api/stats/total-demande'),
        axios.get('https://smatogo.tv/api/stats/demandes-traitees'),
        axios.get('https://smatogo.tv/api/stats/demandes-non-traitees'),
        axios.get('https://smatogo.tv/api/messe-monthly-stats'),
        axios.get('https://smatogo.tv/api/messe-repartition'),
        axios.get('https://smatogo.tv/api/stats/mensuel-demandes'),
        axios.get('https://smatogo.tv/api/total-prix'),
        axios.get('https://smatogo.tv/api/total-cb'),
        axios.get('https://smatogo.tv/api/total-mm')
      ]);

        const messeData = responses[13].data.messeData || [];
      const pieData = responses[14].data.pieData || [];
      const monthlyData = formatMonthlyData(responses[15].data);

      const totalAmount = responses[16].data.total || 0;
      const totalAmountCB = responses[17].data.total || 0;
      const totalAmountMobile = responses[18].data.total || 0;

      setStats({
        totalUsers: responses[0].data.totalUtilisateurs || 0,
        totalAdministrateurs: responses[1].data.totalAdministrateurs || 0,
        totalGestionnaires: responses[2].data.totalGestionnaires || 0,
        totalPrêtre: responses[3].data.totalPrêtre || 0,
        totalmesseanif: responses[4].data.totalAnniversaire || 0,
        totalmessedeces: responses[5].data.totalDeces || 0,
        totalintentionpart: responses[6].data.totalIntentionParticuliere || 0,
        totalactiongrace: responses[7].data.totalActionGrace || 0,
        utilisateursActifs: responses[8].data.utilisateursActifs || 0,
        utilisateursInActifs: responses[9].data.utilisateursInactifs || 0,
        totalMesseRequests: responses[10].data.totalDemande || 0,
        totalMesseRequestsTraite: responses[11].data.demandesTraitees || 0,
        totalMesseRequestsNTraite: responses[12].data.demandesNonTraitees || 0,
        messeData,
        pieData,
        totalAmount,
        totalAmountCB,
        totalAmountMobile,
        monthlyData
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatMonthlyData = (data) => {
    const formattedData = Object.keys(data).map((month) => ({
      month,
      'Messe Anniversaire': data[month]['messe d\'anniversaire'] || 0,
      'Messe Décès': data[month]['messe de décès'] || 0,
      'Intention Particulière': data[month]['intention particulière'] || 0,
      'Action de Grâce': data[month]['action de grâce'] || 0
    }));
    return formattedData;
  };

  const userData = [
    { name: 'Administrateur', value: stats.totalAdministrateurs, color: '#0088FE' },
    { name: 'Gestionnaire', value: stats.totalGestionnaires, color: '#00C49F' },
    { name: 'Prêtre', value: stats.totalPrêtre, color: '#FF8042' },
  ];

  const MesseData = [
    { name: 'Messe Anniversaire', value: stats.totalmesseanif, color: '#0088FE' },
    { name: 'Messe Décès', value: stats.totalmessedeces, color: '#00C49F' },
    { name: 'Intention Particulière', value: stats.totalintentionpart, color: '#FFBB28' },
    { name: 'Action de Grâce', value: stats.totalactiongrace, color: '#FF8042' }
  ];

  return (
    <div className="p-6 sm:p-10 bg-gray-100 min-h-screen overflow-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">Analyse De Données</h1>
      <hr/>
      <hr />
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Montant Mobile Money" value={`${stats.totalAmountMobile} FCFA`} />
        <StatCard title="Total Montant Total" value={`${stats.totalAmount} FCFA`} />
        <StatCard title="Total Montant Carte Bancaire" value={`${stats.totalAmountCB} FCFA`} />
        <StatCard title="Total Demandes de Messe Traitées" value={stats.totalMesseRequestsTraite} />
        <StatCard title="Total Demandes de Messes" value={stats.totalMesseRequests} />
        <StatCard title="Total Demandes de Messe Non Traitées" value={stats.totalMesseRequestsNTraite} />
        <StatCard title="Utilisateurs Actifs" value={stats.utilisateursActifs} />
        <StatCard title="Total Utilisateurs" value={stats.totalUsers} />
        <StatCard title="Utilisateurs Inactifs" value={stats.utilisateursInActifs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Répartition des Demandes de Messe</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip contentStyle={{ background: "white", borderRadius: "5px" }} />
              <Pie
                data={MesseData}
                innerRadius="70%"
                outerRadius="90%"
                fill="#8884d8"
                dataKey="value"
              >
                {MesseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Répartition des Utilisateurs</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip contentStyle={{ background: "white", borderRadius: "5px" }} />
              <Pie
                data={userData}
                innerRadius="70%"
                outerRadius="90%"
                fill="#8884d8"
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Répartition Mensuelle des Demandes de Messe</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Messe Anniversaire" fill="#0088FE" />
            <Bar dataKey="Messe Décès" fill="#00C49F" />
            <Bar dataKey="Intention Particulière" fill="#FFBB28" />
            <Bar dataKey="Action de Grâce" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-lg rounded-lg p-4 text-center">
    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    <p className="text-2xl font-semibold text-gray-600 mt-2">{value}</p>
  </div>
);

export default Statistique;

