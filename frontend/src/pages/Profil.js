import React, { useState } from 'react';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Formulaires.css';

const Profil = () => {
  const { utilisateurActuel, deconnexion } = useUtiliserAuth();
  const [modeEdition, setModeEdition] = useState(false);
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    nom: utilisateurActuel?.name || '',
    email: utilisateurActuel?.email || '',
    telephone: utilisateurActuel?.phone || '',
    adresse: utilisateurActuel?.address || ''
  });
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);

  const gererChangement = (e) => {
    setDonneesFormulaire({
      ...donneesFormulaire,
      [e.target.name]: e.target.value
    });
  };

  const gererSauvegarde = async (e) => {
    e.preventDefault();
    setChargement(true);
    setMessage('');

    try {
      // Ici vous pourriez faire un appel API pour mettre à jour le profil
      // await axiosInstance.put('/api/user/profile', donneesFormulaire);
      
      setMessage('Profil mis à jour avec succès !');
      setModeEdition(false);
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
    }

    setChargement(false);
  };

  const annulerEdition = () => {
    setDonneesFormulaire({
      nom: utilisateurActuel?.name || '',
      email: utilisateurActuel?.email || '',
      telephone: utilisateurActuel?.phone || '',
      adresse: utilisateurActuel?.address || ''
    });
    setModeEdition(false);
    setMessage('');
  };

  if (!utilisateurActuel) {
    return (
      <div className="conteneur">
        <div className="message-erreur">
          Vous devez être connecté pour accéder à cette page.
        </div>
      </div>
    );
  }

  return (
    <div className="conteneur">
      <div className="profil-container">
        <div className="profil-header">
          <h1>Mon Profil</h1>
          <div className="profil-actions">
            {!modeEdition ? (
              <button 
                onClick={() => setModeEdition(true)}
                className="btn btn-primaire"
              >
                Modifier le profil
              </button>
            ) : (
              <div className="actions-edition">
                <button 
                  onClick={gererSauvegarde}
                  className="btn btn-primaire"
                  disabled={chargement}
                >
                  {chargement ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button 
                  onClick={annulerEdition}
                  className="btn btn-secondaire"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`alerte ${message.includes('succès') ? 'alerte-succes' : 'alerte-erreur'}`}>
            {message}
          </div>
        )}

        <div className="profil-content">
          <div className="carte-profil">
            <div className="avatar-section">
              <div className="avatar">
                {utilisateurActuel.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2>{utilisateurActuel.name}</h2>
              <p className="role-badge">
                {utilisateurActuel.role === 'admin' ? '👑 Administrateur' : '👤 Client'}
              </p>
            </div>

            <form onSubmit={gererSauvegarde} className="formulaire-profil">
              <div className="groupe-champ">
                <label>Nom complet</label>
                <input
                  type="text"
                  name="nom"
                  value={donneesFormulaire.nom}
                  onChange={gererChangement}
                  className="controle-formulaire"
                  disabled={!modeEdition}
                  required
                />
              </div>

              <div className="groupe-champ">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={donneesFormulaire.email}
                  onChange={gererChangement}
                  className="controle-formulaire"
                  disabled={!modeEdition}
                  required
                />
              </div>

              <div className="groupe-champ">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={donneesFormulaire.telephone}
                  onChange={gererChangement}
                  className="controle-formulaire"
                  disabled={!modeEdition}
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div className="groupe-champ">
                <label>Adresse</label>
                <textarea
                  name="adresse"
                  value={donneesFormulaire.adresse}
                  onChange={gererChangement}
                  className="controle-formulaire"
                  disabled={!modeEdition}
                  rows="3"
                  placeholder="Votre adresse complète"
                />
              </div>
            </form>

            <div className="profil-stats">
              <h3>Statistiques</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-nombre">0</span>
                  <span className="stat-label">Commandes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-nombre">0€</span>
                  <span className="stat-label">Total dépensé</span>
                </div>
                <div className="stat-item">
                  <span className="stat-nombre">
                    {new Date(utilisateurActuel.created_at || Date.now()).getFullYear()}
                  </span>
                  <span className="stat-label">Membre depuis</span>
                </div>
              </div>
            </div>

            <div className="actions-profil">
              <button 
                onClick={deconnexion}
                className="btn btn-danger"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;