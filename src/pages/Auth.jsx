import { useState } from 'react'
import { Eye, EyeOff, BookOpen, Check, AlertCircle, Mail, RefreshCw, ArrowLeft, GraduationCap, Users } from 'lucide-react'
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
    } catch {
      setError('Problème de connexion. Vérifiez votre connexion internet.')
    }
    setLoading(false)
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

      <button onClick={() => demoLogin({ firstName: 'Marie', lastName: 'Dupont', email: 'demo@englishpath.fr' })}
        className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
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
// REGISTER — avec choix du rôle
// ─────────────────────────────────────────────────────────────
export function RegisterPage() {
  const { setPage } = useStore()
  const [role, setRole]   = useState(null) // null = choix du rôle, 'learner' ou 'trainer'
  const [form, setForm]   = useState({ firstName: '', lastName: '', email: '', password: '', passwordConfirm: '', center: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [resending, setResending] = useState(false)

  // ── Étape 1 : choisir le rôle ──
  if (!role) return (
    <AuthShell title="Créer votre compte" sub="Choisissez votre profil">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {/* Stagiaire */}
        <button onClick={() => setRole('learner')} style={{
          padding: '1.5rem 1rem', border: '2px solid #e5e7eb', borderRadius: 12,
          cursor: 'pointer', background: '#fff', textAlign: 'center', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.background = '#E1F5EE' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎓</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1D9E75', marginBottom: 6 }}>Stagiaire</div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
            J'apprends l'anglais et je veux suivre ma progression
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: '#1D9E75', fontWeight: 500 }}>
            ✓ Exercices interactifs<br/>
            ✓ Progression personnalisée<br/>
            ✓ Assistant IA pédagogique
          </div>
        </button>

        {/* Formateur */}
        <button onClick={() => setRole('trainer')} style={{
          padding: '1.5rem 1rem', border: '2px solid #e5e7eb', borderRadius: 12,
          cursor: 'pointer', background: '#fff', textAlign: 'center', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#185FA5'; e.currentTarget.style.background = '#E6F1FB' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>👨‍🏫</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#185FA5', marginBottom: 6 }}>Formateur</div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
            Je suis formateur et je veux suivre mes apprenants
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: '#185FA5', fontWeight: 500 }}>
            ✓ Gestion des groupes<br/>
            ✓ Suivi des apprenants<br/>
            ✓ Export Excel & PDF
          </div>
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
        Déjà un compte ?{' '}
        <button onClick={() => setPage('login')}
          style={{ color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Se connecter
        </button>
      </p>
    </AuthShell>
  )

  // ── Étape 2 : formulaire selon le rôle ──
  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Le prénom est requis.'
    if (!form.lastName.trim())  e.lastName  = 'Le nom est requis.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) e.email = 'Adresse email invalide.'
    if (form.password.length < 8) e.password = 'Au moins 8 caractères.'
    if (!/[A-Z]/.test(form.password)) e.password = (e.password ? e.password + ' ' : '') + 'Ajoutez une majuscule.'
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Les mots de passe ne correspondent pas.'
    if (role === 'trainer' && !form.center.trim()) e.center = 'Le nom du centre est requis.'
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
          data: {
            first_name: form.firstName.trim(),
            last_name:  form.lastName.trim(),
            role,
            center: form.center.trim() || null,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (err) {
        if (err.message.includes('already registered') || err.message.includes('User already'))
          setErrors({ email: 'Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.' })
        else {
          const msg = typeof err?.message === 'string' && err.message.length > 0
            ? err.message
            : 'Erreur lors de l\'inscription. Réessayez.'
          setErrors({ email: msg })
        }
      } else {
        if (data.user) {
          await supabase.from('learners').upsert({
            id:         data.user.id,
            email:      form.email.trim(),
            first_name: form.firstName.trim(),
            last_name:  form.lastName.trim(),
            role,
            level:      'A1',
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
    const p = form.password; if (!p) return null
    let s = 0
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
    return { score: s, label: ['','Faible','Moyen','Fort','Très fort'][s], color: ['','#D85A30','#BA7517','#1D9E75','#185FA5'][s] }
  })()

  const roleColor  = role === 'learner' ? '#1D9E75' : '#185FA5'
  const roleLabel  = role === 'learner' ? '🎓 Stagiaire' : '👨‍🏫 Formateur'
  const roleBg     = role === 'learner' ? '#E1F5EE' : '#E6F1FB'

  if (sent) return (
    <AuthShell title="Vérifiez vos emails" sub="">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Mail size={32} color="#1D9E75" />
        </div>
        <div style={{ display: 'inline-block', background: roleBg, color: roleColor, padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
          {roleLabel}
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#085041' }}>Email envoyé !</h2>
        <p style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>Un lien de confirmation a été envoyé à</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#185FA5', marginBottom: 20 }}>{form.email}</p>
        <div style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '1rem', textAlign: 'left', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Que faire maintenant ?</p>
          {['1. Ouvrez votre boîte mail','2. Cherchez un email de EnglishPath (vérifiez les spams)','3. Cliquez sur le lien de confirmation','4. Vous serez redirigé vers la plateforme'].map((s, i) => (
            <p key={i} style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{s}</p>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={resendEmail} disabled={resending} className="btn-secondary" style={{ justifyContent: 'center' }}>
            <RefreshCw size={14} /> {resending ? 'Envoi…' : 'Renvoyer l\'email'}
          </button>
          <button onClick={() => setPage('login')} className="btn-primary" style={{ justifyContent: 'center' }}>
            Aller à la connexion
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>Le lien expire dans 24 heures.</p>
      </div>
    </AuthShell>
  )

  return (
    <AuthShell title="Créer votre compte" sub="">
      {/* Badge rôle + retour */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: roleBg, color: roleColor, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          {role === 'learner' ? <GraduationCap size={14} /> : <Users size={14} />}
          {roleLabel}
        </div>
        <button onClick={() => setRole(null)} style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={12} /> Changer
        </button>
      </div>

      <form onSubmit={handle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Prénom" value={form.firstName} onChange={v => setForm(f => ({...f, firstName: v}))} error={errors.firstName} required />
          <Field label="Nom"    value={form.lastName}  onChange={v => setForm(f => ({...f, lastName: v}))}  error={errors.lastName}  required />
        </div>

        {/* Champ centre de formation pour les formateurs */}
        {role === 'trainer' && (
          <Field label="Centre de formation" value={form.center}
            onChange={v => setForm(f => ({...f, center: v}))}
            placeholder="Ex : RÉCIFE Le Havre, GRETA…"
            error={errors.center} required />
        )}

        <Field label="Adresse email" type="email" value={form.email}
          onChange={v => { setForm(f => ({...f, email: v})); setErrors(prev => ({...prev, email: ''})) }}
          placeholder="votre@email.com" error={errors.email} required />

        <Field label="Mot de passe" type={showPwd ? 'text' : 'password'}
          value={form.password}
          onChange={v => setForm(f => ({...f, password: v}))}
          placeholder="8 caractères min, 1 majuscule"
          error={errors.password}
          suffix={<button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
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
          onChange={v => setForm(f => ({...f, passwordConfirm: v}))}
          error={errors.passwordConfirm} required />

        <button type="submit" disabled={loading} className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15, background: roleColor }}>
          {loading ? 'Création du compte…' : `Créer mon compte ${roleLabel}`}
        </button>
      </form>

      <Divider label="ou" />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
        Déjà un compte ?{' '}
        <button onClick={() => setPage('login')} style={{ color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
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
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/`,
      })
      if (err) setError(err.message)
      else setSent(true)
    } catch { setError('Problème de connexion.') }
    setLoading(false)
  }

  return (
    <AuthShell title="Mot de passe oublié" sub="Entrez votre email pour recevoir un lien de réinitialisation">
      {sent ? (
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Mail size={28} color="#1D9E75" />
          </div>
          <p style={{ fontSize: 14, color: '#374151', marginBottom: 6 }}>Lien envoyé à <strong>{email}</strong>.</p>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Vérifiez vos spams si vous ne le recevez pas.</p>
          <button onClick={() => setPage('login')} className="btn-primary" style={{ justifyContent: 'center' }}>Retour à la connexion</button>
        </div>
      ) : (
        <form onSubmit={handle}>
          <Field label="Adresse email" type="email" value={email} onChange={setEmail} placeholder="votre@email.com" required />
          {error && <ErrorMsg msg={error} />}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', marginBottom: 10 }}>
            {loading ? 'Envoi…' : 'Envoyer le lien'}
          </button>
          <button type="button" onClick={() => setPage('login')} style={{ width: '100%', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Retour à la connexion
          </button>
        </form>
      )}
    </AuthShell>
  )
}

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD
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
          value={form.password} onChange={v => setForm(f => ({...f, password: v}))}
          placeholder="8 caractères min, 1 majuscule"
          suffix={<button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          required />
        <Field label="Confirmer" type={showPwd ? 'text' : 'password'}
          value={form.confirm} onChange={v => setForm(f => ({...f, confirm: v}))} required />
        {error && <ErrorMsg msg={error} />}
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, background: '#185FA5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <BookOpen size={28} color="white" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#185FA5' }}>EnglishPath</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Programme Navigate A1–B1+</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '0.5px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
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
          style={{ width: '100%', padding: '10px 14px', paddingRight: suffix ? 42 : 14, border: `0.5px solid ${error ? '#D85A30' : '#d1d5db'}`, borderRadius: 8, fontSize: 14 }} />
        {suffix && <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>{suffix}</div>}
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

function ErrorMsg({ msg }) {
  if (!msg) return null
  const text = typeof msg === 'string' ? msg : (msg?.message || JSON.stringify(msg))
  if (!text || text === '{}' || text === 'undefined') return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 12, color: '#D85A30', marginTop: 5, lineHeight: 1.4 }}>
      <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {text}
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
