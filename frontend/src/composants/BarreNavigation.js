import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import '../styles/BarreNavigation.css';

const BarreNavigation = () => {
  const { utilisateurActuel, deconnexion } = useUtiliserAuth();
  const { obtenirNombreArticles } = useUtiliserPanier();
  const navigate = useNavigate();

  const gererDeconnexion = () => {
    deconnexion();
    navigate('/');
  };

  return (
    <nav className="barre-navigation">
      <div className="conteneur">
        <div className="contenu-navigation">
          <Link to="/" className="marque-navigation">
            E-Commerce
          </Link>
          
          <div className="liens-navigation">
            <Link to="/produits">Produits</Link>
            
            {utilisateurActuel ? (
              <>
                <Link to="/panier" className="lien-panier">
                  Panier ({obtenirNombreArticles()})
                </Link>
                <Link to="/mes-commandes">Mes Commandes</Link>
                <Link to="/profil">Profil</Link>
                {utilisateurActuel.role === 'admin' && (
                  <Link to="/admin">Administration</Link>
                )}
                <button onClick={gererDeconnexion} className="btn btn-secondaire">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/panier" className="lien-panier">
                  Panier ({obtenirNombreArticles()})
                </Link>
                <Link to="/connexion">Connexion</Link>
                <Link to="/inscription">Inscription</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BarreNavigation;