import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import WishlistButton from '../components/WishlistButton';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const { ajouterAuPanier } = useUtiliserPanier();

  useEffect(() => {
    chargerWishlist();
  }, []);

  const chargerWishlist = async () => {
    try {
      const response = await axiosInstance.get('/api/wishlist');
      setProduits(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la wishlist:', error);
    } finally {
      setChargement(false);
    }
  };

  const viderWishlist = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
      try {
        await axiosInstance.delete('/api/wishlist');
        setProduits([]);
        alert('Liste de souhaits vidée avec succès');
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const ajouterTousAuPanier = () => {
    produits.forEach(produit => {
      if (produit.stock > 0) {
        ajouterAuPanier(produit);
      }
    });
    alert(`${produits.filter(p => p.stock > 0).length} produits ajoutés au panier !`);
  };

  const gererAjoutPanier = (produit) => {
    ajouterAuPanier(produit);
    alert(`${produit.nom} ajouté au panier !`);
  };

  if (chargement) {
    return <div className="chargement">Chargement de votre liste de souhaits...</div>;
  }

  return (
    <div className="conteneur">
      <div className="page-wishlist">
        <div className="en-tete-wishlist">
          <h1 className="titre-wishlist">Ma Liste de Souhaits</h1>
          <p className="sous-titre-wishlist">
            {produits.length} produit{produits.length > 1 ? 's' : ''} dans votre liste
          </p>
        </div>

        {produits.length === 0 ? (
          <div className="wishlist-vide">
            <div className="icone-wishlist-vide">💝</div>
            <h3>Votre liste de souhaits est vide</h3>
            <p>Découvrez nos produits et ajoutez vos favoris à votre liste de souhaits</p>
            <Link to="/produits" className="btn btn-primaire">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <>
            <div className="actions-wishlist">
              <button 
                onClick={ajouterTousAuPanier}
                className="btn btn-primaire"
                disabled={produits.filter(p => p.stock > 0).length === 0}
              >
                Tout ajouter au panier
              </button>
              <button 
                onClick={viderWishlist}
                className="btn btn-erreur"
              >
                Vider la liste
              </button>
            </div>

            <div className="grille-wishlist">
              {produits.map(produit => (
                <div key={produit.id} className="carte-produit-wishlist">
                  <div className="conteneur-image-wishlist">
                    <WishlistButton 
                      productId={produit.id} 
                      className="position-absolue"
                    />
                    
                    <Link to={`/produits/${produit.id}`}>
                      {produit.images && produit.images[0] ? (
                        <img 
                          src={produit.images[0]} 
                          alt={produit.nom}
                          className="image-produit-wishlist"
                        />
                      ) : (
                        <div className="placeholder-image-wishlist">
                          <span>Aucune image</span>
                        </div>
                      )}
                    </Link>

                    {produit.en_promotion && (
                      <div className="badge-promo-wishlist">
                        -{Math.round(((produit.prix - produit.prix_promo) / produit.prix) * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="contenu-carte-wishlist">
                    <div className="info-produit-wishlist">
                      <Link to={`/produits/${produit.id}`} className="nom-produit-wishlist">
                        {produit.nom}
                      </Link>
                      
                      {produit.marque && (
                        <div className="marque-produit-wishlist">{produit.marque}</div>
                      )}

                      <div className="prix-section-wishlist">
                        {produit.en_promotion ? (
                          <>
                            <span className="prix-promo-wishlist">{produit.prix_final}€</span>
                            <span className="prix-original-wishlist">{produit.prix}€</span>
                          </>
                        ) : (
                          <span className="prix-normal-wishlist">{produit.prix_final}€</span>
                        )}
                      </div>

                      {produit.note_moyenne > 0 && (
                        <div className="note-produit-wishlist">
                          <div className="etoiles-wishlist">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`etoile ${i < Math.round(produit.note_moyenne) ? 'pleine' : 'vide'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="nombre-avis-wishlist">
                            ({produit.nombre_avis})
                          </span>
                        </div>
                      )}

                      <div className="statut-stock-wishlist">
                        {produit.stock > 0 ? (
                          <span className="en-stock">✓ En stock</span>
                        ) : (
                          <span className="rupture-stock">✗ Rupture de stock</span>
                        )}
                      </div>
                    </div>

                    <div className="actions-produit-wishlist">
                      <button 
                        onClick={() => gererAjoutPanier(produit)}
                        disabled={produit.stock <= 0}
                        className="btn btn-primaire btn-ajouter-panier-wishlist"
                      >
                        {produit.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                      </button>
                      
                      <Link 
                        to={`/produits/${produit.id}`}
                        className="btn btn-secondaire btn-voir-details-wishlist"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;