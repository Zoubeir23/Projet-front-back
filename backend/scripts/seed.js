const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connecté à MongoDB');

    // Nettoyer les données existantes
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Données existantes supprimées');

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      nom: 'Administrateur',
      email: 'admin@ecommerce.com',
      motdepasse: hashedPassword,
      role: 'admin',
      adresse: '123 Rue de l\'Admin, Paris'
    });
    await admin.save();

    // Créer un utilisateur client
    const clientPassword = await bcrypt.hash('client123', 10);
    const client = new User({
      nom: 'Client Test',
      email: 'client@test.com',
      motdepasse: clientPassword,
      role: 'client',
      adresse: '456 Avenue du Client, Lyon'
    });
    await client.save();

    // Créer des catégories
    const categories = [
      {
        nom: 'Électronique',
        description: 'Smartphones, ordinateurs, accessoires électroniques'
      },
      {
        nom: 'Vêtements',
        description: 'Mode homme, femme et enfant'
      },
      {
        nom: 'Maison & Jardin',
        description: 'Décoration, mobilier, jardinage'
      },
      {
        nom: 'Sports & Loisirs',
        description: 'Équipements sportifs et articles de loisirs'
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Catégories créées');

    // Créer des produits
    const products = [
      {
        nom: 'iPhone 14 Pro',
        description: 'Smartphone Apple dernière génération avec appareil photo professionnel',
        prix: 1199,
        images: ['https://via.placeholder.com/300x300?text=iPhone+14+Pro'],
        stock: 25,
        categorie: createdCategories[0]._id
      },
      {
        nom: 'MacBook Air M2',
        description: 'Ordinateur portable ultra-fin avec puce M2',
        prix: 1499,
        images: ['https://via.placeholder.com/300x300?text=MacBook+Air'],
        stock: 15,
        categorie: createdCategories[0]._id
      },
      {
        nom: 'AirPods Pro',
        description: 'Écouteurs sans fil avec réduction de bruit active',
        prix: 279,
        images: ['https://via.placeholder.com/300x300?text=AirPods+Pro'],
        stock: 50,
        categorie: createdCategories[0]._id
      },
      {
        nom: 'T-shirt Premium',
        description: 'T-shirt en coton bio, coupe moderne',
        prix: 29.99,
        images: ['https://via.placeholder.com/300x300?text=T-shirt'],
        stock: 100,
        categorie: createdCategories[1]._id
      },
      {
        nom: 'Jean Slim',
        description: 'Jean coupe slim, denim de qualité',
        prix: 79.99,
        images: ['https://via.placeholder.com/300x300?text=Jean'],
        stock: 75,
        categorie: createdCategories[1]._id
      },
      {
        nom: 'Canapé 3 places',
        description: 'Canapé confortable en tissu gris',
        prix: 899,
        images: ['https://via.placeholder.com/300x300?text=Canapé'],
        stock: 8,
        categorie: createdCategories[2]._id
      },
      {
        nom: 'Plante verte',
        description: 'Monstera deliciosa, parfaite pour l\'intérieur',
        prix: 34.99,
        images: ['https://via.placeholder.com/300x300?text=Plante'],
        stock: 30,
        categorie: createdCategories[2]._id
      },
      {
        nom: 'Vélo de route',
        description: 'Vélo de course léger, cadre aluminium',
        prix: 1299,
        images: ['https://via.placeholder.com/300x300?text=Vélo'],
        stock: 12,
        categorie: createdCategories[3]._id
      },
      {
        nom: 'Raquette de tennis',
        description: 'Raquette professionnelle, équilibrée',
        prix: 159.99,
        images: ['https://via.placeholder.com/300x300?text=Raquette'],
        stock: 20,
        categorie: createdCategories[3]._id
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log('Produits créés');

    // Mettre à jour les catégories avec les produits
    for (let i = 0; i < createdCategories.length; i++) {
      const categoryProducts = createdProducts.filter(p => 
        p.categorie.toString() === createdCategories[i]._id.toString()
      );
      await Category.findByIdAndUpdate(createdCategories[i]._id, {
        produits: categoryProducts.map(p => p._id)
      });
    }

    console.log('✅ Données de test créées avec succès !');
    console.log('👤 Admin: admin@ecommerce.com / admin123');
    console.log('👤 Client: client@test.com / client123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    process.exit(1);
  }
};

seedData();