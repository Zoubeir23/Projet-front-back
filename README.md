# Plateforme E-commerce - IAGE DK 2025

## Description
Plateforme e-commerce complète développée avec Node.js/Express (backend) et React (frontend). Tous les fichiers et l'interface sont en français.

## Fonctionnalités

### Interface Client (Front-Office)
- ✅ Catalogue de produits avec filtrage et recherche
- ✅ Fiche produit détaillée avec images
- ✅ Gestion du panier (ajout, suppression, modification quantités)
- ✅ Passage de commande avec choix du mode de paiement
- ✅ Compte client (inscription, connexion, profil)
- ✅ Historique des commandes avec téléchargement de factures PDF
- ✅ Notifications par email

### Interface Administrateur (Back-Office)
- ✅ Gestion des produits (CRUD avec images)
- ✅ Gestion des catégories
- ✅ Gestion des commandes (visualisation, modification statut)
- ✅ Gestion des utilisateurs
- ✅ Suivi des paiements
- ✅ Statistiques et tableaux de bord

### Fonctionnalités Techniques
- ✅ Génération automatique de factures PDF
- ✅ Envoi d'emails automatiques
- ✅ Gestion des stocks
- ✅ Authentification JWT
- ✅ API RESTful complète
- ✅ Interface entièrement en français
- ✅ CSS séparé dans des fichiers dédiés
- ✅ JavaScript modulaire sans code inline

## Technologies Utilisées

### Backend
- **Laravel 10** - Framework PHP moderne et robuste
- **PostgreSQL 13+** - Base de données relationnelle performante
- **JWT Auth** - Authentification sécurisée avec tokens
- **Eloquent ORM** - Mapping objet-relationnel avancé
- **DomPDF** - Génération de factures PDF
- **Laravel Mail** - Système d'emails avec queues
- **Redis** - Cache et sessions haute performance
- **Intervention Image** - Traitement d'images optimisé

### Frontend
- **React 18** - Bibliothèque JavaScript moderne
- **React Router** - Navigation côté client
- **Axios** - Client HTTP pour les appels API
- **Context API** - Gestion d'état globale
- **CSS modulaire** - Styles organisés et maintenables

## Structure des Fichiers (Architecture Laravel + React)

```
plateforme-ecommerce/
├── backend/                 # Backend Laravel + PostgreSQL
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # Contrôleurs API
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Middleware/  # Middlewares personnalisés
│   │   │   │   └── AdminMiddleware.php
│   │   │   ├── Requests/    # Validation des requêtes
│   │   │   │   └── RegisterRequest.php
│   │   │   └── Resources/   # Sérialisation API
│   │   │       ├── ProductResource.php
│   │   │       ├── CategoryResource.php
│   │   │       ├── OrderResource.php
│   │   │       └── UserResource.php
│   │   ├── Models/          # Modèles Eloquent
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Category.php
│   │   │   ├── Order.php
│   │   │   └── OrderItem.php
│   │   └── Services/        # Logique métier
│   │       └── OrderService.php
│   ├── config/              # Configuration Laravel
│   │   ├── auth.php
│   │   ├── jwt.php
│   │   └── database.php
│   ├── database/
│   │   ├── migrations/      # Migrations PostgreSQL
│   │   │   ├── create_users_table.php
│   │   │   ├── create_categories_table.php
│   │   │   ├── create_products_table.php
│   │   │   ├── create_orders_table.php
│   │   │   └── create_order_items_table.php
│   │   ├── seeders/         # Données de test
│   │   │   ├── UserSeeder.php
│   │   │   ├── CategorySeeder.php
│   │   │   └── ProductSeeder.php
│   │   └── factories/       # Génération de données
│   │       ├── UserFactory.php
│   │       └── ProductFactory.php
│   ├── routes/
│   │   └── api.php          # Routes API RESTful
│   ├── .env.example         # Configuration environnement
│   └── composer.json        # Dépendances PHP
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── composants/      # Composants réutilisables
│   │   │   ├── BarreNavigation.js
│   │   │   └── RouteProtegee.js
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── Accueil.js
│   │   │   ├── Connexion.js
│   │   │   ├── Inscription.js
│   │   │   ├── Produits.js
│   │   │   ├── DetailProduit.js
│   │   │   ├── Panier.js
│   │   │   ├── Commande.js
│   │   │   ├── Profil.js
│   │   │   ├── MesCommandes.js
│   │   │   └── TableauBordAdmin.js
│   │   ├── contextes/       # Contexts React
│   │   │   ├── ContexteAuth.js
│   │   │   └── ContextePanier.js
│   │   ├── config/          # Configuration API
│   │   │   └── axios.js
│   │   ├── styles/          # CSS modulaire
│   │   │   ├── Global.css
│   │   │   ├── BarreNavigation.css
│   │   │   ├── Accueil.css
│   │   │   ├── Formulaires.css
│   │   │   ├── Produits.css
│   │   │   ├── Panier.css
│   │   │   └── [autres].css
│   │   └── App.js           # Composant principal
│   ├── public/
│   │   └── index.html
│   └── package.json         # Dépendances Node.js
├── demarrer.bat             # Script de démarrage
├── nettoyer-cache.bat       # Script de nettoyage
└── README.md
```

