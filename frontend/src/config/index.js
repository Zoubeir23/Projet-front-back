// Configuration pour basculer entre mode démo et mode production
const isDemoMode = process.env.REACT_APP_DEMO_MODE === 'true' || 
                   !process.env.REACT_APP_API_URL ||
                   process.env.NODE_ENV === 'development';

let axiosInstance;

if (isDemoMode) {
  console.log('🎭 Mode DÉMO activé - Utilisation de données mockées');
  axiosInstance = require('./axiosDemo').default;
} else {
  console.log('🚀 Mode PRODUCTION - Connexion au backend Laravel');
  axiosInstance = require('./axios').default;
}

export default axiosInstance;