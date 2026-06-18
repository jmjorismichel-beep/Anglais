# Templates d'emails Supabase — EnglishPath
# Copiez chaque template dans Supabase → Authentication → Email Templates

## ══════════════════════════════════════════════════════════
## 1. CONFIRMATION D'INSCRIPTION ("Confirm signup")
## ══════════════════════════════════════════════════════════

### Objet (Subject) :
Confirmez votre inscription sur EnglishPath 📚

### Corps (Body HTML) :
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f4ff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:56px;height:56px;background:#185FA5;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
        <span style="font-size:28px;">📚</span>
      </div>
      <div style="font-size:22px;font-weight:700;color:#185FA5;">EnglishPath</div>
      <div style="font-size:12px;color:#9ca3af;">Programme Navigate A1–B1+</div>
    </div>

    <!-- Card -->
    <div style="background:#fff;border-radius:16px;padding:32px;border:0.5px solid #e5e7eb;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">Bienvenue sur EnglishPath ! 🎉</h1>
      <p style="font-size:15px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
        Votre compte a été créé avec succès. Pour activer votre accès à la plateforme, cliquez sur le bouton ci-dessous.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:28px 0;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#185FA5;color:#fff;font-size:16px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.02em;">
          ✅ Confirmer mon email
        </a>
      </div>

      <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0 0 20px;">
        Ce lien est valable pendant <strong>24 heures</strong>.
      </p>

      <hr style="border:none;border-top:0.5px solid #f3f4f6;margin:20px 0;">

      <!-- Ce qui vous attend -->
      <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 12px;">Ce qui vous attend sur EnglishPath :</p>
      <div style="display:grid;gap:8px;">
        <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#374151;">
          <span style="font-size:16px;">🎯</span> Exercices interactifs A1 → B1+
        </div>
        <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#374151;">
          <span style="font-size:16px;">🤖</span> Assistant IA pédagogique
        </div>
        <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#374151;">
          <span style="font-size:16px;">📱</span> Disponible hors ligne sur mobile
        </div>
        <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#374151;">
          <span style="font-size:16px;">🏆</span> Badges et suivi de progression
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:20px;">
      🔒 Vos données sont protégées · Conforme RGPD<br>
      Si vous n'avez pas créé ce compte, ignorez cet email.
    </p>
    <p style="text-align:center;font-size:11px;color:#c4c4c4;margin-top:8px;">
      Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
      <a href="{{ .ConfirmationURL }}" style="color:#185FA5;word-break:break-all;">{{ .ConfirmationURL }}</a>
    </p>
  </div>
</body>
</html>


## ══════════════════════════════════════════════════════════
## 2. RÉINITIALISATION MOT DE PASSE ("Reset password")
## ══════════════════════════════════════════════════════════

### Objet (Subject) :
Réinitialisation de votre mot de passe EnglishPath 🔑

### Corps (Body HTML) :
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f4ff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:56px;height:56px;background:#185FA5;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
        <span style="font-size:28px;">📚</span>
      </div>
      <div style="font-size:22px;font-weight:700;color:#185FA5;">EnglishPath</div>
    </div>

    <div style="background:#fff;border-radius:16px;padding:32px;border:0.5px solid #e5e7eb;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <div style="text-align:center;margin-bottom:20px;">
        <span style="font-size:48px;">🔑</span>
      </div>
      <h1 style="font-size:20px;font-weight:700;margin:0 0 8px;">Réinitialisation de mot de passe</h1>
      <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
        Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau.
      </p>

      <div style="text-align:center;margin:28px 0;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#185FA5;color:#fff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
          🔑 Créer un nouveau mot de passe
        </a>
      </div>

      <div style="background:#FAEEDA;border-radius:8px;padding:12px 16px;font-size:12px;color:#412402;">
        ⚠️ Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email — votre mot de passe ne sera pas modifié.
      </div>
    </div>

    <p style="text-align:center;font-size:11px;color:#c4c4c4;margin-top:16px;">
      Si le bouton ne fonctionne pas :<br>
      <a href="{{ .ConfirmationURL }}" style="color:#185FA5;word-break:break-all;">{{ .ConfirmationURL }}</a>
    </p>
  </div>
</body>
</html>


## ══════════════════════════════════════════════════════════
## 3. CHANGEMENT D'EMAIL ("Change email address")
## ══════════════════════════════════════════════════════════

### Objet (Subject) :
Confirmez votre nouvelle adresse email — EnglishPath

### Corps (Body HTML) :
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f0f4ff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:16px;padding:32px;">
      <h1 style="font-size:20px;margin:0 0 12px;">📧 Changement d'adresse email</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Vous avez demandé à modifier votre adresse email sur EnglishPath. Cliquez ci-dessous pour confirmer.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="{{ .ConfirmationURL }}" style="background:#185FA5;color:#fff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
          Confirmer ma nouvelle adresse
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3af;">Ce lien expire dans 24 heures.</p>
    </div>
  </div>
</body>
</html>


## ══════════════════════════════════════════════════════════
## INSTRUCTIONS DE CONFIGURATION
## ══════════════════════════════════════════════════════════

# Dans Supabase :
# 1. Authentication → Email Templates
# 2. Sélectionnez chaque template ("Confirm signup", "Reset password", "Change email address")
# 3. Modifiez le "Subject" et le "Body"
# 4. Sauvegardez

# Note : {{ .ConfirmationURL }} est la variable Supabase pour le lien de confirmation.
# Ne la modifiez pas — elle sera automatiquement remplacée par le vrai lien.
