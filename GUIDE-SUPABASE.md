# Guide complet Supabase — EnglishPath
# Tout ce qu'il faut configurer, étape par étape

---

## PARTIE 1 — CRÉER LE PROJET

1. Allez sur https://supabase.com → Sign up (gratuit)
2. New project → choisissez un nom (ex : "englishpath") → région Europe West → mot de passe fort
3. Attendez 2 minutes que le projet se crée

---

## PARTIE 2 — CORRIGER L'EMAIL (PROBLÈME PRINCIPAL)

C'est la cause du problème : Supabase utilise son propre serveur email
par défaut, limité à 3 emails/heure. Pour un usage réel, il faut
connecter un vrai service d'envoi d'email.

### Option A — Resend (recommandé, gratuit jusqu'à 3000 emails/mois)

1. Créez un compte sur https://resend.com
2. Domains → Add domain → entrez votre domaine (ex: pharenumeriquehavre.fr)
   OU utilisez le domaine de test Resend si vous n'avez pas de domaine
3. Suivez les instructions DNS (ajoutez les enregistrements dans votre
   hébergeur de domaine)
4. API Keys → Create API Key → copiez la clé (re_xxxxx)

Dans Supabase → Project Settings → Authentication → SMTP Settings :
- Enable Custom SMTP : ON
- Host : smtp.resend.com
- Port : 465
- Username : resend
- Password : votre clé API Resend (re_xxxxx)
- Sender email : noreply@votre-domaine.fr
- Sender name : EnglishPath

### Option B — Gmail (simple mais limité)

Dans Supabase → Project Settings → Authentication → SMTP Settings :
- Host : smtp.gmail.com
- Port : 587
- Username : votre-email@gmail.com
- Password : mot de passe d'application Gmail (pas votre vrai mdp)
  → Google Account → Sécurité → Mots de passe des applications → créer un

ATTENTION : Gmail limite à 500 emails/jour.

### Option C — Sans domaine (test rapide)

Supabase → Authentication → Email Templates → désactivez la confirmation :
Project Settings → Authentication → User signups :
- "Enable email confirmations" → désactivez temporairement

Cela permet aux utilisateurs de se connecter immédiatement sans confirmer
leur email. À réactiver en production.

---

## PARTIE 3 — PERSONNALISER LES TEMPLATES D'EMAIL

Dans Supabase → Authentication → Email Templates :

### Template "Confirm signup" (confirmation d'inscription)

Objet : Confirmez votre inscription sur EnglishPath

Corps :
<h2>Bienvenue sur EnglishPath !</h2>
<p>Bonjour {{ .Email }},</p>
<p>Merci de vous être inscrit(e) sur la plateforme d'apprentissage de l'anglais.</p>
<p>Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#185FA5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
  Confirmer mon email
</a></p>
<p>Ce lien expire dans 24 heures.</p>
<p>Si vous n'avez pas créé ce compte, ignorez cet email.</p>
<br>
<p style="color:#9ca3af;font-size:12px">EnglishPath — Programme Navigate A1–B1+</p>

### Template "Reset password" (mot de passe oublié)

Objet : Réinitialisation de votre mot de passe EnglishPath

Corps :
<h2>Réinitialisation de mot de passe</h2>
<p>Bonjour,</p>
<p>Vous avez demandé à réinitialiser votre mot de passe EnglishPath.</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#185FA5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
  Créer un nouveau mot de passe
</a></p>
<p>Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
<br>
<p style="color:#9ca3af;font-size:12px">EnglishPath — Programme Navigate A1–B1+</p>

### URL de redirection (IMPORTANT)

