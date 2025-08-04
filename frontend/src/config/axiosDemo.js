import { mockApiService } from '../services/mockApiService';

// Service API mocké pour la démonstration
const axiosInstance = {
  get: async (url, config = {}) => {
    console.log(`[DEMO] GET ${url}`);
    
    if (url.includes('/api/products/') && url.includes('/reviews')) {
      const productId = url.split('/')[3];
      return await mockApiService.getProductReviews(productId);
    } else if (url.includes('/api/products/') && !url.includes('reviews')) {
      const productId = url.split('/')[3];
      return await mockApiService.getProduct(productId);
    } else if (url.includes('/api/products')) {
      return await mockApiService.getProducts(config.params || {});
    } else if (url.includes('/api/categories')) {
      return await mockApiService.getCategories();
    } else if (url.includes('/api/wishlist/') && url.includes('/check')) {
      const productId = url.split('/')[3];
      return await mockApiService.checkWishlist(productId);
    } else if (url.includes('/api/wishlist')) {
      return await mockApiService.getWishlist();
    }
    
    // Réponse par défaut
    return {
      data: {
        success: false,
        message: 'Endpoint non implémenté en mode démo'
      }
    };
  },

  post: async (url, data) => {
    console.log(`[DEMO] POST ${url}`, data);
    
    if (url.includes('/api/auth/login')) {
      return await mockApiService.login(data);
    } else if (url.includes('/api/auth/register')) {
      return await mockApiService.register(data);
    } else if (url.includes('/api/wishlist/')) {
      const productId = url.split('/')[3];
      return await mockApiService.addToWishlist(productId);
    }
    
    return {
      data: {
        success: true,
        message: 'Action simulée en mode démo'
      }
    };
  },

  delete: async (url) => {
    console.log(`[DEMO] DELETE ${url}`);
    
    if (url.includes('/api/wishlist/')) {
      const productId = url.split('/')[3];
      return await mockApiService.removeFromWishlist(productId);
    }
    
    return {
      data: {
        success: true,
        message: 'Suppression simulée en mode démo'
      }
    };
  },

  put: async (url, data) => {
    console.log(`[DEMO] PUT ${url}`, data);
    return {
      data: {
        success: true,
        message: 'Mise à jour simulée en mode démo'
      }
    };
  },

  defaults: {
    headers: {
      common: {}
    }
  }
};

export default axiosInstance;