import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import '../styles/DetailProduit.css';

const DetailProduit = () => {
  const [produit, setProduit] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [chargement, setChargement] = useState(true);
  const { id } = useParams();
  const { ajouterAuPanier } = useUtiliserPanier();
  const navigate = useNavigate();

  useEffect(() => {
    chargerProduit();
  }, [id]);

  const chargerProduit = async () => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`);
      setProduit(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      navigate('/produits');
    } finally {
      setChargement(false);
    }
  };

  const gererAjoutPanier = () => {
    ajouterAuPanier(produit, quantite);
    alert(`${quantite} ${produit.nom} ajouté(s) au panier !`);
  };

  if (chargement) {
    return <div className="chargement">Chargement du produit...</div>;
  }

  if (!produit) {
    return <div className="conteneur">Produit non trouvé</div>;
  }

  return (
    <div className="conteneur">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondaire btn-retour"
      >
        ← Retour
      </button>

      <div className="conteneur-detail-produit">
        <div className="section-image">
          {produit.images && produit.images[0] ? (
            <img 
              src={produit.images[0]} 
              alt={produit.nom}
              className="image-detail-produit"
            />
          ) : (
            <div className="placeholder-image">
              <span>Aucune image</span>
            </div>
          )}
        </div>

        <div className="section-info">
          <h1 className="nom-produit">{produit.nom}</h1>
          
          <div className="prix-produit-detail">
            {produit.prix}€
          </div>

          <p className="description-produit-detail">
            {produit.description}
          </p>

          <div className="info-supplementaire">
            <p><strong>Catégorie:</strong> {produit.categorie?.nom}</p>
            <p><strong>Stock disponible:</strong> {produit.stock} unités</p>
          </div>

          {produit.stock > 0 ? (
            <div className="section-achat">
              <div className="groupe-champ">
                <label>Quantité</label>
                <select
                  value={quantite}
                  onChange={(e) => setQuantite(parseInt(e.target.value))}
                  className="selecteur-quantite"
                >
                  {[...Array(Math.min(produit.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={gererAjoutPanier}
                className="btn btn-primaire btn-ajouter-panier"
              >
                Ajouter au panier - {(produit.prix * quantite).toFixed(2)}€
              </button>
            </div>
          ) : (
            <div className="section-rupture">
              <p className="message-rupture">
                Produit en rupture de stock
              </p>
              <button className="btn btn-secondaire" disabled>
                Non disponible
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailProduit;