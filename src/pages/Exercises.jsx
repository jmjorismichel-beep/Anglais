import { useState, useCallback } from 'react';
import { EXERCISES } from '../data/courseData.js';
import { Tabs, AudioPlayer, Card, ProgressBar, FavoriteBtn } from '../components/UI.jsx';
import { Check, X, RefreshCw, ChevronRight, Lightbulb } from 'lucide-react';
import useStore from '../lib/store.js';

const EX_TABS = [
  { id: 'qcm', label: 'QCM' },
  { id: 'fill', label: 'Texte à trous' },
  { id: 'match', label: 'Association' },
  { id: 'audio', label: 'Écoute' },
  { id: 'vocab', label: 'Vocabulaire' },
];

// Pool all exercises
const ALL_EXERCISES = Object.values(EXERCISES).flat().filter(e => e.type === 'qcm');
const FILL_EXERCISES = Object.values(EXERCISES).flat().filter(e => e.type === 'fill');
const MATCH_EXERCISES = Object.values(EXERCISES).flat().filter(e => e.type === 'match');

export function ExercisesPage() {
  const [tab, setTab] = useState('qcm');
  const { addXP, showNotif } = useStore();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Exercices interactifs</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Unit 3 — People and possessions · Niveau A1
        </p>
      </div>
      <Tabs tabs={EX_TABS} active={tab} onChange={setTab} />
      {tab === 'qcm' && <QCMExercise exercises={ALL_EXERCISES} />}
      {tab === 'fill' && <FillExercise exercises={FILL_EXERCISES} />}
      {tab === 'match' && <MatchExercise exercises={MATCH_EXERCISES} />}
      {tab === 'audio' && <AudioExercise />}
      {tab === 'vocab' && <VocabCards />}
    </div>
  );
}

