import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import '../styles/MesCommandes.css';

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerCommandes();
  }, []);

  const chargerCommandes = async () => {
    try {
      const response = await axiosInstance.get('/api/orders/my-orders');
      setCommandes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setChargement(false);
    }
  };

  const telechargerFacture = async (idCommande) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${idCommande}/invoice`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const lien = document.createElement('a');
      lien.href = url;
      lien.setAttribute('download', `facture-${idCommande}.pdf`);
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
    } catch (error) {
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  const obtenirCouleurStatut = (statut) => {
    switch (statut) {
      case 'livrée':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'expédiée':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      case 'annulée':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  if (chargement) {
    return <div className="chargement">Chargement de vos commandes...</div>;
  }

  return (
    <div className="conteneur">
      <h1>Mes Commandes</h1>
      
      {commandes.length === 0 ? (
        <div className="aucune-commande">
          <p>Vous n'avez pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="liste-commandes">
          {commandes.map(commande => (
            <div key={commande._id} className="carte-commande">
              <div className="en-tete-commande">
                <div className="info-commande">
                  <h3>Commande #{commande._id.slice(-8)}</h3>
                  <p>Date: {new Date(commande.date).toLocaleDateString('fr-FR')}</p>
                  <p>
                    Statut: 
                    <span 
                      className="badge-statut"
                      style={obtenirCouleurStatut(commande.statut)}
                    >
                      {commande.statut}
                    </span>
                  </p>
                </div>
                <div className="info-paiement">
                  <p><strong>Mode de paiement:</strong> {commande.modePaiement}</p>
                  <p><strong>Paiement:</strong> {commande.paiementEffectue ? 'Effectué' : 'En attente'}</p>
                </div>
              </div>
              
              <div className="adresse-livraison">
                <strong>Adresse de livraison:</strong>
                <p>{commande.adresseLivraison}</p>
              </div>
              
              <div className="produits-commandes">
                <strong>Produits commandés:</strong>
                <div className="liste-produits-commande">
                  {commande.produits.map((article, index) => (
                    <div key={index} className="article-commande">
                      <span className="nom-produit-commande">
                        {article.produit.nom} x {article.quantite}
                      </span>
                      <span className="prix-produit-commande">
                        {(article.prix * article.quantite).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pied-commande">
                <strong className="total-commande-affiche">
                  Total: {commande.produits.reduce((total, article) => total + (article.prix * article.quantite), 0).toFixed(2)}€
                </strong>
                <button 
                  onClick={() => telechargerFacture(commande._id)}
                  className="btn btn-secondaire"
                >
                  Télécharger la facture
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesCommandes;