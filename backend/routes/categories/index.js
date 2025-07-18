const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const auth = require('../../middleware/auth');

// Obtenir toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('produits');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir une catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const categorie = await Category.findById(req.params.id).populate('produits');
    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(categorie);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Créer une catégorie (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const { nom, description } = req.body;
    const categorie = new Category({ nom, description });
    await categorie.save();
    res.status(201).json(categorie);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Modifier une catégorie (protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const categorie = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(categorie);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer une catégorie (protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const categorie = await Category.findByIdAndDelete(req.params.id);
    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router; 