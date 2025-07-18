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
      setArticlesPanier(JSON.parse(panierSauvegarde));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(articlesPanier));
  }, [articlesPanier]);

  const ajouterAuPanier = (produit, quantite = 1) => {
    setArticlesPanier(articlesPrec => {
      const articleExistant = articlesPrec.find(article => article._id === produit._id);
      
      if (articleExistant) {
        return articlesPrec.map(article =>
          article._id === produit._id
            ? { ...article, quantite: article.quantite + quantite }
            : article
        );
      } else {
        return [...articlesPrec, { ...produit, quantite }];
      }
    });
  };

  const retirerDuPanier = (idProduit) => {
    setArticlesPanier(articlesPrec => articlesPrec.filter(article => article._id !== idProduit));
  };

  const mettreAJourQuantite = (idProduit, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(idProduit);
      return;
    }
    
    setArticlesPanier(articlesPrec =>
      articlesPrec.map(article =>
        article._id === idProduit ? { ...article, quantite } : article
      )
    );
  };

  const viderPanier = () => {
    setArticlesPanier([]);
  };

  const obtenirTotalPanier = () => {
    return articlesPanier.reduce((total, article) => total + (article.prix * article.quantite), 0);
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