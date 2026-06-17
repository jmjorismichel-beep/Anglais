# EnglishPath — Plateforme pédagogique d'anglais
## Programme Navigate A1–B1 | RÉCIFE / Groupement #AVENIR | Région Normandie

---

## 🚀 Déploiement GitHub → Netlify (automatique)

### Étape 1 — Créer le dépôt GitHub

1. Allez sur [github.com](https://github.com) → **New repository**
2. Nommez-le `englishpath` (ou autre)
3. Laissez-le **Public** ou **Private** selon votre choix
4. **Ne cochez rien** (pas de README, pas de .gitignore — ils sont déjà inclus)
5. Cliquez **Create repository**

### Étape 2 — Pousser le code

Décompressez l'archive, puis dans un terminal :

```bash
# Entrez dans le dossier
cd englishpath

# Initialisez Git
git init
git add .
git commit -m "Initial commit — EnglishPath plateforme pédagogique"

# Connectez à votre dépôt GitHub (remplacez l'URL)
git remote add origin https://github.com/VOTRE-USERNAME/englishpath.git
git branch -M main
git push -u origin main
```

### Étape 3 — Connecter Netlify

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project**
3. Choisissez **GitHub** → sélectionnez votre dépôt `englishpath`
4. Netlify détecte automatiquement le `netlify.toml` — **rien à configurer**
5. Cliquez **Deploy site**

✅ En 2 minutes votre site est en ligne sur `https://xxxxx.netlify.app`

### Étape 4 — Domaine personnalisé (optionnel)

Dans Netlify → **Domain settings** → **Add custom domain** :
- `pharenumeriquehavre.fr` ou `englishpath.recife.fr` ou autre

---

## 🔄 Mises à jour automatiques

Après chaque modification de code :

```bash
git add .
git commit -m "Description de la modification"
git push
```

→ Netlify rebuild et redéploie **automatiquement** en 1–2 minutes.

---

## 📁 Structure du projet

```
englishpath/
├── netlify.toml              ← Config Netlify (build + redirects SPA)
├── .nvmrc                    ← Node.js version (20)
├── .gitignore                ← Exclut node_modules, dist, .env
├── package.json              ← Dépendances React + scripts
├── vite.config.js            ← Config Vite (bundler)
├── tailwind.config.js        ← CSS framework
├── index.html                ← Point d'entrée HTML
├── public/
│   ├── manifest.json         ← PWA (installation mobile)
│   └── sw.js                 ← Service Worker (hors ligne)
└── src/
    ├── main.jsx              ← Montage React
    ├── App.jsx               ← Routeur de pages
    ├── styles/globals.css    ← Design tokens CSS
    ├── data/courseData.js    ← Programme Navigate A1-B1 (votre tableur)
    ├── lib/
    │   ├── store.js          ← État global (auth, XP, progression)
    │   └── useAI.js          ← Intégration API Claude (IA pédagogique)
    ├── components/
    │   ├── UI.jsx            ← Composants réutilisables
    │   └── Layout.jsx        ← Navbar + Sidebar + Nav mobile
    └── pages/
        ├── Auth.jsx          ← Connexion / Inscription / Mot de passe
        ├── Dashboard.jsx     ← Tableau de bord apprenant
        ├── Modules.jsx       ← Modules Navigate A1-B1
        ├── Exercises.jsx     ← Exercices interactifs
        └── OtherPages.jsx    ← IA, Formateur, Impression, Stats, Paramètres
```

---

## ⚙️ Variables d'environnement Netlify (optionnel)

Pour l'assistant IA en production indépendante, dans Netlify :
**Site settings → Environment variables → Add variable**

```
VITE_ANTHROPIC_KEY = sk-ant-xxxxx
```

> ℹ️ Sur claude.ai, la clé est gérée automatiquement.

---

## 🗄️ Connecter Supabase (base de données)

Pour passer de la démo aux vraies données utilisateurs :

### 1. Créer un projet sur [supabase.com](https://supabase.com)

### 2. Installer
```bash
npm install @supabase/supabase-js
```

### 3. Créer `src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  'https://VOTRE-ID.supabase.co',
  'VOTRE_ANON_KEY'
)
```

### 4. Ajouter dans Netlify → Environment variables
```
VITE_SUPABASE_URL = https://VOTRE-ID.supabase.co
VITE_SUPABASE_ANON_KEY = eyJxxx...
```

### 5. Tables SQL à créer dans Supabase
```sql
create table learners (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  first_name text,
  last_name text,
  level text default 'A1',
  xp integer default 0,
  streak integer default 0,
  current_unit integer default 1,
  created_at timestamp default now()
);

create table progress (
  id uuid default gen_random_uuid() primary key,
  learner_id uuid references learners(id) on delete cascade,
  unit_id integer,
  chapter_id text,
  score integer,
  completed_at timestamp default now()
);

create table groups (
  id uuid default gen_random_uuid() primary key,
  name text,
  trainer_id uuid,
  level text,
  created_at timestamp default now()
);

-- Activer RLS (RGPD)
alter table learners enable row level security;
alter table progress enable row level security;
```

---

## 🎨 Personnalisation rapide

### Changer le nom du centre / logo
Dans `src/pages/OtherPages.jsx`, cherchez `RÉCIFE` et remplacez par votre centre.

### Modifier les couleurs
Dans `src/styles/globals.css` :
```css
:root {
  --blue: #185FA5;   /* Couleur principale — à changer */
  --teal: #1D9E75;   /* Succès */
}
```

### Ajouter des unités / exercices
Dans `src/data/courseData.js` — tout est commenté et structuré.

---

## 📱 PWA — Installation mobile

Sur **iPhone** : Safari → Partager → "Sur l'écran d'accueil"  
Sur **Android** : Chrome → Menu ⋮ → "Ajouter à l'écran d'accueil"  
Sur **PC** : Chrome → icône ＋ dans la barre d'adresse

---

*Plateforme créée pour RÉCIFE / Groupement #AVENIR du Havre — Dispositif #AVENIR Région Normandie*
