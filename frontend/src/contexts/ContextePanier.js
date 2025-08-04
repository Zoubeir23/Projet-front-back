import React, { createContext, useContext, useState, useEffect } from 'react';

const ContextePanier = createContext();

export const useUtiliserPanier = () => {
  return useContext(ContextePanier);
};

export const FournisseurPanier = ({ children }) => {
  const [articlesPanier, setArticlesPanier] = useState([]);

  useEffect(() => {
    const panierSauvegarde = localStorage.getItem('panier');
    if (panierSauvegarde) {
      try {
        setArticlesPanier(JSON.parse(panierSauvegarde));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('panier');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(articlesPanier));
  }, [articlesPanier]);

  const ajouterAuPanier = (produit, quantite = 1) => {
    setArticlesPanier(articlesPrec => {
      const articleExistant = articlesPrec.find(article => article.id === produit.id);
      
      if (articleExistant) {
        return articlesPrec.map(article =>
          article.id === produit.id
            ? { ...article, quantite: article.quantite + quantite }
            : article
        );
      } else {
        return [...articlesPrec, { ...produit, quantite }];
      }
    });
  };

  const retirerDuPanier = (idProduit) => {
    setArticlesPanier(articlesPrec => 
      articlesPrec.filter(article => article.id !== idProduit)
    );
  };

  const mettreAJourQuantite = (idProduit, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(idProduit);
      return;
    }
    
    setArticlesPanier(articlesPrec =>
      articlesPrec.map(article =>
        article.id === idProduit ? { ...article, quantite } : article
      )
    );
  };

  const viderPanier = () => {
    setArticlesPanier([]);
  };

  const obtenirTotalPanier = () => {
    return articlesPanier.reduce((total, article) => 
      total + (article.prix_final * article.quantite), 0
    );
  };

  const obtenirNombreArticles = () => {
    return articlesPanier.reduce((total, article) => total + article.quantite, 0);
  };

  const valeur = {
    articlesPanier,
    ajouterAuPanier,
    retirerDuPanier,
    mettreAJourQuantite,
    viderPanier,
    obtenirTotalPanier,
    obtenirNombreArticles
  };

  return (
    <ContextePanier.Provider value={valeur}>
      {children}
    </ContextePanier.Provider>
  );
};