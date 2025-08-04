import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import WishlistButton from '../components/WishlistButton';
import '../styles/Produits.css';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    recherche: '',
    categorie: '',
    prix_min: '',
    prix_max: ''
  });
  const { ajouterAuPanier } = useUtiliserPanier();

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    chargerProduits();
  }, [filtres]);

  const chargerDonnees = async () => {
    try {
      const [produitsRes, categoriesRes] = await Promise.all([
        axiosInstance.get('/api/products'),
        axiosInstance.get('/api/categories')
      ]);
      
      setProduits(produitsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setChargement(false);
    }
  };

  const chargerProduits = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filtres).filter(([_, value]) => value !== '')
      );
      
      const response = await axiosInstance.get('/api/products', { params });
      setProduits(response.data.data);
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
    }
  };

  const gererChangementFiltre = (nom, valeur) => {
    setFiltres(prev => ({ ...prev, [nom]: valeur }));
  };

  const gererAjoutPanier = (produit) => {
    ajouterAuPanier(produit);
    alert(`${produit.nom} ajouté au panier !`);
  };

  if (chargement) {
    return <div className="chargement">Chargement des produits...</div>;
  }

  return (
    <div className="conteneur">
      <div className="page-produits">
        <div className="en-tete-produits">
          <h1 className="titre-page-produits">Nos Produits</h1>
          <p className="sous-titre-produits">
            Découvrez notre sélection de produits de qualité
          </p>
        </div>

        <div className="filtres-produits">
          <div className="barre-recherche">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filtres.recherche}
              onChange={(e) => gererChangementFiltre('recherche', e.target.value)}
              className="champ-recherche"
            />
            
            <select
              value={filtres.categorie}
              onChange={(e) => gererChangementFiltre('categorie', e.target.value)}
              className="selecteur-categorie"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
          </div>

          <div className="filtres-prix">
            <span className="filtre-prix-label">Prix :</span>
            <input
              type="number"
              placeholder="Min"
              value={filtres.prix_min}
              onChange={(e) => gererChangementFiltre('prix_min', e.target.value)}
              className="champ-prix"
            />
            <input
              type="number"
              placeholder="Max"
              value={filtres.prix_max}
              onChange={(e) => gererChangementFiltre('prix_max', e.target.value)}
              className="champ-prix"
            />
          </div>
        </div>

        <div className="resultats-produits">
          <span className="nombre-resultats">
            {produits.length} produit{produits.length > 1 ? 's' : ''} trouvé{produits.length > 1 ? 's' : ''}
          </span>
        </div>

        {produits.length === 0 ? (
          <div className="aucun-produit">
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grille-produits">
            {produits.map(produit => (
              <div key={produit.id} className="carte-produit">
                <div className="conteneur-image-produit">
                  <WishlistButton 
                    productId={produit.id} 
                    className="position-absolue"
                  />
                  
                  <Link to={`/produits/${produit.id}`}>
                    {produit.images && produit.images[0] ? (
                      <img 
                        src={produit.images[0]} 
                        alt={produit.nom}
                        className="image-produit"
                      />
                    ) : (
                      <div className="placeholder-image">
                        <span>Aucune image</span>
                      </div>
                    )}
                  </Link>

                  {produit.en_promotion && (
                    <div className="badge-promo">
                      -{Math.round(((produit.prix - produit.prix_promo) / produit.prix) * 100)}%
                    </div>
                  )}
                </div>

                <div className="contenu-carte-produit">
                  <div className="categorie-produit">{produit.categorie?.nom}</div>
                  
                  <Link to={`/produits/${produit.id}`} className="nom-produit">
                    {produit.nom}
                  </Link>
                  
                  {produit.marque && (
                    <div className="marque-produit">{produit.marque}</div>
                  )}

                  <p className="description-produit">{produit.description}</p>
                  
                  {produit.note_moyenne > 0 && (
                    <div className="note-produit">
                      <div className="etoiles">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`etoile ${i < Math.round(produit.note_moyenne) ? 'pleine' : 'vide'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="nombre-avis">({produit.nombre_avis})</span>
                    </div>
                  )}

                  <div className="info-produit">
                    <div className="prix-section">
                      {produit.en_promotion ? (
                        <>
                          <span className="prix-promo">{produit.prix_final}€</span>
                          <span className="prix-original">{produit.prix}€</span>
                        </>
                      ) : (
                        <span className="prix-produit">{produit.prix_final}€</span>
                      )}
                    </div>

                    <div className="stock-produit">
                      {produit.stock > 0 ? (
                        <span className="en-stock">✓ En stock ({produit.stock})</span>
                      ) : (
                        <span className="stock-epuise">✗ Rupture de stock</span>
                      )}
                    </div>

                    <button 
                      onClick={() => gererAjoutPanier(produit)}
                      className="btn-ajouter-panier"
                      disabled={produit.stock <= 0}
                    >
                      {produit.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Produits;