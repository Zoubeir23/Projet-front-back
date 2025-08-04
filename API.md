# Documentation API - Plateforme E-commerce

## 🌐 **Base URL**
```
http://localhost:3001/api
```

## 🔐 **Authentification**

L'API utilise l'authentification JWT (JSON Web Tokens). Incluez le token dans l'en-tête de chaque requête protégée :

```http
Authorization: Bearer <votre_token_jwt>
```

## 📋 **Format des Réponses**

### **Réponse Succès**
```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

### **Réponse Erreur**
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": { ... }
}
```

### **Réponse avec Pagination**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 12,
    "total": 60,
    "from": 1,
    "to": 12
  }
}
```

## 🔑 **Authentification**

### **POST /auth/register**
Inscription d'un nouvel utilisateur.

**Paramètres :**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "motdepasse": "motdepasse123",
  "motdepasse_confirmation": "motdepasse123",
  "telephone": "01 23 45 67 89",
  "adresse": "123 Rue de la Paix",
  "ville": "Paris",
  "code_postal": "75001",
  "pays": "France",
  "date_naissance": "1990-01-01"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "role": "client"
  }
}
```

### **POST /auth/login**
Connexion d'un utilisateur.

**Paramètres :**
```json
{
  "email": "jean.dupont@email.com",
  "motdepasse": "motdepasse123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "role": "client",
    "nom_complet": "Jean Dupont",
    "avatar_url": "https://ui-avatars.com/api/?name=JD..."
  }
}
```

### **POST /auth/logout**
Déconnexion (token requis).

**Réponse :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### **GET /auth/me**
Informations de l'utilisateur connecté (token requis).

**Réponse :**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "telephone": "01 23 45 67 89",
    "adresse": "123 Rue de la Paix",
    "ville": "Paris",
    "code_postal": "75001",
    "pays": "France",
    "date_naissance": "1990-01-01",
    "role": "client",
    "nom_complet": "Jean Dupont",
    "avatar_url": "https://ui-avatars.com/api/?name=JD...",
    "email_verifie": true,
    "membre_depuis": "2024-01-01"
  }
}
```

## 📦 **Produits**

### **GET /products**
Liste des produits avec filtres et pagination.

**Paramètres de requête :**
- `recherche` - Recherche par nom/description
- `categorie` - ID de la catégorie
- `prix_min` - Prix minimum
- `prix_max` - Prix maximum
- `marque` - Nom de la marque
- `en_stock` - true/false pour filtrer les produits en stock
- `promotion` - true/false pour les promotions
- `tri` - nom|prix|date|popularite
- `ordre` - asc|desc
- `per_page` - Nombre d'éléments par page (défaut: 12)
- `page` - Numéro de page

**Exemple :**
```
GET /products?recherche=iphone&categorie=1&prix_min=100&prix_max=1500&tri=prix&ordre=asc&page=1
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "iPhone 15 Pro",
      "description": "Le dernier smartphone Apple...",
      "slug": "iphone-15-pro",
      "prix": 1229.00,
      "prix_promo": null,
      "prix_final": 1229.00,
      "en_promotion": false,
      "stock": 25,
      "statut_stock": "disponible",
      "images": [
        "http://localhost:3001/storage/products/iphone15pro.jpg"
      ],
      "premiere_image": "http://localhost:3001/storage/products/iphone15pro.jpg",
      "marque": "Apple",
      "sku": "IPHONE15PRO-128",
      "poids": 0.187,
      "dimensions": {
        "longueur": 159.9,
        "largeur": 76.7,
        "hauteur": 8.25
      },
      "actif": true,
      "categorie": {
        "id": 1,
        "nom": "Smartphones",
        "slug": "smartphones"
      },
      "date_creation": "2024-01-01 10:00:00",
      "date_modification": "2024-01-01 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 12,
    "total": 35,
    "from": 1,
    "to": 12
  },
  "filtres": {
    "categories": [
      {"id": 1, "nom": "Électronique"},
      {"id": 2, "nom": "Vêtements"}
    ],
    "marques": ["Apple", "Samsung", "Sony"],
    "prix_min": 9.99,
    "prix_max": 1999.99
  }
}
```

### **GET /products/{id}**
Détail d'un produit spécifique.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nom": "iPhone 15 Pro",
    "description": "Le dernier smartphone Apple avec puce A17 Pro...",
    "slug": "iphone-15-pro",
    "prix": 1229.00,
    "prix_promo": null,
    "prix_final": 1229.00,
    "en_promotion": false,
    "stock": 25,
    "statut_stock": "disponible",
    "images": [
      "http://localhost:3001/storage/products/iphone15pro-1.jpg",
      "http://localhost:3001/storage/products/iphone15pro-2.jpg"
    ],
    "marque": "Apple",
    "sku": "IPHONE15PRO-128",
    "poids": 0.187,
    "dimensions": {
      "longueur": 159.9,
      "largeur": 76.7,
      "hauteur": 8.25
    },
    "categorie": {
      "id": 1,
      "nom": "Smartphones",
      "description": "Téléphones intelligents et accessoires",
      "slug": "smartphones"
    },
    "meta_title": "iPhone 15 Pro - Boutique en ligne",
    "meta_description": "Le dernier smartphone Apple avec puce A17 Pro..."
  }
}
```

