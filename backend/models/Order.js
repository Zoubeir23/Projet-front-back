const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produits: [
    {
      produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantite: { type: Number, required: true },
      prix: { type: Number, required: true }
    }
  ],
  adresseLivraison: { type: String, required: true },
  statut: { type: String, enum: ['en attente', 'expédiée', 'livrée', 'annulée'], default: 'en attente' },
  modePaiement: { type: String, enum: ['avant livraison', 'après livraison'], required: true },
  paiementEffectue: { type: Boolean, default: false },
  facturePDF: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 