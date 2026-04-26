# VitalPlan AI - Générateur de Plans Santé & Sport

Une application web full-stack qui génère des plans personnalisés de santé et sport en utilisant l'IA Anthropic Claude.

## 🚀 Fonctionnalités

- **Authentification Sécurisée** - Inscription/Connexion avec JWT
- **Génération IA** - Plans générés par Claude basés sur profil utilisateur
- **Formulaire Multi-Étapes** - Interface intuitive pour définir les critères
- **Tableau de Bord** - Statistiques et graphiques de suivi
- **Historique** - Accès complet aux plans générés
- **Export PDF** - Téléchargez vos plans en PDF
- **Responsive Design** - Fonctionne sur tous les appareils

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- MongoDB Atlas (compte gratuit disponible)
- Clé API Anthropic (gratuite pour les développeurs)

## 🛠️ Installation

### 1. Clonez ou téléchargez le projet

```bash
cd vitalplan-ai
```

### 2. Installez les dépendances

```bash
npm install
```

### 3. Configurez les variables d'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos informations:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vitalplan-ai?retryWrites=true&w=majority

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_token_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_here

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5000
```

### 4. Configurez MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un cluster gratuit
4. Récupérez la chaîne de connexion
5. Remplacez `MONGODB_URI` dans le fichier `.env`

### 5. Obtenez votre clé API Anthropic

1. Allez sur [Anthropic Console](https://console.anthropic.com)
2. Créez une clé API
3. Remplacez `ANTHROPIC_API_KEY` dans le fichier `.env`

## 🚀 Démarrage

### Développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

Ouvrez le frontend à: `http://localhost:5000/frontend/index.html`

### Production

```bash
npm start
```

## 📁 Structure du Projet

```
vitalplan-ai/
├── frontend/                 # Application web (HTML/CSS/JS vanilla)
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   └── animations.css
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── generator.js
│       ├── dashboard.js
│       ├── history.js
│       └── utils.js
├── backend/                  # API Express.js
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   └── services/
├── package.json
├── .env.example
└── README.md
```

## 🔌 Points Terminaux API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir token

### Utilisateur
- `GET /api/user/me` - Profil courant
- `PUT /api/user/profile` - Mettre à jour profil
- `DELETE /api/user/account` - Supprimer compte

### Plans
- `POST /api/plan/generate` - Générer un plan
- `GET /api/plan/plans` - Lister les plans
- `GET /api/plan/plans/:id` - Détails du plan
- `PUT /api/plan/plans/:id` - Mettre à jour plan
- `DELETE /api/plan/plans/:id` - Supprimer plan
- `GET /api/plan/plans/:id/export-pdf` - Télécharger PDF

### Statistiques
- `GET /api/stats/dashboard` - Statistiques tableau de bord
- `GET /api/stats/charts/plans` - Données graphiques

## 🔐 Authentification

L'application utilise JWT Bearer tokens pour l'authentification:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Access Token**: Expire après 1 heure
- **Refresh Token**: Expire après 7 jours

## 🎨 Stack Technique

### Frontend
- HTML5 vanilla
- CSS3 (variables, grilles, flexbox)
- JavaScript vanilla (fetch API)

### Backend
- Express.js 4.x
- Mongoose 7.x (MongoDB ODM)
- JWT (jsonwebtoken)
- Bcryptjs (hachage mot de passe)
- Joi (validation)
- PDFKit (génération PDF)

### IA
- Anthropic Claude API
- Modèle: claude-sonnet-4-20250514

## 📊 Rate Limiting

L'API limite les requêtes de génération:
- **5 plans par heure par utilisateur**
- Stocké en mémoire (simple, sans Redis)

## 🧪 Tester l'Application

1. **Inscription**: Cliquez sur "S'inscrire" et créez un compte
2. **Profil**: Complétez votre profil (âge, poids, taille, etc.)
3. **Génération**: Cliquez sur "Générer un plan" et suivez le formulaire multi-étapes
4. **Dashboard**: Consultez vos statistiques et plans récents
5. **Historique**: Accédez à tous vos plans générés
6. **Export**: Téléchargez un plan en PDF

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez votre `MONGODB_URI`
- Assurez-vous que votre cluster MongoDB Atlas est actif
- Vérifiez les restrictions IP dans MongoDB Atlas

### Erreur API Anthropic
- Vérifiez votre `ANTHROPIC_API_KEY`
- Vérifiez que vous avez des crédits/quota disponibles
- Vérifiez les limites de taux

### Erreur CORS
- Vérifiez que `CORS_ORIGIN` correspond à votre URL frontend
- Par défaut: `http://localhost:5000`

## 📝 Notes de Développement

- Le frontend est une SPA (Single Page Application) sans framework
- Les données utilisateur sont stockées dans localStorage
- Le rate limiting utilise la mémoire (à remplacer par Redis en production)
- Les PDFs sont générés côté serveur avec pdfkit

## 🔒 Sécurité

- ✅ Hachage des mots de passe avec bcryptjs
- ✅ Validation des entrées avec Joi
- ✅ Authentification JWT avec tokens courts
- ✅ CORS configuré
- ✅ Variables d'environnement pour les secrets

## 🚀 Déploiement

### Sur Heroku

```bash
heroku login
heroku create vitalplan-ai
heroku config:set MONGODB_URI=...
heroku config:set ANTHROPIC_API_KEY=...
git push heroku main
```

### Sur Vercel (Frontend) + Backend séparé

1. Déployez le backend sur Heroku/Railway/Render
2. Déployez le frontend sur Vercel/Netlify
3. Configurez `API_BASE_URL` dans `frontend/js/utils.js`

## 📧 Support

Pour toute question ou problème:
1. Vérifiez la console du navigateur (Frontend)
2. Vérifiez les logs du serveur (Backend)
3. Consultez les documents d'API

## 📄 Licence

MIT

## 👨‍💻 Auteur

VitalPlan AI - Développé avec ❤️ et IA

---

**Version**: 1.0.0  
**Dernière mise à jour**: Avril 2024
