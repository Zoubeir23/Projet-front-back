import React from 'react';
import { Link } from 'react-router-dom';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Panier.css';

const Panier = () => {
  const { 
    articlesPanier, 
    mettreAJourQuantite, 
    retirerDuPanier, 
    viderPanier, 
    obtenirTotalPanier,
    obtenirNombreArticles 
  } = useUtiliserPanier();
  const { utilisateurActuel } = useUtiliserAuth();

  const gererChangementQuantite = (idProduit, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) {
      retirerDuPanier(idProduit);
    } else {
      mettreAJourQuantite(idProduit, parseInt(nouvelleQuantite));
    }
  };

  if (articlesPanier.length === 0) {
    return (
      <div className="conteneur">
        <div className="panier-vide">
          <div className="icone-panier-vide">🛒</div>
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à votre panier</p>
          <Link to="/produits" className="btn btn-primaire">
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="conteneur">
      <div className="panier-contenu">
        <div className="panier-header">
          <h1>Mon Panier ({obtenirNombreArticles()} articles)</h1>
          <button 
            onClick={viderPanier}
            className="btn btn-secondaire"
          >
            Vider le panier
          </button>
        </div>

        <div className="panier-layout">
          <div className="articles-panier">
            {articlesPanier.map(article => (
              <div key={article._id || article.id} className="article-panier">
                <div className="article-image">
                  {article.images && article.images[0] ? (
                    <img src={article.images[0]} alt={article.nom} />
                  ) : (
                    <div className="placeholder-image">
                      <span>Aucune image</span>
                    </div>
                  )}
                </div>

                <div className="article-details">
                  <h3>{article.nom}</h3>
                  {article.marque && <p className="marque">{article.marque}</p>}
                  <p className="prix-unitaire">{article.prix}€ / unité</p>
                </div>

                <div className="article-quantite">
                  <label>Quantité:</label>
                  <div className="controle-quantite">
                    <button 
                      onClick={() => gererChangementQuantite(article._id || article.id, article.quantite - 1)}
                      className="btn-quantite"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={article.quantite}
                      onChange={(e) => gererChangementQuantite(article._id || article.id, e.target.value)}
                      min="1"
                      className="input-quantite"
                    />
                    <button 
                      onClick={() => gererChangementQuantite(article._id || article.id, article.quantite + 1)}
                      className="btn-quantite"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="article-total">
                  <p className="prix-total">{(article.prix * article.quantite).toFixed(2)}€</p>
                  <button 
                    onClick={() => retirerDuPanier(article._id || article.id)}
                    className="btn-supprimer"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="resume-panier">
            <div className="carte-resume">
              <h3>Résumé de la commande</h3>
              
              <div className="ligne-resume">
                <span>Sous-total ({obtenirNombreArticles()} articles)</span>
                <span>{obtenirTotalPanier().toFixed(2)}€</span>
              </div>
              
              <div className="ligne-resume">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              
              <hr />
              
              <div className="ligne-resume total">
                <span>Total</span>
                <span>{obtenirTotalPanier().toFixed(2)}€</span>
              </div>

              {utilisateurActuel ? (
                <Link to="/commande" className="btn btn-primaire btn-pleine-largeur">
                  Passer la commande
                </Link>
              ) : (
                <div>
                  <p className="message-connexion">
                    Connectez-vous pour passer votre commande
                  </p>
                  <Link to="/connexion" className="btn btn-primaire btn-pleine-largeur">
                    Se connecter
                  </Link>
                </div>
              )}
              
              <Link to="/produits" className="btn btn-secondaire btn-pleine-largeur">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panier;