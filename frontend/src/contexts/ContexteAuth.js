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
    const donneesUtilisateur = localStorage.getItem('utilisateur');
    
    if (token && donneesUtilisateur) {
      try {
        setUtilisateurActuel(JSON.parse(donneesUtilisateur));
      } catch (error) {
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
      return { 
        succes: false, 
        erreur: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const inscription = async (donneesUtilisateur) => {
    try {
      await axiosInstance.post('/api/auth/register', donneesUtilisateur);
      return { succes: true };
    } catch (error) {
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