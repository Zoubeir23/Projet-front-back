import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Formulaires.css';

const Inscription = () => {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    nom: '',
    email: '',
    motdepasse: '',
    confirmationMotdepasse: ''
  });
  const [erreur, setErreur] = useState('');
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

    if (donneesFormulaire.motdepasse !== donneesFormulaire.confirmationMotdepasse) {
      setErreur('Les mots de passe ne correspondent pas');
      setChargement(false);
      return;
    }

    const resultat = await inscription({
      name: donneesFormulaire.nom,
      email: donneesFormulaire.email,
      password: donneesFormulaire.motdepasse,
      password_confirmation: donneesFormulaire.confirmationMotdepasse
    });

    if (resultat.succes) {
      navigate('/connexion');
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
              placeholder="Votre nom complet"
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
              placeholder="votre@email.com"
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
              placeholder="Minimum 8 caractères"
            />
          </div>

          <div className="groupe-champ">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmationMotdepasse"
              value={donneesFormulaire.confirmationMotdepasse}
              onChange={gererChangement}
              className="controle-formulaire"
              required
              placeholder="Répétez votre mot de passe"
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