### **POST /products** (Admin uniquement)
Créer un nouveau produit.

**Paramètres :**
```json
{
  "nom": "Nouveau Produit",
  "description": "Description détaillée du produit",
  "prix": 299.99,
  "stock": 50,
  "category_id": 1,
  "marque": "MarqueTest",
  "sku": "PROD-001",
  "poids": 0.5,
  "dimensions": {
    "longueur": 20,
    "largeur": 15,
    "hauteur": 5
  }
}
```

### **PUT /products/{id}** (Admin uniquement)
Modifier un produit existant.

### **DELETE /products/{id}** (Admin uniquement)
Supprimer un produit.

### **PUT /products/{id}/toggle-status** (Admin uniquement)
Activer/désactiver un produit.

### **PUT /products/{id}/stock** (Admin uniquement)
Mettre à jour le stock d'un produit.

**Paramètres :**
```json
{
  "stock": 100
}
```

## 📂 **Catégories**

### **GET /categories**
Liste des catégories avec hiérarchie.

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "Électronique",
      "description": "Appareils électroniques et gadgets",
      "slug": "electronique",
      "image": "http://localhost:3001/storage/categories/electronique.jpg",
      "actif": true,
      "ordre": 1,
      "nombre_produits": 25,
      "parent_id": null,
      "enfants": [
        {
          "id": 2,
          "nom": "Smartphones",
          "slug": "smartphones",
          "nombre_produits": 12
        }
      ],
      "chemin_complet": "Électronique"
    }
  ]
}
```

### **GET /categories/{id}**
Détail d'une catégorie avec ses produits.

### **POST /categories** (Admin uniquement)
Créer une nouvelle catégorie.

### **PUT /categories/{id}** (Admin uniquement)
Modifier une catégorie.

### **DELETE /categories/{id}** (Admin uniquement)
Supprimer une catégorie.

## 🛒 **Commandes**

### **GET /orders/my-orders**
Commandes de l'utilisateur connecté (token requis).

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_commande": "CMD-2024-000001",
      "statut": "confirmee",
      "statut_libelle": "Confirmée",
      "statut_paiement": "paye",
      "statut_paiement_libelle": "Payé",
      "mode_paiement": "avant_livraison",
      "sous_total": 1229.00,
      "frais_livraison": 9.99,
      "taxes": 0.00,
      "remise": 0.00,
      "total": 1238.99,
      "livraison": {
        "nom": "Dupont",
        "prenom": "Jean",
        "adresse": "123 Rue de la Paix",
        "ville": "Paris",
        "code_postal": "75001",
        "pays": "France",
        "telephone": "01 23 45 67 89",
        "adresse_complete": "123 Rue de la Paix, 75001 Paris, France"
      },
      "notes_client": "Livraison en point relais",
      "articles": [
        {
          "id": 1,
          "product_id": 1,
          "nom_produit": "iPhone 15 Pro",
          "prix_unitaire": 1229.00,
          "quantite": 1,
          "total_ligne": 1229.00,
          "sku_produit": "IPHONE15PRO-128",
          "image_produit": ["iphone15pro.jpg"]
        }
      ],
      "dates": {
        "commande": "2024-01-01 14:30:00",
        "paiement": "2024-01-01 14:35:00",
        "expedition": null,
        "livraison": null
      }
    }
  ]
}
```

### **POST /orders**
Créer une nouvelle commande (token requis).

**Paramètres :**
```json
{
  "mode_paiement": "avant_livraison",
  "frais_livraison": 9.99,
  "nom_livraison": "Dupont",
  "prenom_livraison": "Jean",
  "adresse_livraison": "123 Rue de la Paix",
  "ville_livraison": "Paris",
  "code_postal_livraison": "75001",
  "pays_livraison": "France",
  "telephone_livraison": "01 23 45 67 89",
  "notes_client": "Livraison en point relais",
  "articles": [
    {
      "product_id": 1,
      "quantite": 1
    },
    {
      "product_id": 2,
      "quantite": 2
    }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "data": {
    "id": 1,
    "numero_commande": "CMD-2024-000001",
    "total": 1238.99,
    "statut": "en_attente",
    "articles": [ ... ]
  }
}
```

