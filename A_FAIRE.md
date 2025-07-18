# À faire pour continuer le projet

## 1. Installer et lancer MongoDB
- Télécharger MongoDB Community Server : https://www.mongodb.com/try/download/community
- Installer et lancer le serveur (`mongod`)

## 2. Vérifier la connexion à la base de données
- S’assurer que le backend se connecte bien à MongoDB (voir la console du backend)

## 3. Ajouter des fonctionnalités ou corriger des bugs
- Compléter les pages ou composants manquants dans `frontend/src/pages` ou `frontend/src/components`
- Ajouter des validations, messages d’erreur, etc.
- Améliorer la gestion des rôles (admin/client)
- Ajouter des tests (unitaires, intégration)

## 4. Déploiement
- Préparer un fichier `.env` pour la production
- Adapter la configuration MongoDB si besoin
- Utiliser un service comme Heroku, Vercel, ou un VPS

## 5. Documentation
- Lire `DOCUMENTATION.md` pour comprendre la structure et le fonctionnement
- Mettre à jour la documentation si des modifications sont apportées

## 6. Conseils
- Toujours vérifier que MongoDB est lancé avant de démarrer le backend
- Utiliser les comptes de test pour valider les fonctionnalités
- Consulter les scripts d’initialisation dans `backend/scripts/seed.js` pour réinitialiser la base 