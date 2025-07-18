const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const generateInvoice = require('../../utils/pdf');
const sendMail = require('../../utils/email');
const path = require('path');

// Créer une commande (authentifié)
router.post('/', auth, async (req, res) => {
  try {
    const { produits, adresseLivraison, modePaiement } = req.body;
    const order = new Order({
      client: req.user.id,
      produits,
      adresseLivraison,
      modePaiement,
      statut: 'en attente',
      paiementEffectue: modePaiement === 'avant livraison' ? true : false
    });
    await order.save();
    // Ajouter la commande à l'utilisateur
    await User.findByIdAndUpdate(req.user.id, { $push: { commandes: order._id } });
    // Générer la facture PDF
    const user = await User.findById(req.user.id);
    const filePath = path.join(__dirname, '../../factures', `facture_${order._id}.pdf`);
    // On s'assure que le dossier existe
    const fs = require('fs');
    if (!fs.existsSync(path.join(__dirname, '../../factures'))) {
      fs.mkdirSync(path.join(__dirname, '../../factures'));
    }
    await generateInvoice(order, user, filePath);
    order.facturePDF = filePath;
    await order.save();
    // Envoyer l'email de confirmation avec la facture
    await sendMail(
      user.email,
      'Confirmation de commande',
      `Bonjour ${user.nom},\nVotre commande a bien été enregistrée. Vous trouverez la facture en pièce jointe.`,
      [{ filename: `facture_${order._id}.pdf`, path: filePath }]
    );
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir toutes les commandes (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
    const orders = await Order.find().populate('client').populate('produits.produit');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir les commandes de l'utilisateur connecté
router.get('/me', auth, async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user.id }).populate('produits.produit');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Modifier le statut ou le paiement d'une commande (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('client');
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    // Envoyer un email de notification au client si le statut change
    if (req.body.statut) {
      await sendMail(
        order.client.email,
        'Mise à jour de votre commande',
        `Bonjour ${order.client.nom},\nLe statut de votre commande a été mis à jour : ${order.statut}.`
      );
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer une commande (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router; 