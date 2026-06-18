import { useState, useEffect } from 'react'
import { Eye, EyeOff, BookOpen, Check, AlertCircle, Mail, RefreshCw, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import useStore from '../lib/store.js'

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
export function LoginPage() {
  const { setPage, demoLogin } = useStore()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email:    form.email.trim(),
        password: form.password,
      })
      if (err) {
        if (err.message.includes('Email not confirmed'))
          setError('Votre email n\'est pas encore confirmé. Vérifiez votre boîte mail.')
        else if (err.message.includes('Invalid login credentials'))
          setError('Email ou mot de passe incorrect.')
        else
          setError(err.message)
      }
      // Si OK → onAuthStateChange dans store.js prend le relais automatiquement
    } catch {
      setError('Problème de connexion. Vérifiez votre connexion internet.')
    }
    setLoading(false)
  }

  const handleDemo = () => {
    demoLogin({ firstName: 'Marie', lastName: 'Dupont', email: 'demo@englishpath.fr' })
  }

  return (
    <AuthShell title="Bienvenue sur EnglishPath" sub="Connectez-vous à votre espace d'apprentissage">
      <form onSubmit={handle}>
        <Field label="Adresse email" type="email" value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
          placeholder="votre@email.com" required />
        <Field label="Mot de passe" type={showPwd ? 'text' : 'password'}
          value={form.password}
          onChange={v => setForm(f => ({ ...f, password: v }))}
          placeholder="Votre mot de passe"
          suffix={
            <button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle} aria-label="Afficher/masquer">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          required />

        {error && <ErrorMsg msg={error} />}

        <button type="button" onClick={() => setPage('forgot')}
          style={{ fontSize: 13, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 14, display: 'block' }}>
          Mot de passe oublié ?
        </button>

        <button type="submit" disabled={loading} className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <Divider label="ou" />

      <button onClick={handleDemo} className="btn-secondary"
        style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
        🎯 Essayer en mode démo (sans inscription)
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
        Pas encore de compte ?{' '}
        <button onClick={() => setPage('register')}
          style={{ color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Créer un compte
        </button>
      </p>
    </AuthShell>
  )
}

// ─────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────
export function RegisterPage() {
  const { setPage } = useStore()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', emailConfirm: '',
    password: '', passwordConfirm: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [resending, setResending] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Le prénom est requis.'
    if (!form.lastName.trim())  e.lastName  = 'Le nom est requis.'
    if (!form.email.includes('@')) e.email  = 'Email invalide.'
    if (form.email.trim() !== form.emailConfirm.trim())
      e.emailConfirm = 'Les adresses email ne correspondent pas.'
    if (form.password.length < 8)
      e.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    if (!/[A-Z]/.test(form.password))
      e.password = (e.password ? e.password + ' ' : '') + 'Ajoutez au moins une majuscule.'
    if (form.password !== form.passwordConfirm)
      e.passwordConfirm = 'Les mots de passe ne correspondent pas.'
    return e
  }

  const handle = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setErrors({})
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email:    form.email.trim(),
        password: form.password,
        options: {
          data: { first_name: form.firstName.trim(), last_name: form.lastName.trim() },
          // URL de confirmation → redirige vers la page de login après clic
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (err) {
        if (err.message.includes('already registered') || err.message.includes('User already'))
          setErrors({ email: 'Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.' })
        else
          setErrors({ email: err.message })
      } else {
        // Créer le profil dans la table learners
        if (data.user) {
          await supabase.from('learners').upsert({
            id:         data.user.id,
            email:      form.email.trim(),
            first_name: form.firstName.trim(),
            last_name:  form.lastName.trim(),
          }, { onConflict: 'id' })
        }
        setSent(true)
      }
    } catch {
      setErrors({ email: 'Problème de connexion. Vérifiez votre internet.' })
    }
    setLoading(false)
  }

  const resendEmail = async () => {
    setResending(true)
    await supabase.auth.resend({ type: 'signup', email: form.email.trim() })
    setResending(false)
  }

  const strength = (() => {
    const p = form.password
    if (!p) return null
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return { score: s, label: ['','Faible','Moyen','Fort','Très fort'][s], color: ['','#D85A30','#BA7517','#1D9E75','#185FA5'][s] }
  })()

  // ── Écran de confirmation envoyée ────────────────────────
  if (sent) return (
    <AuthShell title="Vérifiez vos emails" sub="">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Mail size={32} color="#1D9E75" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#085041' }}>Email envoyé !</h2>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 6 }}>
          Un lien de confirmation a été envoyé à
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#185FA5', marginBottom: 20 }}>
          {form.email}
        </p>
        <div style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '1rem', textAlign: 'left', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#374151', marginBottom: 8, fontWeight: 600 }}>Que faire maintenant ?</p>
          {[
            '1. Ouvrez votre boîte mail',
            '2. Cherchez un email de EnglishPath (vérifiez les spams)',
            '3. Cliquez sur le lien de confirmation',
            '4. Vous serez redirigé vers la plateforme',
          ].map((s, i) => (
            <p key={i} style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{s}</p>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={resendEmail} disabled={resending} className="btn-secondary" style={{ justifyContent: 'center' }}>
            <RefreshCw size={14} /> {resending ? 'Envoi…' : 'Renvoyer l\'email de confirmation'}
          </button>
          <button onClick={() => setPage('login')} className="btn-primary" style={{ justifyContent: 'center' }}>
            Aller à la connexion
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>
          Le lien expire dans 24 heures. Si vous ne recevez rien, vérifiez vos spams ou renvoyez l'email.
        </p>
      </div>
    </AuthShell>
  )

  // ── Formulaire d'inscription ──────────────────────────────
  return (
    <AuthShell title="Créer votre compte" sub="Rejoignez EnglishPath — c'est gratuit">
      <form onSubmit={handle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Prénom" value={form.firstName}
            onChange={v => setForm(f => ({ ...f, firstName: v }))}
            error={errors.firstName} required />
          <Field label="Nom" value={form.lastName}
            onChange={v => setForm(f => ({ ...f, lastName: v }))}
            error={errors.lastName} required />
        </div>
        <Field label="Adresse email" type="email" value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
          placeholder="votre@email.com" error={errors.email} required />
        <Field label="Confirmer l'email" type="email" value={form.emailConfirm}
          onChange={v => setForm(f => ({ ...f, emailConfirm: v }))}
          error={errors.emailConfirm} required />
        <Field label="Mot de passe" type={showPwd ? 'text' : 'password'}
          value={form.password}
          onChange={v => setForm(f => ({ ...f, password: v }))}
          placeholder="8 caractères min, 1 majuscule"
          error={errors.password}
          suffix={
            <button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          required />
        {strength && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ width: `${(strength.score / 4) * 100}%`, height: '100%', background: strength.color, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 11, color: strength.color, fontWeight: 500 }}>Sécurité : {strength.label}</span>
          </div>
        )}
        <Field label="Confirmer le mot de passe" type={showPwd ? 'text' : 'password'}
          value={form.passwordConfirm}
          onChange={v => setForm(f => ({ ...f, passwordConfirm: v }))}
          error={errors.passwordConfirm} required />

        <button type="submit" disabled={loading} className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }}>
          {loading ? 'Création du compte…' : 'Créer mon compte'}
        </button>
      </form>
      <Divider label="ou" />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
        Déjà un compte ?{' '}
        <button onClick={() => setPage('login')}
          style={{ color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Se connecter
        </button>
      </p>
    </AuthShell>
  )
}

// ─────────────────────────────────────────────────────────────
// MOT DE PASSE OUBLIÉ
// ─────────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const { setPage } = useStore()
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/` }
      )
      if (err) setError(err.message)
      else setSent(true)
    } catch {
      setError('Problème de connexion.')
    }
    setLoading(false)
  }

  return (
    <AuthShell title="Mot de passe oublié" sub="Entrez votre email pour recevoir un lien de réinitialisation">
      {sent ? (
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Mail size={28} color="#1D9E75" />
          </div>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 6 }}>
            Lien envoyé à <strong>{email}</strong>.
          </p>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
            Vérifiez votre boîte mail et cliquez sur le lien. Pensez à vérifier vos spams.
          </p>
          <button onClick={() => setPage('login')} className="btn-primary" style={{ justifyContent: 'center' }}>
            Retour à la connexion
          </button>
        </div>
      ) : (
        <form onSubmit={handle}>
          <Field label="Adresse email" type="email" value={email}
            onChange={setEmail} placeholder="votre@email.com" required />
          {error && <ErrorMsg msg={error} />}
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0', marginBottom: 10 }}>
            {loading ? 'Envoi…' : 'Envoyer le lien'}
          </button>
          <button type="button" onClick={() => setPage('login')}
            style={{ width: '100%', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Retour à la connexion
          </button>
        </form>
      )}
    </AuthShell>
  )
}

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD (après clic sur le lien email)
// ─────────────────────────────────────────────────────────────
export function ResetPasswordPage() {
  const { setPage } = useStore()
  const [form, setForm]       = useState({ password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 8)       { setError('Au moins 8 caractères requis.'); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password: form.password })
      if (err) setError(err.message)
      else setDone(true)
    } catch { setError('Problème de connexion.') }
    setLoading(false)
  }

  if (done) return (
    <AuthShell title="Mot de passe modifié" sub="">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Check size={28} color="#1D9E75" />
        </div>
        <p style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>Votre mot de passe a été modifié avec succès.</p>
        <button onClick={() => setPage('dashboard')} className="btn-primary" style={{ justifyContent: 'center' }}>
          Aller à mon tableau de bord
        </button>
      </div>
    </AuthShell>
  )

  return (
    <AuthShell title="Nouveau mot de passe" sub="Choisissez un nouveau mot de passe sécurisé">
      <form onSubmit={handle}>
        <Field label="Nouveau mot de passe" type={showPwd ? 'text' : 'password'}
          value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))}
          placeholder="8 caractères min, 1 majuscule"
          suffix={<button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          required />
        <Field label="Confirmer" type={showPwd ? 'text' : 'password'}
          value={form.confirm} onChange={v => setForm(f => ({ ...f, confirm: v }))}
          required />
        {error && <ErrorMsg msg={error} />}
        <button type="submit" disabled={loading} className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
          {loading ? 'Modification…' : 'Modifier mon mot de passe'}
        </button>
      </form>
    </AuthShell>
  )
}

// ─────────────────────────────────────────────────────────────
// Composants partagés
// ─────────────────────────────────────────────────────────────
function AuthShell({ title, sub, children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, background: '#185FA5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <BookOpen size={28} color="white" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#185FA5' }}>EnglishPath</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Programme Navigate A1–B1+</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '0.5px solid #e5e7eb' }}>
          {title && <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: sub ? 4 : 20 }}>{title}</h1>}
          {sub   && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: '1.5rem' }}>{sub}</p>}
          {children}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 16 }}>
          🔒 Données protégées · Conforme RGPD
        </p>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, error, suffix, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: '#374151' }}>
        {label}{required && <span style={{ color: '#D85A30' }}> *</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          style={{ width: '100%', padding: '10px 14px', paddingRight: suffix ? 42 : 14, border: `0.5px solid ${error ? '#D85A30' : '#d1d5db'}`, borderRadius: 8, fontSize: 14, background: '#fff', color: '#1a1a1a' }} />
        {suffix && (
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
            {suffix}
          </div>
        )}
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 12, color: '#D85A30', marginTop: 5, lineHeight: 1.4 }}>
      <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {msg}
    </div>
  )
}

function Divider({ label = 'ou' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 0.5, background: '#e5e7eb' }} />
      <span style={{ fontSize: 12, color: '#9ca3af' }}>{label}</span>
      <div style={{ flex: 1, height: 0.5, background: '#e5e7eb' }} />
    </div>
  )
}

const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }
