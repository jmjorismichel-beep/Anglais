# EnglishPath — Version définitive
## Plateforme pédagogique d'anglais A1–B1 | RÉCIFE / Groupement #AVENIR

---

## 🚀 Déploiement GitHub → Netlify

```bash
# 1. Dans le dossier englishpath/
git init
git add .
git commit -m "Initial commit — EnglishPath v2"
git remote add origin https://github.com/jmjorismichel-beep/englishpath.git
git branch -M main
git push -u origin main
```

Sur Netlify → Add new site → GitHub → sélectionnez le dépôt.
Le fichier `netlify.toml` configure tout automatiquement.

---

## ⚙️ Variables d'environnement à configurer sur Netlify

Netlify → Site settings → Environment variables :

```
VITE_SUPABASE_URL       = https://VOTRE-ID.supabase.co
VITE_SUPABASE_ANON_KEY  = eyJxxx...
ANTHROPIC_API_KEY       = sk-ant-xxx...   ← clé serveur (fonctions Netlify)
```

---

## 🗄️ Base de données Supabase

1. Créez un projet sur supabase.com
2. SQL Editor → New query → copiez-collez `supabase-schema.sql`
3. Exécutez — toutes les tables, RLS, fonctions et triggers sont créés

---

## ✅ Ce qui est inclus (version définitive)

### Auth & Sécurité
- Inscription avec double vérification email + mot de passe
- Indicateur force mot de passe
- Supabase Auth (JWT, sessions sécurisées)
- Récupération mot de passe par email
- RGPD : export + suppression compte

### Pédagogie
- Programme Navigate A1–B1 complet (Units 1–12)
- 100+ exercices (QCM, trous, association, prononciation, vocabulaire)
- Répétition espacée (algorithme SM-2)
- Audio TTS Web Speech API (lecture des mots)
- Reconnaissance vocale pour exercices de prononciation

### IA pédagogique
- Assistant Claude via fonction serverless Netlify (clé sécurisée)
- Correction de phrases, traduction, génération d'exercices
- Conseils de prononciation avec phonétique IPA

### Formateur
- Suivi individuel et collectif avec alertes décrochage
- Export Excel réel (SheetJS) avec toutes les stats
- Messagerie interne formateur ↔ apprenant
- Assignation d'exercices par groupe

### Impression
- Génération HTML/PDF : fiches exercices, cartes vocab, évaluations
- Attestations personnalisées avec logo du centre
- Formats A4 portrait/paysage, couleur/N&B

### Technique
- Supabase (auth + base de données + stockage)
- PWA + Service Worker (mode hors ligne)
- Synchronisation offline automatique
- Chunking optimisé (chargement rapide)
- Headers sécurité Netlify
- Responsive mobile-first

---

## 📁 Structure

```
englishpath/
├── netlify.toml                    ← Config build + redirects + headers sécurité
├── supabase-schema.sql             ← Schéma complet à coller dans Supabase
├── netlify/functions/
│   ├── ai-chat.js                  ← API Claude (serverless, clé sécurisée)
│   └── generate-pdf.js             ← Génération PDF côté serveur
└── src/
    ├── lib/
    │   ├── supabase.js             ← Client + helpers auth/progress/trainer
    │   ├── store.js                ← État global Zustand + Supabase sync
    │   └── useAI.js                ← Hook IA + TTS + reconnaissance vocale
    ├── hooks/
    │   └── usePDF.js               ← Génération PDF + export Excel
    ├── data/
    │   ├── courseData.js           ← Programme Navigate (tableur Google Sheets)
    │   └── exercises/exerciseBank.js ← 100+ exercices + répétition espacée
    └── pages/
        ├── Auth.jsx                ← Login / Register / Forgot password
        ├── Dashboard.jsx           ← Tableau de bord
        ├── Modules.jsx             ← Modules Navigate A1–B1
        ├── Exercises.jsx           ← Exercices + répétition espacée + prononciation
        ├── TrainerPage.jsx         ← Formateur + Excel export + messagerie
        ├── PrintPage.jsx           ← Impression pédagogique (PDF réel)
        └── OtherPages.jsx          ← IA, Progression, Positionnement, Stats, Paramètres
```
