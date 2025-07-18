# Documentation complète du projet E-commerce IAGE DK 2025

## 1. Présentation générale
Bienvenue ! Ce projet est une plateforme e-commerce développée en Node.js (backend) et React (frontend). Il permet de gérer des produits, des utilisateurs, des commandes, des catégories, etc. Cette documentation est pensée pour un développeur qui découvre le projet pour la première fois.

---

## 2. Architecture du projet

```
Hanane/
├── backend/      # Serveur Node.js/Express (API, modèles, routes)
├── frontend/     # Application React (interface utilisateur)
├── demarrer.bat  # Script Windows pour tout lancer
├── demarrer.ps1  # Script PowerShell pour tout lancer
├── ...
```

- **backend/** : toute la logique serveur, la connexion à la base de données, les modèles, les routes API
- **frontend/** : tout le code React (pages, composants, contextes)
- **demarrer.bat / demarrer.ps1** : scripts pour lancer facilement le projet

---

## 3. Installation et prérequis

### a) Prérequis logiciels
- **Node.js** (https://nodejs.org/) — version 16 ou supérieure recommandée
- **npm** (installé avec Node.js)
- **MongoDB Community Server** (https://www.mongodb.com/try/download/community)

### b) Installation de MongoDB
1. Télécharge et installe MongoDB Community Server (lien ci-dessus)
2. Par défaut, MongoDB s’installe dans `C:\Program Files\MongoDB\Server\<version>\bin`
3. Pour lancer MongoDB, ouvre un terminal dans ce dossier et tape :
   ```
   .\mongod.exe
   ```
   Laisse cette fenêtre ouverte !

### c) Installation des dépendances du projet
Dans le dossier racine du projet, exécute :
- Sous Windows :
  - Double-clique sur `demarrer.bat` ou exécute `demarrer.ps1` (PowerShell)
  - Ces scripts installent tout automatiquement (backend + frontend)

---

## 4. Démarrage du projet
1. **Lance MongoDB** (voir ci-dessus)
2. **Lance le script `demarrer.bat`**
   - Deux terminaux s’ouvrent : un pour le backend (http://localhost:3001), un pour le frontend (http://localhost:3000)
3. **Ouvre ton navigateur sur** : http://localhost:3000

---

## 5. Structure détaillée des dossiers

### backend/
- **app.js** : point d’entrée principal du serveur Express
- **bin/www** : lance le serveur (utilisé par npm start)
- **models/** : modèles Mongoose (User, Product, Order, Category)
- **routes/** : routes API (auth, users, products, orders, categories)
- **middleware/** : middlewares (authentification, etc.)
- **utils/** : utilitaires (email, pdf, etc.)
- **scripts/seed.js** : script pour insérer des comptes de test

### frontend/
- **src/pages/** : pages principales (Accueil, Connexion, Inscription, etc.)
- **src/components/** : composants réutilisables
- **src/contextes/** : gestion du contexte (auth, panier)
- **src/config/** : configuration Axios
- **src/styles/** : fichiers CSS

---

## 6. Fonctionnalités principales
- Authentification (admin/client)
- Gestion des produits et catégories
- Panier d’achat
- Passer une commande
- Tableau de bord admin

---

## 7. Flux principaux (expliqués simplement)

### a) Authentification
- L’utilisateur s’inscrit ou se connecte (route `/api/auth`)
- Un token JWT est généré et stocké côté client
- Les routes protégées vérifient ce token

### b) Parcours d’achat
- L’utilisateur navigue, ajoute des produits au panier
- Il valide son panier et passe commande
- L’admin peut voir toutes les commandes

---

## 8. Comptes de test
- **Admin** : admin@ecommerce.com / admin123
- **Client** : client@test.com / client123

---

## 9. Conseils pour la reprise et le debug
- Toujours vérifier que MongoDB est lancé avant de démarrer le backend
- Si besoin, relancer le script `backend/scripts/seed.js` pour réinitialiser les comptes de test
- Les erreurs de connexion à la base sont affichées dans le terminal backend
- Utilise la console du navigateur pour les erreurs frontend

---

## 10. Bonnes pratiques et liens utiles
- Lire le code des modèles et routes pour comprendre la logique métier
- Utiliser Postman ou Insomnia pour tester les routes API
- Documentation officielle :
  - [Express](https://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [React](https://react.dev/)
  - [MongoDB](https://www.mongodb.com/docs/)

---

## 11. Pour aller plus loin
- Ajouter des tests (voir Jest, React Testing Library)
- Sécuriser les routes (middleware auth)
- Améliorer l’UX côté frontend
- Déployer sur un serveur (voir Heroku, Vercel, etc.)

---

**N’hésite pas à commenter le code, à poser des questions, et à enrichir cette documentation au fur et à mesure de tes découvertes !** 