// ─── QCM ─────────────────────────────────────────────────────────────────────
function QCMExercise({ exercises }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { addXP, showNotif } = useStore();
  const ex = exercises[idx % exercises.length];

  const answer = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === ex.answer) {
      addXP(10);
      showNotif('✅ Correct ! +10 XP', 'success');
    } else {
      showNotif('❌ Pas tout à fait…', 'error');
    }
  };

  const next = () => { setSelected(null); setShowHint(false); setIdx(i => i + 1); };
  const reset = () => { setSelected(null); setShowHint(false); };

  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
        <span>Question {(idx % exercises.length) + 1} / {exercises.length}</span>
        <span style={{ color: '#185FA5', fontWeight: 500 }}>Score : {Math.round((idx * 10))} XP</span>
      </div>
      <ProgressBar value={((idx % exercises.length) / exercises.length) * 100} color="blue" />

      <Card style={{ marginTop: 14 }}>
        {ex.audio && <AudioPlayer filename={ex.audio} title="Écoutez avant de répondre" subtitle={ex.audio} />}

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, background: '#E6F1FB', color: '#185FA5', padding: '3px 10px', borderRadius: 8, marginBottom: 10 }}>
            A1 · Grammaire
          </div>
          <p style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5 }}>{ex.question}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ex.options.map((opt, i) => {
            let bg = '#fff', border = '#e5e7eb', color = '#374151';
            if (selected !== null) {
              if (i === ex.answer) { bg = '#E1F5EE'; border = '#1D9E75'; color = '#04342C'; }
              else if (i === selected && i !== ex.answer) { bg = '#FAECE7'; border = '#D85A30'; color = '#4A1B0C'; }
            }
            return (
              <button key={i} onClick={() => answer(i)} style={{
                padding: '12px 16px', border: `1px solid ${border}`, background: bg, borderRadius: 8,
                fontSize: 14, textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
                color, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: bg === '#fff' ? '#f9fafb' : bg, border: `1px solid ${border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {['A','B','C','D'][i]}
                </span>
                {opt.replace(/^[A-D]\.\s*/, '')}
                {selected !== null && i === ex.answer && <Check size={16} style={{ marginLeft: 'auto', color: '#1D9E75' }} />}
                {selected !== null && i === selected && i !== ex.answer && <X size={16} style={{ marginLeft: 'auto', color: '#D85A30' }} />}
              </button>
            );
          })}
        </div>

        {/* Explication */}
        {selected !== null && (
          <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 8, background: selected === ex.answer ? '#E1F5EE' : '#FAECE7', borderLeft: `3px solid ${selected === ex.answer ? '#1D9E75' : '#D85A30'}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: selected === ex.answer ? '#04342C' : '#4A1B0C' }}>
              {selected === ex.answer ? '✅ Bravo !' : '❌ Pas tout à fait…'}
            </div>
            <div style={{ fontSize: 13, color: selected === ex.answer ? '#085041' : '#712B13', lineHeight: 1.5 }}>{ex.explanation}</div>
          </div>
        )}

        {/* Hint */}
        {selected === null && (
          <button onClick={() => setShowHint(h => !h)} style={{ marginTop: 12, fontSize: 12, color: '#BA7517', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Lightbulb size={14} /> {showHint ? 'Masquer l\'indice' : 'Afficher un indice'}
          </button>
        )}
        {showHint && <div style={{ fontSize: 12, color: '#412402', background: '#FAEEDA', padding: '8px 12px', borderRadius: 6, marginTop: 6 }}>💡 {ex.explanation?.split('.')[0]}.</div>}
      </Card>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={reset} className="btn-secondary">
          <RefreshCw size={14} /> Recommencer
        </button>
        <button onClick={next} className="btn-primary" disabled={selected === null}>
          {idx < exercises.length - 1 ? 'Question suivante' : 'Recommencer'} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Fill in the blanks ──────────────────────────────────────────────────────
function FillExercise({ exercises }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [checked, setChecked] = useState(false);
  const { addXP, showNotif } = useStore();
  const ex = exercises[idx % exercises.length];

  const blanks = ex?.blanks || [];

  const check = () => {
    setChecked(true);
    const correct = answers.filter((a, i) => a?.trim().toLowerCase() === blanks[i]?.toLowerCase()).length;
    if (correct === blanks.length) { addXP(15); showNotif('🎉 Parfait ! +15 XP', 'success'); }
    else { showNotif(`${correct}/${blanks.length} correct(s)`, 'warning'); }
  };

  const reset = () => { setAnswers([]); setChecked(false); };
  const next = () => { setIdx(i => i + 1); reset(); };

  const isCorrect = (i) => answers[i]?.trim().toLowerCase() === blanks[i]?.toLowerCase();

  return (
    <Card>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, background: '#E1F5EE', color: '#085041', padding: '3px 10px', borderRadius: 8, display: 'inline-block', marginBottom: 10 }}>A1 · Déterminants possessifs</div>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Complétez avec les bons mots :</p>
        <p style={{ fontSize: 13, color: '#6b7280', background: '#f9fafb', padding: '8px 12px', borderRadius: 6 }}>{ex?.hint}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {blanks.map((blank, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#9ca3af', width: 24 }}>{i+1}.</span>
            <input
              type="text"
              value={answers[i] || ''}
              onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
              disabled={checked}
              placeholder={`Réponse ${i+1}…`}
              style={{
                flex: 1, padding: '10px 14px', border: `1px solid ${checked ? (isCorrect(i) ? '#1D9E75' : '#D85A30') : '#d1d5db'}`,
                borderRadius: 8, fontSize: 14,
                background: checked ? (isCorrect(i) ? '#E1F5EE' : '#FAECE7') : '#fff',
              }}
            />
            {checked && (isCorrect(i) ? <Check size={18} color="#1D9E75" /> : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={18} color="#D85A30" />
                <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 600 }}>→ {blank}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {checked && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: '#f9fafb', borderRadius: 8, fontSize: 13, color: '#374151' }}>
          💡 <strong>Rappel :</strong> my (mon/ma) · your (ton/ta) · his (son/sa, masc.) · her (son/sa, fém.) · our (notre) · their (leur)
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={reset} className="btn-secondary"><RefreshCw size={14} /> Recommencer</button>
        {!checked
          ? <button onClick={check} className="btn-primary"><Check size={14} /> Vérifier</button>
          : <button onClick={next} className="btn-primary">Exercice suivant <ChevronRight size={14} /></button>
        }
      </div>
    </Card>
  );
}

// ─── Match ───────────────────────────────────────────────────────────────────
function MatchExercise({ exercises }) {
  const [idx, setIdx] = useState(0);
  const [selectedEn, setSelectedEn] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrong, setWrong] = useState(null);
  const { addXP, showNotif } = useStore();
  const ex = exercises[idx % exercises.length];
  const pairs = ex?.pairs || [];
  const shuffledFr = [...pairs].sort(() => Math.random() - 0.5);

  const selectEn = (en) => { if (matched[en]) return; setSelectedEn(en); };
  const selectFr = (fr) => {
    if (!selectedEn) return;
    const correct = pairs.find(p => p.en === selectedEn)?.fr === fr;
    if (correct) {
      const m = { ...matched, [selectedEn]: fr };
      setMatched(m);
      setSelectedEn(null);
      if (Object.keys(m).length === pairs.length) { addXP(20); showNotif('🎉 Toutes les associations sont correctes ! +20 XP', 'success'); }
    } else {
      setWrong(fr);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const allDone = Object.keys(matched).length === pairs.length;

  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Association anglais ↔ français</h3>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>Cliquez sur un mot anglais, puis sur sa traduction française.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pairs.map(p => (
            <button key={p.en} onClick={() => selectEn(p.en)} style={{
              padding: '10px 14px', borderRadius: 8, border: `1px solid ${matched[p.en] ? '#1D9E75' : selectedEn === p.en ? '#185FA5' : '#e5e7eb'}`,
              background: matched[p.en] ? '#E1F5EE' : selectedEn === p.en ? '#E6F1FB' : '#fff',
              color: matched[p.en] ? '#085041' : selectedEn === p.en ? '#185FA5' : '#374151',
              fontSize: 14, fontWeight: 500, cursor: matched[p.en] ? 'default' : 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}>
              {p.en}
              {matched[p.en] && <Check size={14} style={{ float: 'right', color: '#1D9E75' }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shuffledFr.map(p => {
            const isMatched = Object.values(matched).includes(p.fr);
            const isWrong = wrong === p.fr;
            return (
              <button key={p.fr} onClick={() => !isMatched && selectFr(p.fr)} style={{
                padding: '10px 14px', borderRadius: 8, border: `1px solid ${isMatched ? '#1D9E75' : isWrong ? '#D85A30' : '#e5e7eb'}`,
                background: isMatched ? '#E1F5EE' : isWrong ? '#FAECE7' : '#f9fafb',
                color: isMatched ? '#085041' : isWrong ? '#4A1B0C' : '#374151',
                fontSize: 14, cursor: isMatched ? 'default' : 'pointer', textAlign: 'left',
                animation: isWrong ? 'pulse 0.3s ease' : 'none', transition: 'all 0.15s',
              }}>
                {p.fr}
              </button>
            );
          })}
        </div>
      </div>

      {allDone && (
        <div style={{ marginTop: 14, padding: '14px 16px', background: '#E1F5EE', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#085041' }}>Excellent ! Toutes les associations sont correctes !</div>
          <button onClick={() => { setMatched({}); setSelectedEn(null); setIdx(i=>i+1); }} className="btn-primary" style={{ marginTop: 10, background: '#1D9E75' }}>
            Exercice suivant <ChevronRight size={14} />
          </button>
        </div>
      )}
    </Card>
  );
}

// ─── Audio comprehension ─────────────────────────────────────────────────────
function AudioExercise() {
  const [q, setQ] = useState(null);
  const AUDIO_QS = [
    { mp3: '03-01.mp3', title: '3.1 My neighbours', question: 'What does the speaker talk about?', options: ['A. His job', 'B. His neighbours', 'C. His car', 'D. His family'], answer: 1 },
    { mp3: '03-04.mp3', title: '3.2 Possessions — Dialogue', question: 'How many bicycles does she have?', options: ['A. One', 'B. Two', 'C. Three', 'D. None'], answer: 1 },
    { mp3: 'Voxpops Unit 3.mp4', title: 'Voxpops Unit 3 — Témoignages', question: 'What topic is discussed in these voxpops?', options: ["A. Food", "B. People's possessions", "C. Travel", "D. Work"], answer: 1 },
  ];
  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🎧 Fichiers audio — Unit 3</h3>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>Écoutez les fichiers puis répondez aux questions de compréhension.</p>
        {AUDIO_QS.map((aq, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <AudioPlayer filename={aq.mp3} title={aq.title} subtitle={aq.mp3} />
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>❓ {aq.question}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {aq.options.map((opt, j) => (
                <button key={j} onClick={() => { if (j===aq.answer) { useStore.getState().addXP(8); useStore.getState().showNotif('✅ Correct ! +8 XP','success'); } else useStore.getState().showNotif('❌ Réécoutez le document','error'); }}
                  style={{ padding: '8px 12px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13, textAlign: 'left', cursor: 'pointer', background: '#fff', color: '#374151' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Vocab cards ─────────────────────────────────────────────────────────────
function VocabCards() {
  const WORDS = [
    { en: 'neighbour', fr: 'voisin(e)', ex: 'My neighbour is very friendly.' },
    { en: 'flat', fr: 'appartement', ex: "She lives in a flat in Paris." },
    { en: 'garden', fr: 'jardin', ex: 'Our garden has got flowers.' },
    { en: 'bedroom', fr: 'chambre', ex: 'The flat has got two bedrooms.' },
    { en: 'have got', fr: 'avoir (possession)', ex: "I've got a new bike." },
    { en: 'possessive', fr: 'possessif', ex: 'my, your, his, her, our, their' },
    { en: 'house', fr: 'maison', ex: 'They have a big house.' },
    { en: 'car', fr: 'voiture', ex: "He's got a red car." },
  ];
  const [flip, setFlip] = useState({});
  const [known, setKnown] = useState({});

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
        Cliquez sur une carte pour voir la traduction. Cochez "Je sais" pour mémoriser.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {WORDS.map((w, i) => (
          <div key={i} onClick={() => setFlip(f => ({...f,[i]:!f[i]}))} style={{
            background: known[i] ? '#E1F5EE' : flip[i] ? '#E6F1FB' : '#fff',
            border: `1px solid ${known[i] ? '#1D9E75' : flip[i] ? '#185FA5' : '#e5e7eb'}`,
            borderRadius: 12, padding: '1rem', cursor: 'pointer', minHeight: 110,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            transition: 'all 0.2s',
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: flip[i] ? '#185FA5' : '#1a1a1a', marginBottom: 4 }}>
                {flip[i] ? w.fr : w.en}
              </div>
              {flip[i] && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic' }}>{w.ex}</div>}
              {!flip[i] && <div style={{ fontSize: 11, color: '#9ca3af' }}>Cliquez pour voir</div>}
            </div>
            {flip[i] && (
              <button onClick={e => { e.stopPropagation(); setKnown(k => ({...k,[i]:!k[i]})); }} style={{
                marginTop: 8, fontSize: 11, padding: '4px 8px', borderRadius: 6, border: 'none',
                background: known[i] ? '#1D9E75' : '#f3f4f6', color: known[i] ? 'white' : '#374151',
                cursor: 'pointer', fontWeight: 500,
              }}>
                {known[i] ? '✓ Je sais' : '★ Marquer comme su'}
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
        {Object.values(known).filter(Boolean).length} / {WORDS.length} mots mémorisés
        <ProgressBar value={(Object.values(known).filter(Boolean).length / WORDS.length) * 100} color="teal" />
      </div>
    </div>
  );
}
