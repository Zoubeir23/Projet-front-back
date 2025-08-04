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
      <div className="contenu-navigation">
        <Link to="/" className="marque-navigation">
          E-Commerce
        </Link>
        
        <div className="liens-navigation">
          <Link to="/">Accueil</Link>
          <Link to="/produits">Produits</Link>
          
          {utilisateurActuel ? (
            <>
              <Link to="/profil">Profil</Link>
              <Link to="/mes-commandes">Mes Commandes</Link>
              <Link to="/wishlist">❤️ Favoris</Link>
              {utilisateurActuel.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}
              <Link to="/panier" className="lien-panier">
                Panier ({obtenirNombreArticles()})
              </Link>
              <button onClick={gererDeconnexion} className="btn-deconnexion">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion">Connexion</Link>
              <Link to="/inscription">Inscription</Link>
              <Link to="/panier" className="lien-panier">
                Panier ({obtenirNombreArticles()})
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarreNavigation;