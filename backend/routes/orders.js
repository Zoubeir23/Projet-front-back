const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateInvoicePDF } = require('../utils/pdf');
const { sendOrderEmail } = require('../utils/email');
const router = express.Router();

// Créer une commande
router.post('/', auth, async (req, res) => {
  try {
    const { produits, adresseLivraison, modePaiement } = req.body;
    
    // Vérifier le stock et calculer le total
    let total = 0;
    const orderProducts = [];
    
    for (let item of produits) {
      const product = await Product.findById(item.produit);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.produit} non trouvé` });
      }
      
      if (product.stock < item.quantite) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour ${product.nom}. Stock disponible: ${product.stock}` 
        });
      }
      
      orderProducts.push({
        produit: product._id,
        quantite: item.quantite,
        prix: product.prix
      });
      
      total += product.prix * item.quantite;
    }

    const order = new Order({
      client: req.user.userId,
      produits: orderProducts,
      adresseLivraison,
      modePaiement,
      paiementEffectue: modePaiement === 'avant livraison' ? false : true
    });

    await order.save();

    // Mettre à jour le stock
    for (let item of produits) {
      await Product.findByIdAndUpdate(item.produit, {
        $inc: { stock: -item.quantite }
      });
    }

    // Ajouter la commande à l'utilisateur
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { commandes: order._id }
    });

    // Générer la facture PDF
    const pdfPath = await generateInvoicePDF(order);
    order.facturePDF = pdfPath;
    await order.save();

    // Envoyer email de confirmation
    const user = await User.findById(req.user.userId);
    await sendOrderEmail(user.email, order, 'confirmation');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir les commandes de l'utilisateur
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user.userId })
      .populate('produits.produit')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir toutes les commandes (admin seulement)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const orders = await Order.find()
      .populate('client', 'nom email')
      .populate('produits.produit')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Modifier le statut d'une commande (admin seulement)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { statut } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    ).populate('client', 'email nom');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Envoyer email de mise à jour
    await sendOrderEmail(order.client.email, order, 'status_update');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Marquer le paiement comme effectué
router.put('/:id/payment', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paiementEffectue: true },
      { new: true }
    ).populate('client', 'email nom');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Envoyer email de confirmation de paiement
    await sendOrderEmail(order.client.email, order, 'payment_confirmation');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Télécharger la facture PDF
router.get('/:id/invoice', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur peut accéder à cette facture
    if (req.user.role !== 'admin' && order.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    if (!order.facturePDF) {
      return res.status(404).json({ message: 'Facture non disponible' });
    }

    res.download(order.facturePDF);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;