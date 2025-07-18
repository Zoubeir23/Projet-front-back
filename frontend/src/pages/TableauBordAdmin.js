import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import '../styles/TableauBordAdmin.css';

const TableauBordAdmin = () => {
  const [ongletActif, setOngletActif] = useState('commandes');
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (ongletActif === 'commandes') chargerCommandes();
    else if (ongletActif === 'produits') chargerProduits();
    else if (ongletActif === 'categories') chargerCategories();
    else if (ongletActif === 'utilisateurs') chargerUtilisateurs();
  }, [ongletActif]);

  const chargerCommandes = async () => {
    setChargement(true);
    try {
      const response = await axiosInstance.get('/api/orders');
      setCommandes(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const chargerProduits = async () => {
    setChargement(true);
    try {
      const response = await axiosInstance.get('/api/products');
      setProduits(response.data.products);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const chargerCategories = async () => {
    setChargement(true);
    try {
      const response = await axiosInstance.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const chargerUtilisateurs = async () => {
    setChargement(true);
    try {
      const response = await axiosInstance.get('/api/users');
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const mettreAJourStatutCommande = async (idCommande, nouveauStatut) => {
    try {
      await axiosInstance.put(`/api/orders/${idCommande}/status`, { statut: nouveauStatut });
      chargerCommandes();
      alert('Statut mis à jour avec succès');
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const marquerPaiementRecu = async (idCommande) => {
    try {
      await axiosInstance.put(`/api/orders/${idCommande}/payment`);
      chargerCommandes();
      alert('Paiement marqué comme reçu');
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const obtenirCouleurStatut = (statut) => {
    switch (statut) {
      case 'livrée':
        return '#28a745';
      case 'expédiée':
        return '#ffc107';
      case 'annulée':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const onglets = [
    { cle: 'commandes', libelle: 'Commandes' },
    { cle: 'produits', libelle: 'Produits' },
    { cle: 'categories', libelle: 'Catégories' },
    { cle: 'utilisateurs', libelle: 'Utilisateurs' }
  ];

  return (
    <div className="conteneur">
      <h1>Administration</h1>
      
      <div className="conteneur-onglets">
        <div className="liste-onglets">
          {onglets.map(onglet => (
            <button
              key={onglet.cle}
              onClick={() => setOngletActif(onglet.cle)}
              className={`onglet ${ongletActif === onglet.cle ? 'onglet-actif' : ''}`}
            >
              {onglet.libelle}
            </button>
          ))}
        </div>
      </div>

      {chargement && <div className="chargement">Chargement...</div>}

      {/* Gestion des commandes */}
      {ongletActif === 'commandes' && !chargement && (
        <div className="contenu-onglet">
          <h2>Gestion des Commandes</h2>
          <div className="liste-commandes-admin">
            {commandes.map(commande => (
              <div key={commande._id} className="carte-commande-admin">
                <div className="en-tete-commande-admin">
                  <div className="info-commande-admin">
                    <h4>Commande #{commande._id.slice(-8)}</h4>
                    <p>Client: {commande.client.nom} ({commande.client.email})</p>
                    <p>Date: {new Date(commande.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="info-montant">
                    <p className="montant-commande">
                      Total: {commande.produits.reduce((total, article) => total + (article.prix * article.quantite), 0).toFixed(2)}€
                    </p>
                    <p className="statut-paiement">
                      Paiement: {commande.paiementEffectue ? 'Reçu' : 'En attente'}
                    </p>
                  </div>
                </div>
                
                <div className="actions-commande">
                  <select
                    value={commande.statut}
                    onChange={(e) => mettreAJourStatutCommande(commande._id, e.target.value)}
                    className="selecteur-statut"
                    style={{ borderColor: obtenirCouleurStatut(commande.statut) }}
                  >
                    <option value="en attente">En attente</option>
                    <option value="expédiée">Expédiée</option>
                    <option value="livrée">Livrée</option>
                    <option value="annulée">Annulée</option>
                  </select>
                  
                  {!commande.paiementEffectue && (
                    <button
                      onClick={() => marquerPaiementRecu(commande._id)}
                      className="btn btn-succes btn-paiement"
                    >
                      Marquer comme payé
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gestion des produits */}
      {ongletActif === 'produits' && !chargement && (
        <div className="contenu-onglet">
          <h2>Gestion des Produits</h2>
          <div className="grille grille-3">
            {produits.map(produit => (
              <div key={produit._id} className="carte-produit-admin">
                <h4>{produit.nom}</h4>
                <p className="prix-produit-admin">Prix: {produit.prix}€</p>
                <p className="stock-produit-admin">Stock: {produit.stock}</p>
                <p className="categorie-produit-admin">Catégorie: {produit.categorie?.nom}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gestion des catégories */}
      {ongletActif === 'categories' && !chargement && (
        <div className="contenu-onglet">
          <h2>Gestion des Catégories</h2>
          <div className="grille grille-2">
            {categories.map(categorie => (
              <div key={categorie._id} className="carte-categorie-admin">
                <h4>{categorie.nom}</h4>
                <p>{categorie.description}</p>
                <p className="nombre-produits">Produits: {categorie.produits?.length || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gestion des utilisateurs */}
      {ongletActif === 'utilisateurs' && !chargement && (
        <div className="contenu-onglet">
          <h2>Gestion des Utilisateurs</h2>
          <div className="tableau-utilisateurs">
            <table className="tableau-admin">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Commandes</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map(utilisateur => (
                  <tr key={utilisateur._id}>
                    <td>{utilisateur.nom}</td>
                    <td>{utilisateur.email}</td>
                    <td>
                      <span className={`badge-role-admin ${utilisateur.role}`}>
                        {utilisateur.role}
                      </span>
                    </td>
                    <td>{utilisateur.commandes?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableauBordAdmin;