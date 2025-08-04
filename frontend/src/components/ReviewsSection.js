import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { useUtiliserAuth } from '../contextes/ContexteAuth';
import '../styles/Reviews.css';

const ReviewsSection = ({ productId }) => {
  const [avis, setAvis] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nouvelAvis, setNouvelAvis] = useState({
    note: 5,
    titre: '',
    commentaire: '',
    recommande: true
  });
  const [filtreNote, setFiltreNote] = useState('');
  const [tri, setTri] = useState('recent');
  const { utilisateurActuel } = useUtiliserAuth();

  useEffect(() => {
    chargerAvis();
  }, [productId, filtreNote, tri]);

  const chargerAvis = async () => {
    try {
      const params = {};
      if (filtreNote) params.note = filtreNote;
      if (tri) params.tri = tri;

      const response = await axiosInstance.get(`/api/products/${productId}/reviews`, { params });
      setAvis(response.data.data);
      setStatistiques(response.data.statistiques);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setChargement(false);
    }
  };

  const soumettreAvis = async (e) => {
    e.preventDefault();
    
    if (!utilisateurActuel) {
      alert('Vous devez être connecté pour laisser un avis');
      return;
    }

    try {
      await axiosInstance.post(`/api/products/${productId}/reviews`, nouvelAvis);
      alert('Avis soumis avec succès ! Il sera visible après modération.');
      setAfficherFormulaire(false);
      setNouvelAvis({ note: 5, titre: '', commentaire: '', recommande: true });
      chargerAvis();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la soumission de l\'avis');
    }
  };

  const marquerUtile = async (reviewId) => {
    try {
      await axiosInstance.post(`/api/reviews/${reviewId}/helpful`);
      chargerAvis(); // Recharger pour mettre à jour le compteur
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const renderEtoiles = (note, taille = 'normal') => {
    const etoiles = [];
    for (let i = 1; i <= 5; i++) {
      etoiles.push(
        <span 
          key={i} 
          className={`etoile ${i <= note ? 'pleine' : 'vide'} ${taille}`}
        >
          ★
        </span>
      );
    }
    return etoiles;
  };

  const renderEtoilesInteractives = (note, onChange) => {
    const etoiles = [];
    for (let i = 1; i <= 5; i++) {
      etoiles.push(
        <span 
          key={i} 
          className={`etoile-interactive ${i <= note ? 'pleine' : 'vide'}`}
          onClick={() => onChange(i)}
        >
          ★
        </span>
      );
    }
    return etoiles;
  };

  if (chargement) {
    return <div className="chargement">Chargement des avis...</div>;
  }

  return (
    <div className="section-avis">
      <div className="en-tete-avis">
        <h3>Avis clients</h3>
        
        {statistiques && (
          <div className="resume-avis">
            <div className="note-globale">
              <div className="note-moyenne">
                {statistiques.moyenne}
                <div className="etoiles-moyenne">
                  {renderEtoiles(Math.round(statistiques.moyenne))}
                </div>
              </div>
              <div className="total-avis">
                Basé sur {statistiques.total} avis
              </div>
            </div>
            
            <div className="repartition-notes">
              {Object.entries(statistiques.repartition).reverse().map(([note, data]) => (
                <div key={note} className="ligne-repartition">
                  <span className="label-note">{note} ★</span>
                  <div className="barre-progression">
                    <div 
                      className="progression" 
                      style={{ width: `${data.pourcentage}%` }}
                    ></div>
                  </div>
                  <span className="pourcentage">{data.pourcentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="controles-avis">
        <div className="filtres-avis">
          <select 
            value={filtreNote} 
            onChange={(e) => setFiltreNote(e.target.value)}
            className="filtre-note"
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
          
          <select 
            value={tri} 
            onChange={(e) => setTri(e.target.value)}
            className="tri-avis"
          >
            <option value="recent">Plus récents</option>
            <option value="ancien">Plus anciens</option>
            <option value="utile">Plus utiles</option>
          </select>
        </div>

        {utilisateurActuel && (
          <button 
            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
            className="btn btn-primaire"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {afficherFormulaire && (
        <form onSubmit={soumettreAvis} className="formulaire-avis">
          <div className="groupe-champ">
            <label>Note *</label>
            <div className="etoiles-selection">
              {renderEtoilesInteractives(nouvelAvis.note, (note) => 
                setNouvelAvis({...nouvelAvis, note})
              )}
            </div>
          </div>

          <div className="groupe-champ">
            <label>Titre de l'avis</label>
            <input
              type="text"
              value={nouvelAvis.titre}
              onChange={(e) => setNouvelAvis({...nouvelAvis, titre: e.target.value})}
              placeholder="Résumez votre expérience"
              maxLength="255"
            />
          </div>

          <div className="groupe-champ">
            <label>Commentaire</label>
            <textarea
              value={nouvelAvis.commentaire}
              onChange={(e) => setNouvelAvis({...nouvelAvis, commentaire: e.target.value})}
              placeholder="Partagez votre expérience avec ce produit"
              rows="4"
              maxLength="1000"
            />
          </div>

          <div className="groupe-champ">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={nouvelAvis.recommande}
                onChange={(e) => setNouvelAvis({...nouvelAvis, recommande: e.target.checked})}
              />
              Je recommande ce produit
            </label>
          </div>

          <div className="actions-formulaire">
            <button type="submit" className="btn btn-primaire">
              Publier l'avis
            </button>
            <button 
              type="button" 
              onClick={() => setAfficherFormulaire(false)}
              className="btn btn-secondaire"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="liste-avis">
        {avis.length === 0 ? (
          <div className="aucun-avis">
            <p>Aucun avis pour ce produit.</p>
            {utilisateurActuel && (
              <p>Soyez le premier à laisser un avis !</p>
            )}
          </div>
        ) : (
          avis.map(avisItem => (
            <div key={avisItem.id} className="carte-avis">
              <div className="en-tete-avis-item">
                <div className="info-utilisateur">
                  <div className="avatar-utilisateur">
                    {avisItem.utilisateur.prenom[0]}{avisItem.utilisateur.nom[0]}
                  </div>
                  <div className="details-utilisateur">
                    <div className="nom-utilisateur">
                      {avisItem.utilisateur.prenom} {avisItem.utilisateur.nom[0]}.
                    </div>
                    <div className="date-avis">{avisItem.temps_ecoule}</div>
                  </div>
                </div>
                
                <div className="note-avis">
                  {renderEtoiles(avisItem.note)}
                  {avisItem.verifie && (
                    <span className="badge-verifie">Achat vérifié</span>
                  )}
                </div>
              </div>

              {avisItem.titre && (
                <h4 className="titre-avis">{avisItem.titre}</h4>
              )}

              {avisItem.commentaire && (
                <p className="commentaire-avis">{avisItem.commentaire}</p>
              )}

              {avisItem.recommande && (
                <div className="recommandation">
                  ✓ Recommande ce produit
                </div>
              )}

              <div className="actions-avis">
                <button 
                  onClick={() => marquerUtile(avisItem.id)}
                  className="btn-utile"
                >
                  👍 Utile ({avisItem.utile_count})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;