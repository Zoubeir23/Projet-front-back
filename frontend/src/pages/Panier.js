import React from 'react';
import { Link } from 'react-router-dom';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import '../styles/Panier.css';

const Panier = () => {
  const { articlesPanier, mettreAJourQuantite, retirerDuPanier, obtenirTotalPanier } = useUtiliserPanier();

  if (articlesPanier.length === 0) {
    return (
      <div className="conteneur panier-vide">
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits et ajoutez-les à votre panier.</p>
        <Link to="/produits" className="btn btn-primaire">
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="conteneur">
      <h1>Mon Panier</h1>
      
      <div className="carte-panier">
        {articlesPanier.map(article => (
          <div key={article._id} className="article-panier">
            {article.images && article.images[0] && (
              <img 
                src={article.images[0]} 
                alt={article.nom}
                className="image-article-panier"
              />
            )}
            
            <div className="info-article">
              <h4>{article.nom}</h4>
              <p className="description-article">{article.description}</p>
              <p className="prix-unitaire">
                {article.prix}€
              </p>
            </div>
            
            <div className="controles-quantite">
              <button 
                onClick={() => mettreAJourQuantite(article._id, article.quantite - 1)}
                className="btn btn-quantite"
              >
                -
              </button>
              
              <span className="quantite-affichage">
                {article.quantite}
              </span>
              
              <button 
                onClick={() => mettreAJourQuantite(article._id, article.quantite + 1)}
                className="btn btn-quantite"
              >
                +
              </button>
              
              <button 
                onClick={() => retirerDuPanier(article._id)}
                className="btn btn-danger btn-supprimer"
              >
                Supprimer
              </button>
            </div>
            
            <div className="prix-total-article">
              {(article.prix * article.quantite).toFixed(2)}€
            </div>
          </div>
        ))}
        
        <div className="resume-panier">
          <h3>Total: {obtenirTotalPanier().toFixed(2)}€</h3>
          <Link to="/commande" className="btn btn-primaire btn-commander">
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Panier;