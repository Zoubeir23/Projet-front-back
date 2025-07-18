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
- Node.js + Express.js
- MongoDB + Mongoose
- JWT pour l'authentification
- PDFKit pour la génération de factures
- Nodemailer pour les emails
- bcryptjs pour le hachage des mots de passe

### Frontend
- React 18
- React Router pour la navigation
- Axios pour les appels API
- Context API pour la gestion d'état
- CSS modulaire séparé

## Structure des Fichiers (Français)

```
plateforme-ecommerce/
├── backend/
│   ├── modeles/             # Modèles MongoDB
│   ├── routes/              # Routes API
│   ├── middleware/          # Middlewares (auth, etc.)
│   ├── utilitaires/         # Utilitaires (PDF, email)
│   └── app.js              # Configuration Express
├── frontend/
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
│   │   ├── styles/          # Fichiers CSS séparés
│   │   │   ├── BarreNavigation.css
│   │   │   ├── Accueil.css
│   │   │   ├── Formulaires.css
│   │   │   ├── Produits.css
│   │   │   ├── Panier.css
│   │   │   ├── DetailProduit.css
│   │   │   ├── Commande.css
│   │   │   ├── MesCommandes.css
│   │   │   ├── Profil.css
│   │   │   └── TableauBordAdmin.css
│   │   └── App.js           # Composant principal
│   └── public/
│       └── index.html       # HTML en français
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

La plateforme propose **3 méthodes différentes** pour lancer l'application selon vos besoins :

### 🚀 Méthode 1 : Démarrage Automatique (Recommandé)
**Fichier :** `demarrer.bat`

```bash
# Double-cliquer sur demarrer.bat ou exécuter :
demarrer.bat
```

**Avantages :**
- ✅ Vérifie et installe automatiquement toutes les dépendances
- ✅ Lance backend et frontend dans des terminaux séparés
- ✅ Fonctionne sur tous les systèmes Windows
- ✅ Le plus complet et robuste
- ✅ Parfait pour la première installation

**Utilisation :** Idéal pour les nouveaux utilisateurs ou après un `git pull`

### ⚡ Méthode 2 : Démarrage Manuel Rapide
**Fichier :** `demarrer-manuel.bat`

```bash
# Double-cliquer sur demarrer-manuel.bat ou exécuter :
demarrer-manuel.bat
```

**Avantages :**
- ✅ Plus rapide si les dépendances sont déjà installées
- ✅ Utilise `npm run installer-tout` (script personnalisé)
- ✅ Bon pour le développement quotidien
- ✅ Moins de vérifications = démarrage plus rapide

**Utilisation :** Parfait pour le développement quotidien quand tout est déjà configuré

### 🎨 Méthode 3 : Démarrage PowerShell (Interface Moderne)
**Fichier :** `demarrer.ps1`

```powershell
# Clic droit > "Exécuter avec PowerShell" ou :
.\demarrer.ps1
```

**Avantages :**
- ✅ Interface colorée et moderne
- ✅ Même fonctionnalité que le script principal
- ✅ Messages d'état plus clairs
- ✅ Expérience utilisateur améliorée

**Prérequis :** PowerShell (activé par défaut sur Windows 10/11)

**Utilisation :** Pour une expérience visuelle plus agréable

### 📋 Comparaison des Scripts

| Script | Vitesse | Vérifications | Interface | Usage Recommandé |
|--------|---------|---------------|-----------|------------------|
| `demarrer.bat` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Première installation, usage général |
| `demarrer-manuel.bat` | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Développement quotidien |
| `demarrer.ps1` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Expérience utilisateur moderne |

### 🔧 Méthode Alternative : Ligne de Commande
Si vous préférez la ligne de commande traditionnelle :

```bash
# Installer toutes les dépendances
npm run installer-tout

# Lancer l'application complète
npm run dev
```

## URLs d'Accès
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:3001

## Comptes de Test

Après avoir exécuté le script de données de test :
- **Administrateur :** admin@ecommerce.com / admin123
- **Client :** client@test.com / client123

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

## Contributeurs
- Groupe de 3 étudiants IAGE DK 2025

## Licence
Projet académique - IAGE 2025

---

**Note :** Cette plateforme e-commerce est entièrement développée en français, avec une architecture moderne et une séparation claire entre la logique métier, les styles CSS et les composants JavaScript.