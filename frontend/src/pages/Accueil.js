import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import WishlistButton from '../components/WishlistButton';
import '../styles/Accueil.css';

const Accueil = () => {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const { ajouterAuPanier } = useUtiliserPanier();

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    try {
      const response = await axiosInstance.get('/api/products', { params: { per_page: 8 } });
      setProduits(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setChargement(false);
    }
  };

  const gererAjoutPanier = (produit) => {
    ajouterAuPanier(produit);
    // Remplacer l'alert par une notification plus moderne si disponible
    if (window.showNotification) {
      window.showNotification(`${produit.nom} ajouté au panier !`, 'success');
    } else {
      alert(`${produit.nom} ajouté au panier !`);
    }
  };

  if (chargement) {
    return (
      <div className="chargement">
        <div className="spinner"></div>
        Chargement des produits...
      </div>
    );
  }

  return (
    <div className="conteneur">
      {/* Section Hero */}
      <section className="hero">
        <div className="hero-contenu">
          <div className="hero-badge">
            ✨ Nouveau • Livraison gratuite dès 50€
          </div>
          <h1>Découvrez l'Excellence</h1>
          <p className="sous-titre-hero">
            Une sélection premium de produits soigneusement choisis pour vous offrir 
            la meilleure expérience shopping en ligne
          </p>
          <div className="hero-actions">
            <Link to="/produits" className="btn btn-primaire btn-hero">
              <span>🛍️</span>
              Explorer la boutique
            </Link>
            <Link to="/wishlist" className="btn btn-secondaire btn-hero">
              <span>❤️</span>
              Ma Wishlist
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="avantages">
        <div className="avantage-item">
          <div className="avantage-icone">🚚</div>
          <h3>Livraison Rapide</h3>
          <p>Livraison en 24h partout en France</p>
        </div>
        <div className="avantage-item">
          <div className="avantage-icone">🔒</div>
          <h3>Paiement Sécurisé</h3>
          <p>Vos données sont protégées</p>
        </div>
        <div className="avantage-item">
          <div className="avantage-icone">↩️</div>
          <h3>Retour Gratuit</h3>
          <p>30 jours pour changer d'avis</p>
        </div>
        <div className="avantage-item">
          <div className="avantage-icone">🎧</div>
          <h3>Support 24/7</h3>
          <p>Une équipe à votre écoute</p>
        </div>
      </section>

      {/* Produits vedette */}
      <section className="produits-vedette">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">💎</span>
            <span>Sélection Premium</span>
          </div>
          <h2>
            <span className="titre-principal">Nos Coups de</span>
            <span className="titre-accent">Cœur</span>
          </h2>
          <p className="section-description">
            Découvrez notre sélection exclusive de produits exceptionnels, 
            choisis avec passion par notre équipe d'experts
          </p>
          <div className="section-stats">
            <div className="stat-mini">
              <span className="stat-mini-nombre">{produits.length}</span>
              <span className="stat-mini-label">Produits sélectionnés</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-nombre">4.9★</span>
              <span className="stat-mini-label">Note moyenne</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-nombre">98%</span>
              <span className="stat-mini-label">Clients satisfaits</span>
            </div>
          </div>
        </div>

        <div className="grille-produits-premium">
          {produits.map((produit, index) => (
            <div 
              key={produit.id} 
              className={`carte-produit-premium ${index === 0 ? 'featured' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              {/* Badge de qualité */}
              <div className="badge-qualite">
                <span className="badge-qualite-icon">⭐</span>
                <span>Premium</span>
              </div>

              {/* Conteneur image avec overlay */}
              <div className="conteneur-image-premium">
                <div className="image-overlay"></div>
                
                <WishlistButton 
                  productId={produit.id} 
                  className="position-absolue petit wishlist-premium"
                />
                
                <Link to={`/produits/${produit.id}`} className="lien-image">
                  {produit.images && produit.images[0] ? (
                    <img 
                      src={produit.images[0]} 
                      alt={produit.nom}
                      className="image-produit-premium"
                      loading="lazy"
                    />
                  ) : (
                    <div className="placeholder-image-premium">
                      <div className="placeholder-icon">📦</div>
                      <span>Image à venir</span>
                    </div>
                  )}
                </Link>

                {/* Badge promotion amélioré */}
                {produit.en_promotion && (
                  <div className="badge-promo-premium">
                    <div className="badge-promo-content">
                      <span className="promo-pourcentage">
                        -{Math.round(((produit.prix - produit.prix_promo) / produit.prix) * 100)}%
                      </span>
                      <span className="promo-label">PROMO</span>
                    </div>
                  </div>
                )}

                {/* Indicateur de stock */}
                <div className={`stock-indicator ${produit.stock > 10 ? 'en-stock' : produit.stock > 0 ? 'stock-limite' : 'rupture'}`}>
                  <div className="stock-dot"></div>
                  <span className="stock-text">
                    {produit.stock > 10 ? 'En stock' : 
                     produit.stock > 0 ? `${produit.stock} restants` : 'Rupture'}
                  </span>
                </div>

                {/* Actions rapides au survol */}
                <div className="actions-rapides">
                  <Link to={`/produits/${produit.id}`} className="action-voir">
                    <span>👁️</span>
                    <span>Voir détails</span>
                  </Link>
                  <button 
                    onClick={() => gererAjoutPanier(produit)}
                    className="action-panier"
                    disabled={produit.stock <= 0}
                  >
                    <span>🛒</span>
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
              
              {/* Contenu de la carte */}
              <div className="contenu-carte-premium">
                {/* En-tête avec marque */}
                <div className="carte-header">
                  {produit.marque && (
                    <div className="marque-premium">{produit.marque}</div>
                  )}
                  <div className="categorie-badge">Tendance</div>
                </div>

                {/* Titre du produit */}
                <Link to={`/produits/${produit.id}`} className="nom-produit-premium">
                  {produit.nom}
                </Link>

                {/* Description enrichie */}
                <p className="description-premium">
                  {produit.description || "Un produit d'exception qui saura vous séduire par sa qualité et son design unique."}
                </p>
                
                {/* Système d'évaluation amélioré */}
                {produit.note_moyenne > 0 && (
                  <div className="evaluation-premium">
                    <div className="etoiles-premium">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`etoile-premium ${i < Math.round(produit.note_moyenne) ? 'pleine' : 'vide'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="note-details">
                      <span className="note-moyenne">{produit.note_moyenne.toFixed(1)}</span>
                      <span className="nombre-avis-premium">({produit.nombre_avis} avis)</span>
                    </div>
                  </div>
                )}

                {/* Caractéristiques du produit */}
                <div className="caracteristiques">
                  <div className="caracteristique">
                    <span className="carac-icon">🚚</span>
                    <span>Livraison gratuite</span>
                  </div>
                  <div className="caracteristique">
                    <span className="carac-icon">🔒</span>
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="caracteristique">
                    <span className="carac-icon">↩️</span>
                    <span>Retour 30j</span>
                  </div>
                </div>
                
                {/* Section prix et achat */}
                <div className="section-achat-premium">
                  <div className="prix-premium">
                    {produit.en_promotion ? (
                      <div className="prix-promo-container">
                        <span className="prix-actuel">{produit.prix_final}€</span>
                        <span className="prix-barre">{produit.prix}€</span>
                        <span className="economie">
                          Économisez {(produit.prix - produit.prix_final).toFixed(2)}€
                        </span>
                      </div>
                    ) : (
                      <span className="prix-normal">{produit.prix_final}€</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => gererAjoutPanier(produit)}
                    className={`btn-achat-premium ${
                      produit.stock <= 0 ? 'disabled' : 
                      produit.stock <= 5 ? 'stock-limite' : ''
                    }`}
                    disabled={produit.stock <= 0}
                  >
                    <span className="btn-icon">
                      {produit.stock > 0 ? '🛒' : '❌'}
                    </span>
                    <span className="btn-text">
                      {produit.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                    </span>
                    <div className="btn-shine"></div>
                  </button>
                </div>
              </div>

              {/* Effet de brillance sur toute la carte */}
              <div className="carte-shine"></div>
            </div>
          ))}
        </div>

        {/* Bouton voir plus */}
        <div className="section-footer">
          <Link to="/produits" className="btn-voir-plus">
            <span>Découvrir tous nos produits</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Section statistiques */}
      <section className="stats-accueil">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icone">📦</div>
            <span className="stat-nombre">1000+</span>
            <span className="stat-label">Produits disponibles</span>
          </div>
          <div className="stat-item">
            <div className="stat-icone">😊</div>
            <span className="stat-nombre">5000+</span>
            <span className="stat-label">Clients satisfaits</span>
          </div>
          <div className="stat-item">
            <div className="stat-icone">⚡</div>
            <span className="stat-nombre">24h</span>
            <span className="stat-label">Livraison express</span>
          </div>
          <div className="stat-item">
            <div className="stat-icone">⭐</div>
            <span className="stat-nombre">4.8/5</span>
            <span className="stat-label">Note moyenne</span>
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="cta-finale">
        <div className="cta-contenu">
          <h2>Prêt à découvrir nos produits ?</h2>
          <p>Rejoignez des milliers de clients satisfaits et trouvez votre bonheur parmi notre sélection</p>
          <Link to="/produits" className="btn btn-primaire btn-large">
            <span>🚀</span>
            Commencer mes achats
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Accueil;