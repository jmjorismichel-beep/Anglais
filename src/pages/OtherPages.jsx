import { useState, useRef, useEffect } from 'react';
import { POSITIONING_TEST, DEMO_LEARNERS, GROUPS } from '../data/courseData.js';
import { Card, MetricCard, ProgressBar, LevelBadge, Alert, Tabs, Avatar, Spinner, AudioPlayer } from '../components/UI.jsx';
import { Target, Send, RefreshCw, Download, Printer, Users, BarChart3, ChevronRight, Check, AlertTriangle, Bot, FileText, Award, MessageSquare, Trash2 } from 'lucide-react';
import useStore from '../lib/store.js';
import { useAI } from '../lib/useAI.js';

// ════════════════════════════════════════════════════════════════
// POSITIONING TEST
// ════════════════════════════════════════════════════════════════
export function PositioningPage() {
  const { setPositioningResult, positioningResult, setPage, showNotif } = useStore();
  const [step, setStep] = useState('intro'); // intro | test | result
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const q = POSITIONING_TEST[qIdx];

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => {
      const a = [...answers, i];
      setAnswers(a);
      if (qIdx < POSITIONING_TEST.length - 1) {
        setQIdx(qIdx + 1);
        setSelected(null);
      } else {
        // Compute level
        const correct = a.filter((ai, ii) => ai === POSITIONING_TEST[ii].answer).length;
        const pct = correct / POSITIONING_TEST.length;
        const level = pct >= 0.85 ? 'B1' : pct >= 0.65 ? 'A2' : 'A1';
        setPositioningResult(level);
        setStep('result');
      }
    }, 800);
  };

  if (step === 'intro') return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Test de positionnement</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Découvrez votre niveau de départ en quelques minutes</p>
      </div>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Quel est votre niveau en anglais ?</h3>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            Ce test de {POSITIONING_TEST.length} questions évalue votre grammaire, vocabulaire et compréhension. Il dure environ 5 minutes.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
            {['A1 — Débutant', 'A2 — Élémentaire', 'B1 — Intermédiaire'].map((l, i) => (
              <div key={i} style={{ padding: '1rem', border: '0.5px solid #e5e7eb', borderRadius: 10, fontSize: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#185FA5', marginBottom: 4 }}>{l.split(' — ')[0]}</div>
                <div style={{ color: '#6b7280' }}>{l.split(' — ')[1]}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep('test')} className="btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
            Commencer le test
          </button>
          {positioningResult && (
            <div style={{ marginTop: 16, fontSize: 13, color: '#6b7280' }}>
              Votre niveau précédent : <LevelBadge level={positioningResult} />
              <button onClick={() => setStep('result')} style={{ marginLeft: 8, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>voir le résultat</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  if (step === 'test') return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Test de positionnement</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginTop: 8, marginBottom: 6 }}>
          <span>Question {qIdx + 1} / {POSITIONING_TEST.length}</span>
          <span style={{ color: '#185FA5', fontWeight: 500 }}>Compétence : {q.skill}</span>
        </div>
        <ProgressBar value={((qIdx + 1) / POSITIONING_TEST.length) * 100} color="blue" />
      </div>
      <Card style={{ maxWidth: 520, margin: '0 auto' }}>
        <p style={{ fontSize: 17, fontWeight: 500, marginBottom: 20, lineHeight: 1.5 }}>{q.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, i) => {
            let border = '#e5e7eb', bg = '#fff', color = '#374151';
            if (selected !== null) {
              if (i === q.answer) { border = '#1D9E75'; bg = '#E1F5EE'; color = '#04342C'; }
              else if (i === selected) { border = '#D85A30'; bg = '#FAECE7'; color = '#4A1B0C'; }
            }
            return (
              <button key={i} onClick={() => answer(i)} style={{ padding: '12px 16px', border: `1px solid ${border}`, background: bg, borderRadius: 8, fontSize: 14, textAlign: 'left', cursor: 'pointer', color, transition: 'all 0.15s' }}>
                {opt}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );

  if (step === 'result') {
    const correct = answers.filter((a, i) => a === POSITIONING_TEST[i]?.answer).length;
    const pct = Math.round((correct / POSITIONING_TEST.length) * 100);
    const level = positioningResult;
    return (
      <div className="animate-fade-in" style={{ maxWidth: 520, margin: '0 auto' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Votre niveau : <LevelBadge level={level} /></h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#185FA5', marginBottom: 4 }}>{pct}%</div>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>{correct} / {POSITIONING_TEST.length} bonnes réponses</p>
          <ProgressBar value={pct} color="blue" />
          <div style={{ margin: '20px 0', textAlign: 'left', background: '#f9fafb', borderRadius: 10, padding: '1rem' }}>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              {level === 'A1' && "Vous débutez en anglais. Nous vous recommandons de commencer par l'Unité 1 — First meetings du programme Navigate A1."}
              {level === 'A2' && "Vous avez quelques bases solides ! Nous vous recommandons de commencer au niveau A2."}
              {level === 'B1' && "Vous avez un bon niveau intermédiaire ! Commencez avec le niveau B1."}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => { setStep('intro'); setQIdx(0); setAnswers([]); setSelected(null); }} className="btn-secondary">
              <RefreshCw size={14} /> Refaire le test
            </button>
            <button onClick={() => setPage('modules')} className="btn-primary">
              Commencer les modules <ChevronRight size={14} />
            </button>
          </div>
        </Card>
      </div>
    );
  }
}

// ════════════════════════════════════════════════════════════════
// PROGRESS PAGE
// ════════════════════════════════════════════════════════════════
export function ProgressPage() {
  const { xp, streak } = useStore();
  const SKILLS = [
    { label: 'Compréhension orale', val: 70, color: 'teal' },
    { label: 'Compréhension écrite', val: 65, color: 'blue' },
    { label: 'Grammaire', val: 55, color: 'amber' },
    { label: 'Vocabulaire', val: 80, color: 'green' },
    { label: 'Expression écrite', val: 45, color: 'purple' },
    { label: 'Prononciation', val: 60, color: 'coral' },
  ];
  const HISTORY = [
    { date: '16 juin', unit: 'Unit 3.2 Possessions', score: 90, time: '22 min' },
    { date: '15 juin', unit: 'Unit 3.1 My neighbours', score: 75, time: '18 min' },
    { date: '14 juin', unit: 'Grammar Ref — Have got', score: 85, time: '15 min' },
    { date: '13 juin', unit: 'Unit 2.4 Speaking', score: 80, time: '25 min' },
    { date: '12 juin', unit: 'Unit 2.3 Where are they?', score: 70, time: '20 min' },
  ];
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Ma progression</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Vue complète de votre parcours d'apprentissage</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="XP total" value={xp.toLocaleString()} sub="+80 aujourd'hui" color="#BA7517" />
        <MetricCard label="Streak" value={`${streak} 🔥`} sub="jours consécutifs" color="#BA7517" />
        <MetricCard label="Taux de réussite" value="85%" sub="47 exercices" color="#1D9E75" />
        <MetricCard label="Temps total" value="14h 22min" sub="Ce mois" color="#185FA5" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Compétences CECRL</h3>
          {SKILLS.map(s => (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                <span style={{ color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontWeight: 500 }}>{s.val}%</span>
              </div>
              <ProgressBar value={s.val} color={s.color} />
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Progression A1–B1</h3>
          {['A1','A2','B1'].map((l, i) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <LevelBadge level={l} />
                <span style={{ fontSize: 12, color: i === 0 ? '#1D9E75' : '#9ca3af' }}>{i === 0 ? '65%' : i === 1 ? 'Verrouillé' : 'Verrouillé'}</span>
              </div>
              <ProgressBar value={i === 0 ? 65 : 0} color={i === 0 ? 'teal' : 'gray'} />
              {i === 0 && <p style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>Unité 3/5 — People and possessions en cours</p>}
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '10px 12px', background: '#E6F1FB', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: '#185FA5' }}>💡 Terminez l'unité 3 pour débloquer l'unité 4 — My life</p>
          </div>
        </Card>
      </div>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Historique des séances</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {HISTORY.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < HISTORY.length - 1 ? '0.5px solid #f3f4f6' : 'none' }}>
              <div style={{ width: 40, fontSize: 10, color: '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>{h.date.split(' ')[0]}<br/>{h.date.split(' ')[1]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{h.unit}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{h.time} · {h.score}% de réussite</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: h.score >= 80 ? '#1D9E75' : '#BA7517' }}>{h.score}%</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-secondary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
          <Download size={14} /> Télécharger mon attestation PDF
        </button>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// AI CHAT
// ════════════════════════════════════════════════════════════════
export function AIPage() {
  const { chatMessages, addChatMessage, clearChat } = useStore();
  const { ask, loading } = useAI();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    addChatMessage({ role: 'user', content: msg });
    const reply = await ask(msg, chatMessages);
    addChatMessage({ role: 'bot', content: reply });
  };

  const QUICK = [
    'Explique have got vs has got',
    'Génère un exercice A1 sur les possessifs',
    'Corrige ma phrase : She have a car.',
    'Traduis : Je voudrais un café, s\'il vous plaît.',
    'Comment prononcer "th" en anglais ?',
    'Conseils pour mémoriser le vocabulaire',
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>Assistant IA pédagogique</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Posez une question, demandez une explication, un exercice, une traduction…</p>
        </div>
        <button onClick={clearChat} className="btn-secondary" style={{ fontSize: 12 }}>
          <Trash2 size={13} /> Effacer
        </button>
      </div>

      <Card style={{ padding: 0, marginBottom: 12 }}>
        {/* Messages */}
        <div style={{ height: 420, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chatMessages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'bot' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} color="#185FA5" />
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: 12, fontSize: 14, lineHeight: 1.6,
                background: m.role === 'user' ? '#185FA5' : '#f3f4f6',
                color: m.role === 'user' ? 'white' : '#1a1a1a',
                borderBottomLeftRadius: m.role === 'bot' ? 4 : 12,
                borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                whiteSpace: 'pre-wrap',
              }}>
                {m.role === 'bot' && <div style={{ fontSize: 10, fontWeight: 700, color: '#185FA5', marginBottom: 4 }}>EnglishPath AI</div>}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#185FA5" />
              </div>
              <div style={{ padding: '10px 14px', background: '#f3f4f6', borderRadius: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                <Spinner size={16} /> <span style={{ fontSize: 13, color: '#6b7280' }}>L'assistant réfléchit…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {/* Input */}
        <div style={{ display: 'flex', gap: 8, padding: '0.75rem 1rem', borderTop: '0.5px solid #e5e7eb' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Écrivez en français ou en anglais… (Entrée pour envoyer)"
            style={{ flex: 1, padding: '9px 14px', border: '0.5px solid #d1d5db', borderRadius: 20, fontSize: 14 }}
          />
          <button onClick={send} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: '50%', background: '#185FA5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.5 : 1 }}>
            <Send size={15} color="white" />
          </button>
        </div>
      </Card>

      {/* Quick prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => { setInput(q); }} className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TRAINER
// ════════════════════════════════════════════════════════════════
export function TrainerPage() {
  const [group, setGroup] = useState(0);
  const [search, setSearch] = useState('');
  const g = GROUPS[group];
  const learners = DEMO_LEARNERS.filter(l => g.learnerIds.includes(l.id)).filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase())
  );
  const alerts = learners.filter(l => l.alert);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Espace formateur</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Suivi pédagogique — {GROUPS.reduce((a,g)=>a+g.learnerIds.length,0)} apprenants · {GROUPS.length} groupes</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Apprenants actifs" value={DEMO_LEARNERS.length} sub={`${GROUPS.length} groupes`} color="#185FA5" />
        <MetricCard label="Participation" value="83%" sub="Cette semaine" color="#1D9E75" />
        <MetricCard label="Alertes décrochage" value={DEMO_LEARNERS.filter(l=>l.alert).length} sub="Nécessitent attention" color="#BA7517" />
        <MetricCard label="Exercices assignés" value="12" sub="Ce mois" color="#639922" />
      </div>

      {alerts.length > 0 && (
        <Alert type="warning">
          ⚠️ {alerts.length} apprenant{alerts.length>1?'s':''} n'ont pas travaillé depuis plus de 5 jours : {alerts.map(a=>a.name).join(', ')}. Contactez-les pour maintenir leur motivation.
        </Alert>
      )}

      {/* Group selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {GROUPS.map((g, i) => (
          <button key={i} onClick={() => setGroup(i)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${group===i?'#185FA5':'#e5e7eb'}`, background: group===i?'#E6F1FB':'#fff', color: group===i?'#185FA5':'#6b7280', fontSize: 13, cursor: 'pointer', fontWeight: group===i?500:400 }}>
            {g.name}
          </button>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{g.name}</h3>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Formateur : {g.trainer}</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}><Download size={13} /> Excel</button>
            <button className="btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>✉️ Message groupe</button>
          </div>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un apprenant…" style={{ marginBottom: 12, padding: '8px 12px', border: '0.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, width: '100%' }} />

        {learners.map((l, i) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < learners.length - 1 ? '0.5px solid #f3f4f6' : 'none' }}>
            <Avatar initials={l.initials} color={l.alert ? '#FAECE7' : '#E6F1FB'} textColor={l.alert ? '#D85A30' : '#185FA5'} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{l.name}</span>
                <LevelBadge level={l.level} />
                {l.alert && <AlertTriangle size={13} color="#D85A30" />}
              </div>
              <div style={{ fontSize: 11, color: l.alert ? '#D85A30' : '#9ca3af' }}>
                Unité {l.unit} · Connecté {l.lastSeen} · 🔥 {l.streak} jours
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 80 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: l.progress >= 70 ? '#1D9E75' : l.progress >= 40 ? '#BA7517' : '#D85A30' }}>{l.progress}%</div>
              <ProgressBar value={l.progress} color={l.progress >= 70 ? 'teal' : l.progress >= 40 ? 'amber' : 'coral'} />
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{l.xp} XP</div>
            </div>
            <button style={{ padding: '5px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 11, cursor: 'pointer', background: '#fff', color: '#185FA5' }}>
              <MessageSquare size={12} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PRINT
// ════════════════════════════════════════════════════════════════
export function PrintPage() {
  const [selected, setSelected] = useState({ unit: '3', level: 'A1', type: 'exercises', format: 'a4_portrait', color: 'color', logo: true });
  const { showNotif } = useStore();

  const generate = () => showNotif('📄 PDF en cours de génération…', 'info');

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Impression pédagogique</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Générez des fiches, exercices, corrigés et évaluations prêts à imprimer</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div>
          {/* Type of document */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Type de document</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { id: 'exercises', icon: '📝', label: 'Fiche d\'exercices', desc: 'QCM, textes à trous, association' },
                { id: 'vocab', icon: '🗂️', label: 'Cartes vocabulaire', desc: 'Flashcards, mots mêlés, mots croisés' },
                { id: 'evaluation', icon: '📊', label: 'Évaluation', desc: 'Test de fin de chapitre avec barème' },
                { id: 'revision', icon: '📋', label: 'Fiche de révision', desc: 'Résumé grammaire + vocabulaire' },
                { id: 'correction', icon: '✅', label: 'Corrigés formateur', desc: 'Réponses et explications' },
                { id: 'attestation', icon: '🏆', label: 'Attestation', desc: 'PDF personnalisé avec logo' },
              ].map(t => (
                <div key={t.id} onClick={() => setSelected(s => ({...s, type: t.id}))} style={{ padding: '12px', border: `1px solid ${selected.type===t.id?'#185FA5':'#e5e7eb'}`, borderRadius: 10, cursor: 'pointer', background: selected.type===t.id?'#E6F1FB':'#fff', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: selected.type===t.id?'#185FA5':'#1a1a1a' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Content selection */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Contenu à inclure</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Niveau</label>
                <select value={selected.level} onChange={e => setSelected(s => ({...s, level: e.target.value}))} style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}>
                  <option>A1</option><option>A2</option><option>B1</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Unité</label>
                <select value={selected.unit} onChange={e => setSelected(s => ({...s, unit: e.target.value}))} style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}>
                  {[1,2,3,4,5].map(u => <option key={u} value={u}>Unité {u}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="logo" checked={selected.logo} onChange={e => setSelected(s=>({...s,logo:e.target.checked}))} />
              <label htmlFor="logo" style={{ fontSize: 13 }}>Inclure le logo du centre de formation</label>
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="text" placeholder="Nom du groupe ou de l'apprenant (optionnel)" style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
            </div>
          </Card>
        </div>

        {/* Right panel */}
        <div>
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Format d'impression</h3>
            {[
              { id: 'a4_portrait', label: 'A4 Portrait' },
              { id: 'a4_landscape', label: 'A4 Paysage' },
              { id: 'simplified', label: 'Simplifié (photocopie)' },
            ].map(f => (
              <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="radio" name="format" value={f.id} checked={selected.format===f.id} onChange={() => setSelected(s=>({...s,format:f.id}))} />
                {f.label}
              </label>
            ))}
            <div style={{ marginTop: 8, borderTop: '0.5px solid #f3f4f6', paddingTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Couleur</div>
              {['color','bw'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="color" value={c} checked={selected.color===c} onChange={() => setSelected(s=>({...s,color:c}))} />
                  {c==='color'?'Couleur':'Noir & blanc'}
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Générer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={generate} className="btn-primary" style={{ justifyContent: 'center' }}>
                <Printer size={14} /> Générer le PDF
              </button>
              <button onClick={generate} className="btn-secondary" style={{ justifyContent: 'center' }}>
                <Download size={14} /> Télécharger
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>
              Les documents générés sont propres, lisibles et adaptés aux débutants. Ils incluent le nom de l'apprenant, le niveau, la date et le logo du centre.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STATS (Formateur)
// ════════════════════════════════════════════════════════════════
export function StatsPage() {
  const avgProgress = Math.round(DEMO_LEARNERS.reduce((a,l)=>a+l.progress,0)/DEMO_LEARNERS.length);
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Statistiques globales</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Vue d'ensemble — tous les groupes et apprenants</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Apprenants total" value={DEMO_LEARNERS.length} color="#185FA5" />
        <MetricCard label="XP collectif" value="14 280" sub="Ce mois" color="#BA7517" />
        <MetricCard label="Progression moy." value={`${avgProgress}%`} color="#1D9E75" />
        <MetricCard label="Alertes actives" value={DEMO_LEARNERS.filter(l=>l.alert).length} color="#D85A30" />
      </div>
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Progression par apprenant</h3>
        {DEMO_LEARNERS.sort((a,b)=>b.progress-a.progress).map((l, i) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <Avatar initials={l.initials} size={28} color={l.alert?'#FAECE7':'#E6F1FB'} textColor={l.alert?'#D85A30':'#185FA5'} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                <span style={{ fontWeight: 500 }}>{l.name}</span>
                <span style={{ color: l.progress >= 70 ? '#1D9E75' : '#BA7517', fontWeight: 600 }}>{l.progress}%</span>
              </div>
              <ProgressBar value={l.progress} color={l.progress >= 70 ? 'teal' : l.progress >= 40 ? 'amber' : 'coral'} height={4} />
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Répartition par niveau</h3>
        {[
          { level: 'A1', count: DEMO_LEARNERS.filter(l=>l.level==='A1').length, color: 'teal' },
          { level: 'A2', count: DEMO_LEARNERS.filter(l=>l.level==='A2').length, color: 'blue' },
          { level: 'B1', count: DEMO_LEARNERS.filter(l=>l.level==='B1').length, color: 'purple' },
        ].map(r => (
          <div key={r.level} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <LevelBadge level={r.level} />
              <span style={{ color: '#6b7280' }}>{r.count} apprenant{r.count>1?'s':''}</span>
            </div>
            <ProgressBar value={(r.count / DEMO_LEARNERS.length) * 100} color={r.color} />
          </div>
        ))}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════
export function SettingsPage() {
  const { settings, updateSettings, user, logout, showNotif } = useStore();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Paramètres & Accessibilité</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Personnalisez votre expérience d'apprentissage</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          {/* Profile */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Mon compte</h3>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar initials={`${user.firstName?.[0]||''}${user.lastName?.[0]||''}`.toUpperCase()} size={44} />
                <div>
                  <div style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                  <div style={{ fontSize: 12, color: '#1D9E75' }}>● Niveau A1 · 1 240 XP</div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>Modifier mon profil</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>Changer mon mot de passe</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', color: '#D85A30', borderColor: '#FAECE7' }}>
                Supprimer mon compte (RGPD)
              </button>
            </div>
          </Card>

          {/* Accessibility */}
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Accessibilité</h3>
            <ToggleSetting label="Mode dyslexie" desc="Police adaptée OpenDyslexic" value={settings.dyslexia} onChange={v => updateSettings({ dyslexia: v })} />
            <ToggleSetting label="Contraste élevé" desc="Couleurs renforcées" value={settings.highContrast} onChange={v => updateSettings({ highContrast: v })} />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Taille du texte</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['normal','large','xl'].map(s => (
                  <button key={s} onClick={() => updateSettings({ fontSize: s })} style={{ padding: '6px 12px', border: `1px solid ${settings.fontSize===s?'#185FA5':'#e5e7eb'}`, background: settings.fontSize===s?'#E6F1FB':'#fff', borderRadius: 6, fontSize: s==='normal'?12:s==='large'?15:18, cursor: 'pointer', color: settings.fontSize===s?'#185FA5':'#374151' }}>A</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Vitesse audio</div>
              <input type="range" min="0.5" max="2" step="0.25" value={settings.audioSpeed} onChange={e => updateSettings({ audioSpeed: parseFloat(e.target.value) })} style={{ width: '100%' }} />
              <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>×{settings.audioSpeed}</div>
            </div>
          </Card>
        </div>

        <div>
          {/* Language */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Langue de l'interface</h3>
            {[
              { id: 'fr', label: '🇫🇷 Français' },
              { id: 'en', label: '🇬🇧 English' },
            ].map(l => (
              <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="radio" name="lang" value={l.id} checked={settings.lang===l.id} onChange={() => updateSettings({lang:l.id})} />
                {l.label}
              </label>
            ))}
          </Card>

          {/* Notifications */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Notifications</h3>
            <ToggleSetting label="Rappel quotidien" desc="Rappel pour votre objectif du jour" value={true} onChange={() => {}} />
            <ToggleSetting label="Nouveaux exercices" desc="Quand le formateur assigne un exercice" value={true} onChange={() => {}} />
            <ToggleSetting label="Messages formateur" desc="Recevoir les messages de votre formateur" value={true} onChange={() => {}} />
          </Card>

          {/* PWA */}
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Application hors ligne (PWA)</h3>
            <ToggleSetting label="Mode hors connexion" desc="Télécharger les modules pour travailler sans internet" value={settings.offlineMode} onChange={v => { updateSettings({offlineMode:v}); if(v) showNotif('📱 Mode hors ligne activé', 'success'); }} />
            <div style={{ marginTop: 10, padding: '10px 12px', background: '#E1F5EE', borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: '#085041' }}>💡 Installez l'application sur votre téléphone : ouvrez le menu de votre navigateur et choisissez "Ajouter à l'écran d'accueil".</p>
            </div>
            <button onClick={() => showNotif('📦 Modules téléchargés pour mode hors ligne !', 'success')} className="btn-secondary" style={{ marginTop: 10, width: '100%', justifyContent: 'center', fontSize: 13 }}>
              <Download size={13} /> Télécharger les modules A1
            </button>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button onClick={logout} style={{ color: '#D85A30', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({ label, desc, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #f3f4f6' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#9ca3af' }}>{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: value ? '#185FA5' : '#e5e7eb', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: value ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', display: 'block' }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// HELP
// ════════════════════════════════════════════════════════════════
export function HelpPage() {
  const { setPage } = useStore();
  const FAQS = [
    { q: "Comment reprendre là où je me suis arrêté ?", a: "Votre progression est sauvegardée automatiquement. Allez sur le tableau de bord et cliquez sur 'Continuer'." },
    { q: "Comment fonctionne le test de positionnement ?", a: "Il évalue votre grammaire, vocabulaire et compréhension en quelques minutes et vous oriente vers le bon niveau." },
    { q: "Puis-je utiliser la plateforme sans internet ?", a: "Oui ! Allez dans Paramètres > Mode hors ligne et téléchargez vos modules. Vous pourrez travailler sans connexion." },
    { q: "Comment contacter mon formateur ?", a: "Utilisez le bouton 'Message' dans l'espace formateur, ou cliquez sur votre profil apprenant." },
    { q: "Comment télécharger mon attestation PDF ?", a: "Allez dans Ma progression > Télécharger mon attestation PDF." },
  ];
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>J'ai besoin d'aide</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Questions fréquentes et contact</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setPage('ai')} className="btn-primary">🤖 Poser une question à l'IA</button>
        <button className="btn-secondary">📧 Contacter le formateur</button>
      </div>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Questions fréquentes</h3>
        {FAQS.map((f, i) => (
          <details key={i} style={{ marginBottom: 10, padding: '10px 14px', background: '#f9fafb', borderRadius: 8 }}>
            <summary style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>{f.q}</summary>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8, lineHeight: 1.6 }}>{f.a}</p>
          </details>
        ))}
      </Card>
    </div>
  );
}