Supabase → Authentication → URL Configuration :
- Site URL : https://votre-site.netlify.app
  (ou votre domaine personnalisé quand vous l'avez)
- Redirect URLs (ajoutez ces deux lignes) :
  https://votre-site.netlify.app
  https://votre-site.netlify.app/

---

## PARTIE 4 — BASE DE DONNÉES (schéma SQL)

Supabase → SQL Editor → New query → copiez-collez le contenu
de supabase-schema.sql → cliquez Run

Ce fichier crée :
- Table learners (profils apprenants)
- Table progress (progression par chapitre)
- Table exercise_results (résultats d'exercices)
- Table groups (groupes formateur)
- Table group_members (membres des groupes)
- Table assignments (devoirs assignés)
- Table messages (messagerie interne)
- Table favorites (exercices favoris)
- Table badges (badges gagnés)
- Table audio_files (référence des MP3)
- Toutes les politiques RLS (sécurité RGPD)
- Fonctions SQL (XP, streak, stats)
- Triggers automatiques (badges, updated_at)

---

## PARTIE 5 — STORAGE (fichiers audio et vidéo)

C'est ici que vous hébergez les MP3 du programme Navigate et les
vidéos MP4 du B1+.

### Créer les buckets

Supabase → Storage → New bucket :

1. Bucket "audio"
   - Name : audio
   - Public bucket : OUI (les apprenants doivent pouvoir écouter)
   - File size limit : 50 MB
   - Allowed MIME types : audio/mpeg, audio/mp3

2. Bucket "videos"
   - Name : videos
   - Public bucket : OUI
   - File size limit : 200 MB
   - Allowed MIME types : video/mp4

3. Bucket "documents"
   - Name : documents
   - Public bucket : OUI
   - File size limit : 100 MB
   - Allowed MIME types : application/pdf

4. Bucket "avatars"
   - Name : avatars
   - Public bucket : OUI
   - File size limit : 5 MB
   - Allowed MIME types : image/jpeg, image/png, image/webp

5. Bucket "exports"
   - Name : exports
   - Public bucket : NON (accès authentifié uniquement)
   - File size limit : 20 MB
   - Allowed MIME types : application/pdf, application/zip

### Politiques Storage (à coller dans SQL Editor)

-- Lecture publique des audio/vidéos/documents
create policy "Public audio read" on storage.objects
  for select using (bucket_id = 'audio');

create policy "Public video read" on storage.objects
  for select using (bucket_id = 'videos');

create policy "Public document read" on storage.objects
  for select using (bucket_id = 'documents');

create policy "Public avatar read" on storage.objects
  for select using (bucket_id = 'avatars');

-- Upload avatars par les utilisateurs connectés
create policy "Users upload their avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Exports : lecture uniquement par le propriétaire
create policy "Private exports" on storage.objects
  for all using (
    bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]
  );

### Uploader les fichiers audio A1

Dans Supabase → Storage → bucket "audio" → Upload files
Structure de dossiers recommandée :

audio/
├── a1/
│   ├── workbook/
│   │   ├── 1-01.mp3
│   │   ├── 1-02.mp3
│   │   └── ... (tous les MP3 workbook A1)
│   └── coursebook/
│       ├── 01-01.mp3
│       ├── 01-02.mp3
│       └── ... (tous les MP3 coursebook A1)
├── a2/
└── b1plus/
    (pas de MP3 dans votre ZIP B1+ — uniquement vidéos)

### Uploader les vidéos B1+

Dans Supabase → Storage → bucket "videos" → Upload files
Structure :

videos/
└── b1plus/
    ├── Navigate B1-plus Video Unit 1.mp4
    ├── Navigate B1-plus Video Unit 2.mp4
    ├── Navigate B1-plus Video Unit 3.mp4
    ├── Navigate B1-plus Video Unit 4.mp4
    ├── Navigate B1-plus Video Unit 5.mp4
    ├── Navigate B1-plus Video Unit 6.mp4
    ├── Navigate B1-plus Video Unit 7.mp4
    ├── Navigate B1-plus Video Unit 8.mp4
    ├── Navigate B1-plus Video Unit 9.mp4
    ├── Navigate B1-plus Video Unit 10.mp4
    ├── Navigate B1-plus Video Unit 11.mp4
    └── Navigate B1-plus Video Unit 12.mp4

TAILLE TOTALE VIDÉOS : ~370 Mo
Le plan gratuit Supabase Storage = 1 Go → suffisant.

### Uploader les PDF B1+

Dans Supabase → Storage → bucket "documents" :

documents/
└── b1plus/
    ├── Coursebook.pdf           (69 Mo)
    ├── Workbook.pdf             (17 Mo)
    ├── 1.5 Video.pdf
    ├── 2.5 Video.pdf
    ├── 3.5 Video.pdf
    ├── 4.5 Video.pdf
    ├── 5.5 Video.pdf
    ├── 6.5 Video.pdf
    ├── 7.5 Video.pdf
    ├── 8.5 Video.pdf
    ├── 9.5 Video.pdf
    ├── 10.5 Video.pdf
    ├── 11.5 Video.pdf
    └── 12.5 Video.pdf

---

## PARTIE 6 — VARIABLES D'ENVIRONNEMENT

### Récupérer vos clés Supabase

Supabase → Project Settings → API :
- Project URL → copiez (https://xxxxx.supabase.co)
- anon / public key → copiez (eyJxxx...)

### Sur Netlify

Netlify → votre site → Site configuration → Environment variables :

VITE_SUPABASE_URL         = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY    = eyJxxx...
ANTHROPIC_API_KEY         = sk-ant-xxx...

Puis Netlify → Deploys → Trigger deploy (pour recharger les variables).

### En local (.env.local — jamais commité sur GitHub)

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

---

## PARTIE 7 — AUTHENTIFICATION (paramètres importants)

Supabase → Authentication → Providers :
- Email : activé (par défaut)
- Confirm email : activé (recommandé en production)

Supabase → Authentication → Policies :
- Minimum password length : 8
- Password strength : medium

Supabase → Authentication → Rate limits :
- Email sending : 30 emails/heure (avec SMTP custom)

---

## PARTIE 8 — VÉRIFICATION FINALE

Checklist avant de lancer :

[ ] SMTP configuré (Resend ou autre) → testez en vous inscrivant
[ ] Schema SQL exécuté → vérifiez dans Table Editor
[ ] Buckets Storage créés (audio, videos, documents, avatars, exports)
[ ] Politiques Storage créées
[ ] Fichiers uploadés (MP3, MP4, PDF)
[ ] Variables Netlify configurées (URL + anon key + Anthropic key)
[ ] Site URL configurée dans Auth → URL Configuration
[ ] Templates email personnalisés

---

## PARTIE 9 — LIMITES DU PLAN GRATUIT SUPABASE

Pour référence, le plan Free inclut :
- Base de données : 500 Mo
- Storage : 1 Go
- Auth : apprenants illimités
- Edge Functions : 500k invocations/mois
- Bandwidth : 5 Go/mois

Pour EnglishPath avec une classe de 20 apprenants, le plan gratuit
est largement suffisant. Si vous dépassez (plusieurs centres, 100+
apprenants), le plan Pro est à $25/mois.

---

## RÉSUMÉ EN 10 MINUTES

1. Créer projet Supabase (2 min)
2. Configurer SMTP Resend (3 min)
3. Coller supabase-schema.sql dans SQL Editor → Run (1 min)
4. Créer 5 buckets Storage (2 min)
5. Ajouter variables Netlify + redéployer (2 min)
→ Le site envoie de vrais emails et sauvegarde les données.
