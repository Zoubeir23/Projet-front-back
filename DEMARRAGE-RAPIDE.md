# 🚀 Démarrage Rapide - Plateforme E-commerce

## Méthode 1 : Script Automatique (Recommandé)

1. **Double-cliquez sur `demarrer.bat`**
   - Installe automatiquement toutes les dépendances
   - Crée les données de test
   - Lance backend et frontend simultanément

## Méthode 2 : Script Manuel (2 terminaux)

1. **Double-cliquez sur `demarrer-manuel.bat`**
   - Ouvre 2 terminaux séparés
   - Un pour le backend, un pour le frontend
   - Plus facile pour voir les logs séparément

## Méthode 3 : Commandes Manuelles

```bash
# 1. Installer les dépendances
npm run installer-tout

# 2. Créer les données de test
cd backend
npm run seed
cd ..

# 3a. Démarrage simultané (nécessite concurrently)
npm run dev

# OU 3b. Démarrage séparé (2 terminaux)
# Terminal 1:
npm run serveur

# Terminal 2:
npm run client
```

## Prérequis

- ✅ Node.js (v16+)
- ✅ MongoDB (démarré)
- ✅ Git

## Vérification

Une fois démarré, vérifiez :
- Backend : http://localhost:3001
- Frontend : http://localhost:3000

## Comptes de Test

- **Admin :** admin@ecommerce.com / admin123
- **Client :** client@test.com / client123

## Résolution de Problèmes

### Erreur "concurrently not found"
```bash
npm install
npm run dev
```

### Erreur MongoDB
- Vérifiez que MongoDB est démarré
- Vérifiez la connexion dans `backend/.env`

### Port déjà utilisé
- Backend : Changez le port dans `backend/.env`
- Frontend : Il vous sera proposé un autre port automatiquement

## Structure des Dossiers

```
plateforme-ecommerce/
├── demarrer.bat           # Script automatique
├── demarrer-manuel.bat    # Script 2 terminaux
├── backend/               # API Node.js
├── frontend/              # Interface React
└── README.md             # Documentation complète
```

---

**Besoin d'aide ?** Consultez le `README.md` pour la documentation complète.