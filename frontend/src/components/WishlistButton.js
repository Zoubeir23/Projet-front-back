import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/WishlistButton.css';

const WishlistButton = ({ productId, className = '' }) => {
  const [dansWishlist, setDansWishlist] = useState(false);
  const [chargement, setChargement] = useState(false);
  const { utilisateurActuel } = useUtiliserAuth();

  useEffect(() => {
    if (utilisateurActuel && productId) {
      verifierWishlist();
    }
  }, [productId, utilisateurActuel]);

  const verifierWishlist = async () => {
    try {
      const response = await axiosInstance.get(`/api/wishlist/${productId}/check`);
      setDansWishlist(response.data.in_wishlist);
    } catch (error) {
      console.error('Erreur lors de la vérification wishlist:', error);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!utilisateurActuel) {
      alert('Vous devez être connecté pour ajouter des produits à votre liste de souhaits');
      return;
    }

    setChargement(true);

    try {
      if (dansWishlist) {
        await axiosInstance.delete(`/api/wishlist/${productId}`);
        setDansWishlist(false);
      } else {
        await axiosInstance.post(`/api/wishlist/${productId}`);
        setDansWishlist(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour de la wishlist');
    } finally {
      setChargement(false);
    }
  };

  if (!utilisateurActuel) {
    return null; // Ne pas afficher le bouton si non connecté
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={chargement}
      className={`btn-wishlist ${dansWishlist ? 'active' : ''} ${className}`}
      title={dansWishlist ? 'Retirer de la liste de souhaits' : 'Ajouter à la liste de souhaits'}
    >
      {chargement ? (
        <span className="spinner-wishlist">⟳</span>
      ) : (
        <span className={`coeur ${dansWishlist ? 'plein' : 'vide'}`}>
          {dansWishlist ? '❤️' : '🤍'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;