import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Profil.css';

const Profil = () => {
  const [profil, setProfil] = useState({
    nom: '',
    email: '',
    adresse: ''
  });
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [message, setMessage] = useState('');
  
  const { utilisateurActuel } = useUtiliserAuth();

  useEffect(() => {
    chargerProfil();
  }, []);

  const chargerProfil = async () => {
    try {
      const response = await axiosInstance.get('/api/users/profile');
      setProfil({
        nom: response.data.nom,
        email: response.data.email,
        adresse: response.data.adresse || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setChargement(false);
    }
  };

  const gererChangement = (e) => {
    setProfil({
      ...profil,
      [e.target.name]: e.target.value
    });
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setSauvegarde(true);
    setMessage('');

    try {
      await axiosInstance.put('/api/users/profile', {
        nom: profil.nom,
        adresse: profil.adresse
      });
      setMessage('Profil mis à jour avec succès !');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
    } finally {
      setSauvegarde(false);
    }
  };

  if (chargement) {
    return <div className="chargement">Chargement du profil...</div>;
  }

  return (
    <div className="conteneur conteneur-profil">
      <h1>Mon Profil</h1>
      
      <div className="grille grille-2">
        <div className="carte">
          <h3>Informations personnelles</h3>
          
          {message && (
            <div className={`alerte ${message.includes('succès') ? 'alerte-succes' : 'alerte-erreur'}`}>
              {message}
            </div>
          )}

          <form onSubmit={gererSoumission} className="formulaire">
            <div className="groupe-champ">
              <label>Nom complet</label>
              <input
                type="text"
                name="nom"
                value={profil.nom}
                onChange={gererChangement}
                className="controle-formulaire"
                required
              />
            </div>

            <div className="groupe-champ">
              <label>Email</label>
              <input
                type="email"
                value={profil.email}
                className="controle-formulaire"
                disabled
              />
              <small className="texte-aide">L'email ne peut pas être modifié</small>
            </div>

            <div className="groupe-champ">
              <label>Adresse</label>
              <textarea
                name="adresse"
                value={profil.adresse}
                onChange={gererChangement}
                className="controle-formulaire"
                rows="4"
                placeholder="Votre adresse complète"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primaire"
              disabled={sauvegarde}
            >
              {sauvegarde ? 'Enregistrement...' : 'Mettre à jour le profil'}
            </button>
          </form>
        </div>

        <div className="carte">
          <h3>Informations du compte</h3>
          <div className="info-compte">
            <div className="element-info">
              <strong>Rôle:</strong>
              <span className="badge-role">
                {utilisateurActuel?.role}
              </span>
            </div>
            <div className="element-info">
              <strong>Membre depuis:</strong>
              <span>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="element-info">
              <strong>Statut du compte:</strong>
              <span className="statut-actif">Actif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;