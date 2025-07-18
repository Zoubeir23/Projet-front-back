const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const auth = require('../../middleware/auth');

// Obtenir tous les produits
router.get('/', async (req, res) => {
  try {
    const produits = await Product.find().populate('categorie');
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id).populate('categorie');
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Créer un produit (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const { nom, description, prix, images, stock, categorie } = req.body;
    const produit = new Product({ nom, description, prix, images, stock, categorie });
    await produit.save();
    res.status(201).json(produit);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Modifier un produit (protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer un produit (protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const produit = await Product.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router; 