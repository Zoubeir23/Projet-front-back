import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Formulaires.css';

const Connexion = () => {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    email: '',
    motdepasse: ''
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const { connexion } = useUtiliserAuth();
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

    const resultat = await connexion(donneesFormulaire.email, donneesFormulaire.motdepasse);

    if (resultat.succes) {
      navigate('/');
    } else {
      setErreur(resultat.erreur);
    }

    setChargement(false);
  };

  return (
    <div className="conteneur-formulaire">
      <div className="carte-formulaire">
        <h2 className="titre-formulaire">Connexion</h2>

        {erreur && (
          <div className="alerte alerte-erreur">
            {erreur}
          </div>
        )}

        <form onSubmit={gererSoumission} className="formulaire">
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

          <button
            type="submit"
            className="btn btn-primaire btn-pleine-largeur"
            disabled={chargement}
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="lien-formulaire">
          <p>
            Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connexion;