import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import '../styles/Produits.css';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [parametresRecherche, setParametresRecherche] = useSearchParams();
  const [filtres, setFiltres] = useState({
    recherche: parametresRecherche.get('search') || '',
    categorie: parametresRecherche.get('categorie') || ''
  });
  
  const { ajouterAuPanier } = useUtiliserPanier();

  useEffect(() => {
    chargerCategories();
  }, []);

  useEffect(() => {
    chargerProduits();
  }, [parametresRecherche]);

  const chargerCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const chargerProduits = async () => {
    setChargement(true);
    try {
      const params = new URLSearchParams();
      if (parametresRecherche.get('search')) params.append('search', parametresRecherche.get('search'));
      if (parametresRecherche.get('categorie')) params.append('categorie', parametresRecherche.get('categorie'));
      
      const response = await axiosInstance.get(`/api/products?${params.toString()}`);
      setProduits(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setChargement(false);
    }
  };

  const gererChangementFiltre = (e) => {
    const { name, value } = e.target;
    setFiltres(prec => ({ ...prec, [name]: value }));
  };

  const appliquerFiltres = () => {
    const params = new URLSearchParams();
    if (filtres.recherche) params.append('search', filtres.recherche);
    if (filtres.categorie) params.append('categorie', filtres.categorie);
    setParametresRecherche(params);
  };

  const gererAjoutPanier = (produit) => {
    ajouterAuPanier(produit);
    alert('Produit ajouté au panier !');
  };

  return (
    <div className="conteneur">
      <h1>Nos Produits</h1>
      
      <div className="carte-filtres">
        <div className="conteneur-filtres">
          <div className="groupe-champ">
            <label>Rechercher</label>
            <input
              type="text"
              name="recherche"
              value={filtres.recherche}
              onChange={gererChangementFiltre}
              className="controle-formulaire"
              placeholder="Nom du produit..."
            />
          </div>
          
          <div className="groupe-champ">
            <label>Catégorie</label>
            <select
              name="categorie"
              value={filtres.categorie}
              onChange={gererChangementFiltre}
              className="controle-formulaire"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(categorie => (
                <option key={categorie._id} value={categorie._id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
          </div>
          
          <button onClick={appliquerFiltres} className="btn btn-primaire btn-filtrer">
            Filtrer
          </button>
        </div>
      </div>

      {chargement ? (
        <div className="chargement">Chargement des produits...</div>
      ) : (
        <div className="grille grille-3">
          {produits.map(produit => (
            <div key={produit._id} className="carte-produit">
              {produit.images && produit.images[0] && (
                <img 
                  src={produit.images[0]} 
                  alt={produit.nom}
                  className="image-produit-liste"
                />
              )}
              
              <div className="contenu-carte-produit">
                <h3>{produit.nom}</h3>
                <p className="description-produit">
                  {produit.description}
                </p>
                
                <div className="info-prix-stock">
                  <span className="prix-produit">
                    {produit.prix}€
                  </span>
                  <span className="stock-produit">
                    Stock: {produit.stock}
                  </span>
                </div>
                
                <div className="actions-produit">
                  <Link 
                    to={`/produits/${produit._id}`} 
                    className="btn btn-secondaire"
                  >
                    Détails
                  </Link>
                  <button 
                    onClick={() => gererAjoutPanier(produit)}
                    className="btn btn-primaire"
                    disabled={produit.stock === 0}
                  >
                    {produit.stock === 0 ? 'Rupture' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!chargement && produits.length === 0 && (
        <div className="aucun-resultat">
          <p>Aucun produit trouvé.</p>
        </div>
      )}
    </div>
  );
};

export default Produits;