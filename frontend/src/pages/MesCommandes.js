import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Commandes.css';

const MesCommandes = () => {
  const { utilisateurActuel } = useUtiliserAuth();
  const location = useLocation();
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Effacer le message après 5 secondes
      setTimeout(() => setMessage(''), 5000);
    }
    chargerCommandes();
  }, [location.state]);

  const chargerCommandes = async () => {
    try {
      // Ici vous feriez l'appel API pour récupérer les commandes
      // const response = await axiosInstance.get('/api/user/orders');
      // setCommandes(response.data);

      // Simulation de données de commandes
      const commandesSimulees = [
        {
          id: location.state?.numeroCommande || 'CMD-001',
          date: new Date().toISOString(),
          statut: 'en_cours',
          total: 89.99,
          articles: [
            { nom: 'Smartphone XYZ', quantite: 1, prix: 599.99 },
            { nom: 'Écouteurs Bluetooth', quantite: 2, prix: 45.00 }
          ]
        },
        {
          id: 'CMD-002',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'livree',
          total: 156.50,
          articles: [
            { nom: 'Clavier mécanique', quantite: 1, prix: 89.99 },
            { nom: 'Souris gaming', quantite: 1, prix: 66.51 }
          ]
        }
      ];

      setCommandes(commandesSimulees);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setChargement(false);
    }
  };

  const obtenirStatutBadge = (statut) => {
    const statuts = {
      'en_attente': { classe: 'statut-attente', texte: '⏳ En attente', couleur: '#f39c12' },
      'confirmee': { classe: 'statut-confirmee', texte: '✅ Confirmée', couleur: '#27ae60' },
      'en_cours': { classe: 'statut-cours', texte: '📦 En préparation', couleur: '#3498db' },
      'expediee': { classe: 'statut-expediee', texte: '🚚 Expédiée', couleur: '#9b59b6' },
      'livree': { classe: 'statut-livree', texte: '🎉 Livrée', couleur: '#2ecc71' },
      'annulee': { classe: 'statut-annulee', texte: '❌ Annulée', couleur: '#e74c3c' }
    };

    const statutInfo = statuts[statut] || statuts['en_attente'];
    
    return (
      <span 
        className={`badge-statut ${statutInfo.classe}`}
        style={{ backgroundColor: statutInfo.couleur }}
      >
        {statutInfo.texte}
      </span>
    );
  };

  const formaterDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!utilisateurActuel) {
    return (
      <div className="conteneur">
        <div className="message-erreur">
          Vous devez être connecté pour voir vos commandes.
        </div>
      </div>
    );
  }

  if (chargement) {
    return (
      <div className="conteneur">
        <div className="chargement">Chargement de vos commandes...</div>
      </div>
    );
  }

  return (
    <div className="conteneur">
      <div className="commandes-container">
        <div className="commandes-header">
          <h1>Mes Commandes</h1>
          <p>Suivez l'état de vos commandes et consultez votre historique d'achats</p>
        </div>

        {message && (
          <div className="alerte alerte-succes">
            {message}
          </div>
        )}

        {commandes.length === 0 ? (
          <div className="aucune-commande">
            <div className="icone-commande">📦</div>
            <h2>Aucune commande trouvée</h2>
            <p>Vous n'avez pas encore passé de commande.</p>
            <button 
              onClick={() => window.location.href = '/produits'}
              className="btn btn-primaire"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="liste-commandes">
            {commandes.map(commande => (
              <div key={commande.id} className="carte-commande">
                <div className="commande-header">
                  <div className="commande-info">
                    <h3>Commande #{commande.id}</h3>
                    <p className="date-commande">
                      Passée le {formaterDate(commande.date)}
                    </p>
                  </div>
                  <div className="commande-statut">
                    {obtenirStatutBadge(commande.statut)}
                  </div>
                </div>

                <div className="commande-articles">
                  <h4>Articles commandés :</h4>
                  <div className="articles-liste">
                    {commande.articles.map((article, index) => (
                      <div key={index} className="article-commande">
                        <div className="article-details">
                          <span className="nom-article">{article.nom}</span>
                          <span className="quantite-article">Quantité: {article.quantite}</span>
                        </div>
                        <span className="prix-article">
                          {(article.prix * article.quantite).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="commande-footer">
                  <div className="commande-total">
                    <strong>Total: {commande.total.toFixed(2)}€</strong>
                  </div>
                  <div className="commande-actions">
                    <button className="btn btn-secondaire btn-petit">
                      Voir détails
                    </button>
                    {commande.statut === 'livree' && (
                      <button className="btn btn-primaire btn-petit">
                        Laisser un avis
                      </button>
                    )}
                    {['en_attente', 'confirmee'].includes(commande.statut) && (
                      <button className="btn btn-danger btn-petit">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="commandes-stats">
          <div className="stat-commandes">
            <h3>Vos statistiques</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-nombre">{commandes.length}</span>
                <span className="stat-label">Commandes</span>
              </div>
              <div className="stat-item">
                <span className="stat-nombre">
                  {commandes.reduce((total, cmd) => total + cmd.total, 0).toFixed(2)}€
                </span>
                <span className="stat-label">Total dépensé</span>
              </div>
              <div className="stat-item">
                <span className="stat-nombre">
                  {commandes.filter(cmd => cmd.statut === 'livree').length}
                </span>
                <span className="stat-label">Livrées</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesCommandes;