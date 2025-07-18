import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Formulaires.css';

const Inscription = () => {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    nom: '',
    email: '',
    motdepasse: '',
    confirmerMotDePasse: '',
    adresse: ''
  });
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [chargement, setChargement] = useState(false);
  
  const { inscription } = useUtiliserAuth();
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
    setSucces('');

    if (donneesFormulaire.motdepasse !== donneesFormulaire.confirmerMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas');
      setChargement(false);
      return;
    }

    const { confirmerMotDePasse, ...donneesUtilisateur } = donneesFormulaire;
    const resultat = await inscription(donneesUtilisateur);
    
    if (resultat.succes) {
      setSucces('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/connexion'), 2000);
    } else {
      setErreur(resultat.erreur);
    }
    
    setChargement(false);
  };

  return (
    <div className="conteneur-formulaire">
      <div className="carte-formulaire">
        <h2 className="titre-formulaire">Inscription</h2>
        
        {erreur && (
          <div className="alerte alerte-erreur">
            {erreur}
          </div>
        )}

        {succes && (
          <div className="alerte alerte-succes">
            {succes}
          </div>
        )}

        <form onSubmit={gererSoumission} className="formulaire">
          <div className="groupe-champ">
            <label>Nom complet</label>
            <input
              type="text"
              name="nom"
              value={donneesFormulaire.nom}
              onChange={gererChangement}
              className="controle-formulaire"
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
              required
            />
          </div>

          <div className="groupe-champ">
            <label>Mot de passe</label>
            <input
              type="password"
              name="motdepasse"
              value={donneesFormulaire.motdepasse}
              onChange={gererChangement}
              className="controle-formulaire"
              required
            />
          </div>

          <div className="groupe-champ">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmerMotDePasse"
              value={donneesFormulaire.confirmerMotDePasse}
              onChange={gererChangement}
              className="controle-formulaire"
              required
            />
          </div>

          <div className="groupe-champ">
            <label>Adresse</label>
            <textarea
              name="adresse"
              value={donneesFormulaire.adresse}
              onChange={gererChangement}
              className="controle-formulaire"
              rows="3"
              placeholder="Votre adresse complète"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primaire btn-pleine-largeur"
            disabled={chargement}
          >
            {chargement ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="lien-formulaire">
          <p>
            Déjà un compte ? <Link to="/connexion">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;