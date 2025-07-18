import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axios';
import '../styles/Accueil.css';

const Accueil = () => {
  const [produitsVedette, setProduitsVedette] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [resProduits, resCategories] = await Promise.all([
          axiosInstance.get('/api/products?limit=6'),
          axiosInstance.get('/api/categories')
        ]);
        
        setProduitsVedette(resProduits.data.products);
        setCategories(resCategories.data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, []);

  if (chargement) {
    return <div className="chargement">Chargement...</div>;
  }

  return (
    <div className="conteneur">
      <section className="hero">
        <h1>Bienvenue sur notre plateforme E-commerce</h1>
        <p className="sous-titre-hero">
          Découvrez nos produits de qualité avec livraison rapide
        </p>
        <Link to="/produits" className="btn btn-primaire btn-hero">
          Voir tous les produits
        </Link>
      </section>

      <section className="section-categories">
        <h2>Catégories</h2>
        <div className="grille grille-3">
          {categories.map(categorie => (
            <div key={categorie._id} className="carte centre-texte">
              <h3>{categorie.nom}</h3>
              <p>{categorie.description}</p>
              <Link 
                to={`/produits?categorie=${categorie._id}`} 
                className="btn btn-secondaire"
              >
                Voir les produits
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="produits-vedette">
        <h2>Produits en vedette</h2>
        <div className="grille grille-3">
          {produitsVedette.map(produit => (
            <div key={produit._id} className="carte">
              {produit.images && produit.images[0] && (
                <img 
                  src={produit.images[0]} 
                  alt={produit.nom}
                  className="image-produit"
                />
              )}
              <h3>{produit.nom}</h3>
              <p>{produit.description}</p>
              <div className="info-produit">
                <span className="prix-produit">
                  {produit.prix}€
                </span>
                <Link to={`/produits/${produit._id}`} className="btn btn-primaire">
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;