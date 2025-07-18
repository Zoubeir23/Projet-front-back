import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Commande.css';

const Commande = () => {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    adresseLivraison: '',
    modePaiement: 'avant livraison'
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  
  const { articlesPanier, obtenirTotalPanier, viderPanier } = useUtiliserPanier();
  const { utilisateurActuel } = useUtiliserAuth();
  const navigate = useNavigate();

  const gererChangement = (e) => {
    setDonneesFormulaire({
      ...donneesFormulaire,
      [e.target.name]: e.target.value
    });
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    try {
      const donneesCommande = {
        produits: articlesPanier.map(article => ({
          produit: article._id,
          quantite: article.quantite
        })),
        adresseLivraison: donneesFormulaire.adresseLivraison,
        modePaiement: donneesFormulaire.modePaiement
      };

      const response = await axiosInstance.post('/api/orders', donneesCommande);
      
      viderPanier();
      alert('Commande passée avec succès !');
      navigate('/mes-commandes');
    } catch (error) {
      setErreur(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setChargement(false);
    }
  };

  if (articlesPanier.length === 0) {
    return (
      <div className="conteneur centre-texte" style={{ marginTop: '50px' }}>
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits avant de passer commande.</p>
      </div>
    );
  }

  return (
    <div className="conteneur conteneur-commande">
      <h1>Finaliser la commande</h1>
      
      <div className="grille grille-2">
        <div className="carte">
          <h3>Récapitulatif de la commande</h3>
          <div className="liste-articles-commande">
            {articlesPanier.map(article => (
              <div key={article._id} className="article-recapitulatif">
                <div className="info-article-recap">
                  <strong>{article.nom}</strong>
                  <br />
                  <small>Quantité: {article.quantite}</small>
                </div>
                <div className="prix-article-recap">
                  {(article.prix * article.quantite).toFixed(2)}€
                </div>
              </div>
            ))}
          </div>
          <div className="total-commande">
            <span>Total:</span>
            <span>{obtenirTotalPanier().toFixed(2)}€</span>
          </div>
        </div>

        <div className="carte">
          <h3>Informations de livraison</h3>
          
          {erreur && (
            <div className="alerte alerte-erreur">
              {erreur}
            </div>
          )}

          <form onSubmit={gererSoumission} className="formulaire">
            <div className="groupe-champ">
              <label>Adresse de livraison</label>
              <textarea
                name="adresseLivraison"
                value={donneesFormulaire.adresseLivraison}
                onChange={gererChangement}
                className="controle-formulaire"
                rows="4"
                required
                placeholder="Entrez votre adresse complète de livraison"
              />
            </div>

            <div className="groupe-champ">
              <label>Mode de paiement</label>
              <select
                name="modePaiement"
                value={donneesFormulaire.modePaiement}
                onChange={gererChangement}
                className="controle-formulaire"
                required
              >
                <option value="avant livraison">Paiement avant livraison</option>
                <option value="après livraison">Paiement à la livraison</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primaire btn-pleine-largeur btn-confirmer"
              disabled={chargement}
            >
              {chargement ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Commande;