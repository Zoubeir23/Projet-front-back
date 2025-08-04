# Architecture Technique - Plateforme E-commerce

## 🏗️ **Vue d'ensemble de l'architecture**

Cette plateforme e-commerce suit une architecture moderne **API-First** avec séparation complète entre le backend et le frontend.

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │   Backend       │
│   React SPA     │     REST API    │   Laravel API   │
│   Port: 3000    │                 │   Port: 3001    │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   Database      │
                                    │   Port: 5432    │
                                    └─────────────────┘
```

## 🎯 **Backend - Laravel 10 + PostgreSQL**

### **Architecture en Couches**

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Controllers │  │ Middleware  │  │ Resources   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Business Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Services   │  │  Requests   │  │ Validation  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Models    │  │ Migrations  │  │ Factories   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### **Composants Principaux**

#### 🎮 **Contrôleurs (Controllers)**
- `AuthController` - Authentification JWT
- `ProductController` - Gestion des produits avec filtres avancés
- `CategoryController` - Gestion des catégories hiérarchiques
- `OrderController` - Gestion des commandes et paiements
- `UserController` - Gestion des utilisateurs et profils

#### 🛡️ **Middlewares**
- `AdminMiddleware` - Protection des routes administrateur
- `JWTAuth` - Authentification par tokens JWT
- `CORS` - Gestion des requêtes cross-origin

#### 📊 **Resources (Sérialisation)**
- `ProductResource` - Formatage des données produits
- `OrderResource` - Formatage des commandes avec détails
- `UserResource` - Formatage des profils utilisateurs
- `CategoryResource` - Formatage des catégories avec hiérarchie

#### 🏗️ **Services (Logique Métier)**
- `OrderService` - Logique complexe des commandes
  - Création de commandes avec vérification de stock
  - Gestion des statuts et paiements
  - Calculs automatiques des totaux
  - Annulation avec remise en stock

#### 🗄️ **Modèles Eloquent**
- `User` - Utilisateurs avec rôles (client/admin)
- `Product` - Produits avec promotions et stock
- `Category` - Catégories hiérarchiques
- `Order` - Commandes avec statuts multiples
- `OrderItem` - Articles de commande avec historique

### **Base de Données PostgreSQL**

#### **Schéma Relationnel**
```sql
Users (1) ──────────── (*) Orders (1) ──────────── (*) OrderItems
  │                                                        │
  │                                                        │
  └─── Profiles                                           │
                                                          │
Categories (1) ──────── (*) Products ◄──────────────────┘
    │                       │
    └── (hiérarchie)        └── Images (JSON)
```

#### **Tables Principales**
- **users** - Utilisateurs avec authentification
- **categories** - Catégories avec hiérarchie parent/enfant
- **products** - Produits avec stock, prix, promotions
- **orders** - Commandes avec adresses et statuts
- **order_items** - Articles de commande avec historique prix
- **cart_sessions** - Sessions de panier (optionnel)

#### **Index Optimisés**
- Index composites sur (actif, category_id) pour les produits
- Index sur les statuts de commandes
- Index full-text pour la recherche produits
- Index sur les dates pour les rapports

## 🎨 **Frontend - React 18**

### **Architecture Composants**

```
App.js
├── BarreNavigation
├── Routes
│   ├── Pages Publiques
│   │   ├── Accueil
│   │   ├── Produits
│   │   ├── DetailProduit
│   │   ├── Connexion
│   │   └── Inscription
│   └── Pages Protégées
│       ├── Profil
│       ├── Panier
│       ├── Commande
│       ├── MesCommandes
│       └── TableauBordAdmin
└── Contextes
    ├── ContexteAuth
    └── ContextePanier