## Installation et Configuration

### Prérequis
- Node.js (v16+)
- MongoDB
- Git

### Installation Rapide

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd plateforme-ecommerce
```

2. **Configuration de l'environnement**

Créer un fichier `.env` dans le dossier `backend` :
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=votre_cle_secrete_jwt_ici
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
PORT=3001
```

3. **Démarrer MongoDB**
```bash
mongod
```

4. **Créer des données de test**
```bash
cd backend
npm run seed
```

## Scripts de Démarrage

### 🚀 **Démarrage Principal (Laravel + PostgreSQL)**
**Fichier :** `demarrer.bat`

```bash
# Double-cliquer sur demarrer.bat ou exécuter :
demarrer.bat
```

**Fonctionnalités :**
- ✅ **Vérification automatique** des prérequis (PHP, Composer, PostgreSQL)
- ✅ **Installation automatique** des dépendances Laravel et React
- ✅ **Configuration JWT** automatique
- ✅ **Création de la base de données** PostgreSQL
- ✅ **Exécution des migrations** et seeders
- ✅ **Démarrage simultané** backend et frontend
- ✅ **Données de test** pré-chargées

**Prérequis :**
- PHP 8.1+ avec extensions (pdo_pgsql, mbstring, openssl)
- Composer
- PostgreSQL 13+
- Node.js 16+

**Ports utilisés :**
- Backend Laravel: http://localhost:3001
- Frontend React: http://localhost:3000

### 🧹 **Script de Nettoyage**
**Fichier :** `nettoyer-cache.bat`

```bash
# En cas de problème, nettoyer le cache :
nettoyer-cache.bat
```

**Fonctionnalités :**
- ✅ Arrêt des processus Node.js en cours
- ✅ Nettoyage du cache npm
- ✅ Suppression des node_modules
- ✅ Réinstallation propre des dépendances
- ✅ Résolution des conflits de versions

### 🔧 **Commandes Laravel Utiles**

```bash
# Aller dans le dossier backend
cd backend

# Migrations et seeders
php artisan migrate:fresh --seed

# Générer une nouvelle clé JWT
php artisan jwt:secret

# Nettoyer le cache Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Lancer seulement le backend
php artisan serve --port=3001

# Lancer seulement le frontend (dans un autre terminal)
cd frontend && npm start
```

## URLs d'Accès
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:3001

## 📚 **Documentation Complète**

- **[README.md](README.md)** - Guide de démarrage et présentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture technique détaillée
- **[API.md](API.md)** - Documentation complète de l'API REST
- **[backend/README.md](backend/README.md)** - Documentation spécifique Laravel

## 🧪 **Comptes de Test**

