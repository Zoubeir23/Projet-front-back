import { mockProducts, mockCategories, mockUser, mockReviews } from '../data/mockData';

// Simulation d'un délai réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  // Authentification
  login: async (credentials) => {
    await delay(500);
    if (credentials.email === 'admin@ecommerce.com' && credentials.motdepasse === 'admin123') {
      return {
        data: {
          success: true,
          token: 'mock-jwt-token-admin',
          user: { ...mockUser, role: 'admin', email: credentials.email }
        }
      };
    } else if (credentials.email === 'client@test.com' && credentials.motdepasse === 'client123') {
      return {
        data: {
          success: true,
          token: 'mock-jwt-token-client',
          user: { ...mockUser, email: credentials.email }
        }
      };
    } else {
      throw new Error('Email ou mot de passe incorrect');
    }
  },

  register: async (userData) => {
    await delay(500);
    return {
      data: {
        success: true,
        user: { ...userData, id: Date.now(), role: 'client' }
      }
    };
  },

  // Produits
  getProducts: async (params = {}) => {
    await delay(300);
    let filteredProducts = [...mockProducts];
    
    if (params.recherche) {
      filteredProducts = filteredProducts.filter(p => 
        p.nom.toLowerCase().includes(params.recherche.toLowerCase())
      );
    }
    
    if (params.categorie) {
      filteredProducts = filteredProducts.filter(p => 
        p.categorie.id === parseInt(params.categorie)
      );
    }

    return {
      data: {
        success: true,
        data: filteredProducts,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: filteredProducts.length
        },
        filtres: {
          categories: mockCategories,
          marques: ['Apple', 'Samsung', 'EcoWear', 'CleanBot', 'UrbanBike'],
          prix_min: 29.99,
          prix_max: 1499.00
        }
      }
    };
  },

  getProduct: async (id) => {
    await delay(200);
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Produit non trouvé');
    }
    return {
      data: {
        success: true,
        data: product
      }
    };
  },

  // Catégories
  getCategories: async () => {
    await delay(200);
    return {
      data: {
        success: true,
        data: mockCategories
      }
    };
  },

  // Reviews
  getProductReviews: async (productId) => {
    await delay(300);
    return {
      data: {
        success: true,
        data: mockReviews,
        statistiques: {
          moyenne: 4.5,
          total: 2,
          repartition: {
            5: { count: 1, pourcentage: 50 },
            4: { count: 1, pourcentage: 50 },
            3: { count: 0, pourcentage: 0 },
            2: { count: 0, pourcentage: 0 },
            1: { count: 0, pourcentage: 0 }
          }
        }
      }
    };
  },

  // Wishlist
  getWishlist: async () => {
    await delay(200);
    const wishlistItems = JSON.parse(localStorage.getItem('mockWishlist') || '[]');
    const wishlistProducts = mockProducts.filter(p => wishlistItems.includes(p.id));
    return {
      data: {
        success: true,
        data: wishlistProducts,
        total: wishlistProducts.length
      }
    };
  },

  addToWishlist: async (productId) => {
    await delay(200);
    const wishlist = JSON.parse(localStorage.getItem('mockWishlist') || '[]');
    if (!wishlist.includes(parseInt(productId))) {
      wishlist.push(parseInt(productId));
      localStorage.setItem('mockWishlist', JSON.stringify(wishlist));
    }
    return {
      data: {
        success: true,
        message: 'Produit ajouté à votre liste de souhaits'
      }
    };
  },

  removeFromWishlist: async (productId) => {
    await delay(200);
    const wishlist = JSON.parse(localStorage.getItem('mockWishlist') || '[]');
    const newWishlist = wishlist.filter(id => id !== parseInt(productId));
    localStorage.setItem('mockWishlist', JSON.stringify(newWishlist));
    return {
      data: {
        success: true,
        message: 'Produit retiré de votre liste de souhaits'
      }
    };
  },

  checkWishlist: async (productId) => {
    await delay(100);
    const wishlist = JSON.parse(localStorage.getItem('mockWishlist') || '[]');
    return {
      data: {
        success: true,
        in_wishlist: wishlist.includes(parseInt(productId))
      }
    };
  }
};