```

### **Gestion d'État**
- **Context API** - État global partagé
- **localStorage** - Persistance du panier et auth
- **Axios Interceptors** - Gestion automatique des tokens

### **Styles CSS**
- **CSS Modulaire** - Un fichier par composant
- **Variables CSS** - Cohérence du design system
- **Responsive Design** - Mobile-first approach
- **Animations CSS** - Transitions fluides

## 🔐 **Sécurité**

### **Authentification JWT**
```
1. Login → Backend vérifie credentials
2. Backend génère JWT token (60min TTL)
3. Frontend stocke token en localStorage
4. Chaque requête inclut: Authorization: Bearer <token>
5. Backend valide token via middleware
6. Refresh automatique avant expiration
```

### **Autorisation**
- **Rôles utilisateurs** - client/admin
- **Middleware Admin** - Protection routes sensibles
- **Validation côté serveur** - Toutes les données
- **Sanitisation** - Protection XSS

### **Protection des Données**
- **Hachage bcrypt** - Mots de passe sécurisés
- **Validation stricte** - Form Requests Laravel
- **Eloquent ORM** - Protection injections SQL
- **HTTPS Ready** - Configuration SSL

## ⚡ **Performance**

### **Backend**
- **Pagination** - Chargement par pages (12 items)
- **Eager Loading** - Relations chargées efficacement
- **Index DB** - Requêtes optimisées
- **Cache Redis** - Mise en cache des données fréquentes

### **Frontend**
- **Code Splitting** - Chargement à la demande
- **Lazy Loading** - Images et composants
- **Memoization** - Optimisation re-renders
- **Bundle Optimization** - Webpack optimisé

### **Base de Données**
- **Index Composites** - Requêtes multi-critères
- **Requêtes Optimisées** - N+1 évité
- **Connection Pooling** - Gestion des connexions
- **Query Caching** - Cache des requêtes fréquentes

## 🚀 **Déploiement**

### **Environnements**
- **Développement** - Local avec Docker optionnel
- **Test** - CI/CD avec tests automatisés
- **Production** - Serveur avec HTTPS et CDN

### **Configuration**
- **Variables d'environnement** - Configuration flexible
- **Migrations** - Déploiement base de données
- **Seeders** - Données initiales
- **Assets** - Compilation et optimisation

## 📊 **Monitoring & Logs**

### **Logs Laravel**
- **Authentification** - Tentatives de connexion
- **Erreurs API** - Stack traces détaillées
- **Performance** - Temps de réponse
- **Sécurité** - Tentatives d'intrusion

### **Métriques**
- **Commandes** - Volume et conversion
- **Utilisateurs** - Inscription et activité
- **Produits** - Vues et ventes
- **Performance** - Temps de chargement

## 🔄 **API RESTful**

### **Endpoints Principaux**
```
Authentication:
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me

Products:
GET    /api/products              # Liste avec filtres
GET    /api/products/{id}         # Détail produit
POST   /api/products              # Créer (admin)
PUT    /api/products/{id}         # Modifier (admin)
DELETE /api/products/{id}         # Supprimer (admin)

Orders:
GET    /api/orders/my-orders      # Mes commandes
POST   /api/orders                # Créer commande
GET    /api/orders                # Toutes (admin)
PUT    /api/orders/{id}/status    # Changer statut (admin)

Categories:
GET    /api/categories            # Liste hiérarchique
POST   /api/categories            # Créer (admin)
PUT    /api/categories/{id}       # Modifier (admin)
DELETE /api/categories/{id}       # Supprimer (admin)
```

### **Format des Réponses**
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... },
  "message": "Opération réussie"
}
```

## 🧪 **Tests**

### **Tests Backend**
- **Unit Tests** - Modèles et services
- **Feature Tests** - Endpoints API
- **Integration Tests** - Base de données
- **Security Tests** - Authentification

### **Tests Frontend**
- **Component Tests** - React Testing Library
- **Integration Tests** - API calls
- **E2E Tests** - Cypress (optionnel)
- **Visual Tests** - Storybook (optionnel)

## 📈 **Évolutivité**

### **Extensibilité**
- **Microservices Ready** - API découplée
- **Plugin System** - Ajout de fonctionnalités
- **Multi-tenant** - Support multi-boutiques
- **Internationalization** - Support multi-langues

### **Scalabilité**
- **Load Balancing** - Répartition de charge
- **Database Sharding** - Partitionnement données
- **CDN Integration** - Distribution contenu
- **Caching Strategy** - Mise en cache multi-niveaux

---

Cette architecture garantit une **maintenabilité**, **sécurité** et **performance** optimales pour une plateforme e-commerce professionnelle.