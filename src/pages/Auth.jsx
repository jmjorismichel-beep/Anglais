import { useState } from 'react';
import { Eye, EyeOff, BookOpen, Check, AlertCircle } from 'lucide-react';
import useStore from '../lib/store.js';

// ─── Login ───────────────────────────────────────────────────────────────────
export function LoginPage() {
  const { login, setPage } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulation connexion (en prod : Supabase auth)
    await new Promise(r => setTimeout(r, 600));
    if (form.email && form.password.length >= 6) {
      login({ firstName: 'Marie', lastName: 'Dupont', email: form.email, role: 'learner' });
    } else {
      setError('Email ou mot de passe incorrect.');
    }
    setLoading(false);
  };

  return (
    <AuthShell title="Bienvenue sur EnglishPath" sub="Connectez-vous à votre espace d'apprentissage">
      <form onSubmit={handle}>
        <Field label="Adresse email" type="email" value={form.email} onChange={v => setForm(f => ({...f, email: v}))} placeholder="votre@email.com" required />
        <Field label="Mot de passe" type={showPwd ? 'text' : 'password'} value={form.password}
          onChange={v => setForm(f => ({...f, password: v}))} placeholder="Votre mot de passe"
          suffix={<button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          required />
        {error && <ErrorMsg msg={error} />}
        <button type="button" onClick={() => setPage('forgot')} style={{ fontSize: 13, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12 }}>
          Mot de passe oublié ?
        </button>
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      <Divider />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
        Pas encore de compte ?{' '}
        <button onClick={() => setPage('register')} style={{ color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
          Créer un compte
        </button>
      </p>
    </AuthShell>
  );
}

// ─── Register ────────────────────────────────────────────────────────────────
export function RegisterPage() {
  const { register, setPage } = useStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', emailConfirm: '', password: '', passwordConfirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Le prénom est requis.';
    if (!form.lastName.trim()) e.lastName = 'Le nom est requis.';
    if (!form.email.includes('@')) e.email = 'Email invalide.';
    if (form.email !== form.emailConfirm) e.emailConfirm = 'Les adresses email ne correspondent pas.';
    if (form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    if (!/[A-Z]/.test(form.password)) e.password = (e.password || '') + ' Ajoutez une majuscule.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Les mots de passe ne correspondent pas.';
    return e;
  };

  const handle = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setTimeout(() => register({ firstName: form.firstName, lastName: form.lastName, email: form.email }), 2000);
    setLoading(false);
  };

  const pwdStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['', '#D85A30', '#BA7517', '#1D9E75', '#185FA5'];
    return { score, label: labels[score], color: colors[score] };
  };
  const strength = pwdStrength();

  if (sent) {
    return (
      <AuthShell title="Vérifiez vos emails" sub="">
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Check size={28} color="#1D9E75" />
          </div>
          <p style={{ color: '#374151', lineHeight: 1.6 }}>Un email de confirmation a été envoyé à <strong>{form.email}</strong>. Cliquez sur le lien pour activer votre compte.</p>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>Vous serez redirigé automatiquement…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Créer votre compte" sub="Rejoignez EnglishPath — c'est gratuit">
      <form onSubmit={handle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Prénom" value={form.firstName} onChange={v => setForm(f => ({...f, firstName: v}))} error={errors.firstName} required />
          <Field label="Nom" value={form.lastName} onChange={v => setForm(f => ({...f, lastName: v}))} error={errors.lastName} required />
        </div>
        <Field label="Adresse email" type="email" value={form.email} onChange={v => setForm(f => ({...f, email: v}))} placeholder="votre@email.com" error={errors.email} required />
        <Field label="Confirmer l'email" type="email" value={form.emailConfirm} onChange={v => setForm(f => ({...f, emailConfirm: v}))} error={errors.emailConfirm} required />
        <Field label="Mot de passe" type={showPwd ? 'text' : 'password'} value={form.password}
          onChange={v => setForm(f => ({...f, password: v}))} placeholder="8 caractères min, 1 majuscule"
          error={errors.password}
          suffix={<button type="button" onClick={() => setShowPwd(p => !p)} style={iconBtnStyle}>{showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}</button>}
          required />
        {strength && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ width: `${(strength.score / 4) * 100}%`, height: '100%', background: strength.color, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 11, color: strength.color }}>{strength.label}</span>
          </div>
        )}
        <Field label="Confirmer le mot de passe" type={showPwd ? 'text' : 'password'} value={form.passwordConfirm}
          onChange={v => setForm(f => ({...f, passwordConfirm: v}))} error={errors.passwordConfirm} required />
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }}>
          {loading ? 'Création du compte…' : 'Créer mon compte'}
        </button>
      </form>
      <Divider />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
        Déjà un compte ?{' '}
        <button onClick={() => setPage('login')} style={{ color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
          Se connecter
        </button>
      </p>
    </AuthShell>
  );
}

// ─── ForgotPassword ──────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const { setPage } = useStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const handle = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 600));
    setSent(true);
  };
  return (
    <AuthShell title="Mot de passe oublié" sub="Entrez votre email pour recevoir un lien de réinitialisation">
      {sent ? (
        <div style={{ textAlign: 'center' }}>
          <Check size={40} color="#1D9E75" style={{ margin: '0 auto 12px' }} />
          <p>Email envoyé à <strong>{email}</strong>. Vérifiez votre boîte mail.</p>
          <button onClick={() => setPage('login')} className="btn-secondary" style={{ marginTop: 16 }}>Retour à la connexion</button>
        </div>
      ) : (
        <form onSubmit={handle}>
          <Field label="Adresse email" type="email" value={email} onChange={setEmail} placeholder="votre@email.com" required />
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
            Envoyer le lien
          </button>
          <button type="button" onClick={() => setPage('login')} style={{ width: '100%', marginTop: 8, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 8 }}>
            ← Retour à la connexion
          </button>
        </form>
      )}
    </AuthShell>
  );
}

// ─── Shared components ───────────────────────────────────────────────────────
function AuthShell({ title, sub, children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, background: '#185FA5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <BookOpen size={28} color="white" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#185FA5' }}>EnglishPath</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Programme Navigate A1–B1</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '0.5px solid #e5e7eb' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{title}</h1>
          {sub && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: '1.5rem' }}>{sub}</p>}
          {children}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 16 }}>
          🔒 Vos données sont protégées · Conforme RGPD
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, error, suffix, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: '#374151' }}>
        {label}{required && <span style={{ color: '#D85A30' }}> *</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
          style={{ width: '100%', padding: '10px 14px', paddingRight: suffix ? 42 : 14, border: `0.5px solid ${error ? '#D85A30' : '#d1d5db'}`, borderRadius: 8, fontSize: 14, background: '#fff', color: '#1a1a1a' }} />
        {suffix && <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>{suffix}</div>}
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#D85A30', marginTop: 4 }}>
      <AlertCircle size={13} /> {msg}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 0.5, background: '#e5e7eb' }} />
      <span style={{ fontSize: 12, color: '#9ca3af' }}>ou</span>
      <div style={{ flex: 1, height: 0.5, background: '#e5e7eb' }} />
    </div>
  );
}

const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' };