### **GET /orders/{id}**
Détail d'une commande (propriétaire ou admin).

### **GET /orders** (Admin uniquement)
Liste de toutes les commandes.

### **PUT /orders/{id}/status** (Admin uniquement)
Modifier le statut d'une commande.

**Paramètres :**
```json
{
  "statut": "expediee"
}
```

**Statuts possibles :**
- `en_attente` - En attente
- `confirmee` - Confirmée
- `en_preparation` - En préparation
- `expediee` - Expédiée
- `livree` - Livrée
- `annulee` - Annulée

### **PUT /orders/{id}/payment** (Admin uniquement)
Modifier le statut de paiement.

**Paramètres :**
```json
{
  "statut_paiement": "paye"
}
```

**Statuts possibles :**
- `en_attente` - En attente
- `paye` - Payé
- `rembourse` - Remboursé
- `echec` - Échec

## 👥 **Utilisateurs**

### **GET /users/profile**
Profil de l'utilisateur connecté (token requis).

### **PUT /users/profile**
Modifier le profil (token requis).

**Paramètres :**
```json
{
  "nom": "Nouveau Nom",
  "prenom": "Nouveau Prénom",
  "telephone": "01 23 45 67 89",
  "adresse": "Nouvelle adresse",
  "ville": "Nouvelle ville",
  "code_postal": "12345"
}
```

### **GET /users** (Admin uniquement)
Liste de tous les utilisateurs.

### **GET /users/{id}** (Admin uniquement)
Détail d'un utilisateur.

### **PUT /users/{id}** (Admin uniquement)
Modifier un utilisateur.

### **DELETE /users/{id}** (Admin uniquement)
Supprimer un utilisateur.

### **PUT /users/{id}/toggle-status** (Admin uniquement)
Activer/désactiver un utilisateur.

## 📊 **Tableau de Bord (Admin)**

### **GET /dashboard/stats**
Statistiques générales (admin uniquement).

**Réponse :**
```json
{
  "success": true,
  "data": {
    "total_commandes": 150,
    "commandes_confirmees": 120,
    "commandes_livrees": 100,
    "chiffre_affaires": 25000.00,
    "panier_moyen": 85.50
  }
}
```

### **GET /dashboard/recent-orders**
Commandes récentes (admin uniquement).

### **GET /dashboard/top-products**
Produits les plus vendus (admin uniquement).

### **GET /dashboard/low-stock**
Produits avec stock faible (admin uniquement).

## 🔧 **Utilitaires**

### **GET /health**
Vérification de l'état de l'API.

**Réponse :**
```json
{
  "status": "OK",
  "message": "API Laravel E-commerce fonctionne correctement",
  "timestamp": "2024-01-01T12:00:00.000000Z",
  "version": "1.0.0",
  "database": "PostgreSQL",
  "framework": "Laravel 10.x"
}
```

### **GET /config**
Configuration publique de l'application.

**Réponse :**
```json
{
  "app_name": "Plateforme E-commerce",
  "pagination_per_page": 12,
  "max_file_size": 10240,
  "supported_image_types": ["jpg", "jpeg", "png", "webp"],
  "currency": "EUR",
  "currency_symbol": "€",
  "timezone": "Europe/Paris",
  "locale": "fr"
}
```

## ❌ **Codes d'Erreur**

- **200** - Succès
- **201** - Créé avec succès
- **400** - Requête invalide
- **401** - Non authentifié
- **403** - Accès refusé
- **404** - Ressource non trouvée
- **422** - Erreurs de validation
- **500** - Erreur serveur

## 🔄 **Exemples d'Utilisation**

### **Authentification complète**
```javascript
// 1. Connexion
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'client@test.com',
    motdepasse: 'client123'
  })
});

const { token } = await loginResponse.json();

// 2. Utilisation du token
const productsResponse = await fetch('/api/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### **Création de commande**
```javascript
const orderData = {
  mode_paiement: 'avant_livraison',
  nom_livraison: 'Dupont',
  prenom_livraison: 'Jean',
  adresse_livraison: '123 Rue de la Paix',
  ville_livraison: 'Paris',
  code_postal_livraison: '75001',
  articles: [
    { product_id: 1, quantite: 1 },
    { product_id: 2, quantite: 2 }
  ]
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(orderData)
});
```

---

Cette documentation couvre tous les endpoints disponibles dans l'API Laravel de la plateforme e-commerce.