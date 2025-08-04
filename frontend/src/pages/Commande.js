import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUtiliserPanier } from '../contextes/ContextePanier';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Formulaires.css';

const Commande = () => {
  const { articlesPanier, obtenirTotalPanier, viderPanier } = useUtiliserPanier();
  const { utilisateurActuel } = useUtiliserAuth();
  const navigate = useNavigate();

  const [donneesLivraison, setDonneesLivraison] = useState({
    nom: utilisateurActuel?.name || '',
    email: utilisateurActuel?.email || '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France'
  });

  const [methodePaiement, setMethodePaiement] = useState('carte');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const gererChangement = (e) => {
    setDonneesLivraison({
      ...donneesLivraison,
      [e.target.name]: e.target.value
    });
  };

  const gererCommande = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    try {
      // Ici vous feriez l'appel API pour créer la commande
      // const commande = await axiosInstance.post('/api/orders', {
      //   items: articlesPanier,
      //   shipping: donneesLivraison,
      //   payment_method: methodePaiement,
      //   total: obtenirTotalPanier()
      // });

      // Simulation d'une commande réussie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      viderPanier();
      navigate('/mes-commandes', { 
        state: { 
          message: 'Commande passée avec succès !',
          numeroCommande: 'CMD-' + Date.now()
        }
      });
    } catch (error) {
      setErreur('Erreur lors de la création de la commande');
    }

    setChargement(false);
  };

  if (articlesPanier.length === 0) {
    return (
      <div className="conteneur">
        <div className="message-info">
          <h2>Aucun article dans votre panier</h2>
          <p>Ajoutez des produits à votre panier avant de passer commande.</p>
          <button onClick={() => navigate('/produits')} className="btn btn-primaire">
            Voir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="conteneur">
      <div className="commande-container">
        <h1>Finaliser ma commande</h1>

        {erreur && (
          <div className="alerte alerte-erreur">
            {erreur}
          </div>
        )}

        <div className="commande-layout">
          <div className="formulaire-commande">
            <form onSubmit={gererCommande}>
              <div className="section-commande">
                <h3>📦 Informations de livraison</h3>
                
                <div className="groupe-champs-double">
                  <div className="groupe-champ">
                    <label>Nom complet *</label>
                    <input
                      type="text"
                      name="nom"
                      value={donneesLivraison.nom}
                      onChange={gererChangement}
                      className="controle-formulaire"
                      required
                    />
                  </div>
                  
                  <div className="groupe-champ">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={donneesLivraison.email}
                      onChange={gererChangement}
                      className="controle-formulaire"
                      required
                    />
                  </div>
                </div>

                <div className="groupe-champ">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={donneesLivraison.telephone}
                    onChange={gererChangement}
                    className="controle-formulaire"
                    required
                  />
                </div>

                <div className="groupe-champ">
                  <label>Adresse *</label>
                  <input
                    type="text"
                    name="adresse"
                    value={donneesLivraison.adresse}
                    onChange={gererChangement}
                    className="controle-formulaire"
                    placeholder="Numéro et nom de rue"
                    required
                  />
                </div>

                <div className="groupe-champs-double">
                  <div className="groupe-champ">
                    <label>Ville *</label>
                    <input
                      type="text"
                      name="ville"
                      value={donneesLivraison.ville}
                      onChange={gererChangement}
                      className="controle-formulaire"
                      required
                    />
                  </div>
                  
                  <div className="groupe-champ">
                    <label>Code postal *</label>
                    <input
                      type="text"
                      name="codePostal"
                      value={donneesLivraison.codePostal}
                      onChange={gererChangement}
                      className="controle-formulaire"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="section-commande">
                <h3>💳 Mode de paiement</h3>
                
                <div className="options-paiement">
                  <label className="option-paiement">
                    <input
                      type="radio"
                      name="methodePaiement"
                      value="carte"
                      checked={methodePaiement === 'carte'}
                      onChange={(e) => setMethodePaiement(e.target.value)}
                    />
                    <span>💳 Carte bancaire</span>
                  </label>
                  
                  <label className="option-paiement">
                    <input
                      type="radio"
                      name="methodePaiement"
                      value="paypal"
                      checked={methodePaiement === 'paypal'}
                      onChange={(e) => setMethodePaiement(e.target.value)}
                    />
                    <span>🅿️ PayPal</span>
                  </label>
                  
                  <label className="option-paiement">
                    <input
                      type="radio"
                      name="methodePaiement"
                      value="virement"
                      checked={methodePaiement === 'virement'}
                      onChange={(e) => setMethodePaiement(e.target.value)}
                    />
                    <span>🏦 Virement bancaire</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primaire btn-pleine-largeur btn-commande"
                disabled={chargement}
              >
                {chargement ? 'Traitement...' : `Passer la commande (${obtenirTotalPanier().toFixed(2)}€)`}
              </button>
            </form>
          </div>

          <div className="resume-commande">
            <div className="carte-resume">
              <h3>Récapitulatif</h3>
              
              <div className="articles-resume">
                {articlesPanier.map(article => (
                  <div key={article._id || article.id} className="article-resume">
                    <div className="article-info">
                      <span className="nom">{article.nom}</span>
                      <span className="quantite">x{article.quantite}</span>
                    </div>
                    <span className="prix">{(article.prix * article.quantite).toFixed(2)}€</span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="ligne-resume">
                <span>Sous-total</span>
                <span>{obtenirTotalPanier().toFixed(2)}€</span>
              </div>
              
              <div className="ligne-resume">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              
              <div className="ligne-resume">
                <span>TVA (20%)</span>
                <span>{(obtenirTotalPanier() * 0.2).toFixed(2)}€</span>
              </div>

              <hr />

              <div className="ligne-resume total">
                <span>Total TTC</span>
                <span>{(obtenirTotalPanier() * 1.2).toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commande;