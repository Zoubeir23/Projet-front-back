import axios from 'axios';

// Configuration de base pour Axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token.length < 2000) { // Vérifier la taille du token
      try {
        // Vérifier que le token est valide
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token expiré, le supprimer
          localStorage.removeItem('token');
          localStorage.removeItem('utilisateur');
        }
      } catch (error) {
        // Token invalide, le supprimer
        console.warn('Token invalide détecté, suppression...');
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
      }
    } else if (token && token.length >= 2000) {
      // Token trop volumineux, le supprimer
      console.warn('Token trop volumineux détecté, suppression...');
      localStorage.removeItem('token');
      localStorage.removeItem('utilisateur');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs de connexion
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Erreur de connexion au serveur');
      return Promise.reject({
        response: {
          data: {
            message: 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.'
          }
        }
      });
    }

    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('utilisateur');
      window.location.href = '/connexion';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;