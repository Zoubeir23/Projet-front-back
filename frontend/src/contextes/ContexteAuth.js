import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../config';

const ContexteAuth = createContext();

export const useUtiliserAuth = () => {
  return useContext(ContexteAuth);
};

export const FournisseurAuth = ({ children }) => {
  const [utilisateurActuel, setUtilisateurActuel] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Vérifier la validité du token
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const donneesUtilisateur = localStorage.getItem('utilisateur');
          if (donneesUtilisateur) {
            setUtilisateurActuel(JSON.parse(donneesUtilisateur));
          }
        } else {
          // Token expiré
          localStorage.removeItem('token');
          localStorage.removeItem('utilisateur');
        }
      } catch (error) {
        // Token invalide
        console.warn('Token invalide détecté lors de l\'initialisation');
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
      }
    }
    setChargement(false);
  }, []);

  const connexion = async (email, motdepasse) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, motdepasse });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('utilisateur', JSON.stringify(user));
      setUtilisateurActuel(user);
      
      return { succes: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { 
        succes: false, 
        erreur: error.response?.data?.message || 'Erreur de connexion au serveur' 
      };
    }
  };

  const inscription = async (donneesUtilisateur) => {
    try {
      await axiosInstance.post('/api/auth/register', donneesUtilisateur);
      return { succes: true };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { 
        succes: false, 
        erreur: error.response?.data?.message || 'Erreur d\'inscription' 
      };
    }
  };

  const deconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateurActuel(null);
  };

  const valeur = {
    utilisateurActuel,
    connexion,
    inscription,
    deconnexion
  };

  return (
    <ContexteAuth.Provider value={valeur}>
      {!chargement && children}
    </ContexteAuth.Provider>
  );
};