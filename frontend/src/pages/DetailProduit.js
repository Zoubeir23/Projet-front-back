import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import WishlistButton from '../components/WishlistButton';
import ReviewsSection from '../components/ReviewsSection';
import '../styles/DetailProduit.css';

const DetailProduit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [imageActive, setImageActive] = useState(0);
  
  const { ajouterAuPanier } = useUtiliserPanier();

  useEffect(() => {
    chargerProduit();
  }, [id]);

  const chargerProduit = async () => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`);
      setProduit(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      setErreur('Produit non trouvé');
    } finally {
      setChargement(false);
    }
  };

  const gererAjoutPanier = () => {
    if (produit) {
      ajouterAuPanier(produit, quantite);
      // Afficher une notification ou rediriger vers le panier
      const confirmation = window.confirm(
        `${produit.nom} ajouté au panier ! Voulez-vous voir votre panier ?`
      );
      if (confirmation) {
        navigate('/panier');
      }
    }
  };

  const changerQuantite = (nouvelleQuantite) => {
    if (nouvelleQuantite >= 1 && nouvelleQuantite <= (produit?.stock || 1)) {
      setQuantite(nouvelleQuantite);
    }
  };

  if (chargement) {
    return (
      <div className="conteneur">
        <div className="chargement">Chargement du produit...</div>
      </div>
    );
  }

  if (erreur || !produit) {
    return (
      <div className="conteneur">
        <div className="message-erreur">
          <h2>Produit non trouvé</h2>
          <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <button onClick={() => navigate('/produits')} className="btn btn-primaire">
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="conteneur">
      <div className="detail-produit">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Accueil</span>
          <span className="breadcrumb-separator"> / </span>
          <span onClick={() => navigate('/produits')} className="breadcrumb-link">Produits</span>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">{produit.nom}</span>
        </div>

        <div className="produit-layout">
          <div className="produit-images">
            <div className="image-principale">
              {produit.images && produit.images.length > 0 ? (
                <img 
                  src={produit.images[imageActive]} 
                  alt={produit.nom}
                  className="image-produit-principale"
                />
              ) : (
                <div className="placeholder-image-grande">
                  <span>Aucune image</span>
                </div>
              )}
              
              {produit.en_promotion && (
                <div className="badge-promo-detail">
                  -{Math.round(((produit.prix - produit.prix_promo) / produit.prix) * 100)}%
                </div>
              )}
            </div>

            {produit.images && produit.images.length > 1 && (
              <div className="images-miniatures">
                {produit.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${produit.nom} ${index + 1}`}
                    className={`miniature ${index === imageActive ? 'active' : ''}`}
                    onClick={() => setImageActive(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="produit-info">
            <div className="produit-header">
              <h1>{produit.nom}</h1>
              <WishlistButton productId={produit.id} className="wishlist-detail" />
            </div>

            {produit.marque && (
              <p className="marque-produit">Par {produit.marque}</p>
            )}

            <div className="prix-section-detail">
              {produit.en_promotion ? (
                <>
                  <span className="prix-promo-detail">{produit.prix_final}€</span>
                  <span className="prix-original-detail">{produit.prix}€</span>
                </>
              ) : (
                <span className="prix-produit-detail">{produit.prix_final}€</span>
              )}
            </div>

            {produit.note_moyenne > 0 && (
              <div className="note-produit-detail">
                <div className="etoiles-detail">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`etoile ${i < Math.round(produit.note_moyenne) ? 'pleine' : 'vide'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="note-texte">
                  {produit.note_moyenne.toFixed(1)} ({produit.nombre_avis} avis)
                </span>
              </div>
            )}

            <div className="description-produit">
              <h3>Description</h3>
              <p>{produit.description}</p>
            </div>

            {produit.caracteristiques && (
              <div className="caracteristiques-produit">
                <h3>Caractéristiques</h3>
                <ul>
                  {Object.entries(produit.caracteristiques).map(([cle, valeur]) => (
                    <li key={cle}>
                      <strong>{cle}:</strong> {valeur}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="stock-info">
              {produit.stock > 0 ? (
                <span className="stock-disponible">
                  ✅ En stock ({produit.stock} disponibles)
                </span>
              ) : (
                <span className="stock-epuise">
                  ❌ Rupture de stock
                </span>
              )}
            </div>

            <div className="actions-produit">
              <div className="quantite-selector">
                <label>Quantité:</label>
                <div className="controle-quantite">
                  <button 
                    onClick={() => changerQuantite(quantite - 1)}
                    className="btn-quantite"
                    disabled={quantite <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantite}
                    onChange={(e) => changerQuantite(parseInt(e.target.value) || 1)}
                    min="1"
                    max={produit.stock}
                    className="input-quantite"
                  />
                  <button 
                    onClick={() => changerQuantite(quantite + 1)}
                    className="btn-quantite"
                    disabled={quantite >= produit.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={gererAjoutPanier}
                className="btn-ajouter-panier-detail"
                disabled={produit.stock <= 0}
              >
                {produit.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
              </button>
            </div>

            <div className="info-livraison">
              <div className="info-item">
                <span className="icone">🚚</span>
                <span>Livraison gratuite dès 50€</span>
              </div>
              <div className="info-item">
                <span className="icone">↩️</span>
                <span>Retour gratuit sous 30 jours</span>
              </div>
              <div className="info-item">
                <span className="icone">🔒</span>
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection productId={produit.id} />
      </div>
    </div>
  );
};

export default DetailProduit;