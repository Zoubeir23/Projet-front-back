const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema); 