Après avoir exécuté le script de données de test :
- **Administrateur :** admin@ecommerce.com / admin123
- **Client :** client@test.com / client123

**Données de test incluses :**
- 10+ utilisateurs générés automatiquement
- 5 catégories principales avec sous-catégories
- 50+ produits réalistes avec images, prix, stock
- Commandes d'exemple avec différents statuts

## Scripts Disponibles

```bash
# Installer toutes les dépendances (backend + frontend)
npm run installer-tout

# Lancer backend et frontend simultanément
npm run dev

# Lancer seulement le backend
npm run serveur

# Lancer seulement le frontend
npm run client

# Créer des données de test
cd backend && npm run seed

# Build du frontend pour production
npm run build
```

## API Endpoints (Français)

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/my-orders` - Commandes de l'utilisateur
- `GET /api/orders` - Toutes les commandes (admin)
- `PUT /api/orders/:id/status` - Modifier le statut (admin)
- `PUT /api/orders/:id/payment` - Marquer comme payé (admin)

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/:id` - Modifier une catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Modifier le profil
- `GET /api/users` - Liste des utilisateurs (admin)

## Fonctionnalités Avancées

### Gestion des Paiements
- Paiement avant livraison (simulation)
- Paiement après livraison (à la réception)
- Suivi du statut de paiement

### Génération de Factures
- Factures PDF automatiques en français
- Téléchargement depuis l'espace client
- Informations complètes (client, produits, total)

### Notifications Email
- Confirmation de commande
- Mise à jour du statut
- Confirmation de paiement

## Caractéristiques Techniques

### Séparation CSS/JS
- ✅ Aucun style inline dans les composants
- ✅ CSS organisé par composant/page
- ✅ JavaScript modulaire sans code inline
- ✅ Architecture propre et maintenable

### Internationalisation
- ✅ Interface entièrement en français
- ✅ Noms de fichiers en français
- ✅ Variables et fonctions en français
- ✅ Messages d'erreur en français
- ✅ Documentation en français

## Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
MONGO_URI=mongodb://votre-db-production
JWT_SECRET=secret-securise-production
EMAIL_USER=email-production
EMAIL_PASS=mot-de-passe-production
```

### Build du frontend
```bash
cd frontend
npm run build
```

## 🏆 **Fonctionnalités Avancées**

### 🔐 **Sécurité Renforcée**
- Authentification JWT avec expiration automatique
- Middleware de protection des routes administrateur
- Validation stricte côté serveur avec Form Requests
- Protection contre les injections SQL via Eloquent ORM
- Hachage sécurisé des mots de passe avec bcrypt

### ⚡ **Performance Optimisée**
- Pagination automatique des listes de produits
- Index PostgreSQL pour des requêtes rapides
- Eager loading des relations pour éviter N+1
- Cache Redis pour les données fréquemment accédées
- API Resources pour une sérialisation optimisée

### 🎨 **Design Moderne**
- Interface responsive mobile-first
- Animations CSS fluides et professionnelles
- Design system cohérent avec variables CSS
- Composants réutilisables et modulaires
- Expérience utilisateur optimisée

### 🛠️ **Outils de Développement**
- Migrations versionnées pour la base de données
- Seeders avec données réalistes pour les tests
- Factories pour la génération automatique de données
- Architecture en couches respectant les bonnes pratiques
- Code documenté et maintenable

## 🚀 **Prêt pour la Production**

Cette plateforme e-commerce respecte les standards industriels :
- ✅ Architecture scalable et maintenable
- ✅ Sécurité de niveau entreprise
- ✅ Performance optimisée
- ✅ Code documenté et testé
- ✅ Déploiement facilité

## 👥 **Contributeurs**
- Groupe de 3 étudiants IAGE DK 2025

## 📄 **Licence**
Projet académique - IAGE 2025

---

**🎯 Cette plateforme e-commerce professionnelle combine Laravel 10 + PostgreSQL pour le backend et React 18 pour le frontend, offrant une solution complète, sécurisée et évolutive pour le commerce électronique moderne.**