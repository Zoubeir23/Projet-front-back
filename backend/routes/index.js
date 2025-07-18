const express = require('express');
const router = express.Router();

/* Page d'accueil de l'API */
router.get('/', function(req, res, next) {
  res.json({
    message: 'API E-commerce - IAGE DK 2025',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      users: '/api/users'
    }
  });
});

module.exports = router;