import { useState } from 'react'
import { Card, Alert, LevelBadge, Spinner } from '../components/UI.jsx'
import { Printer, Download, FileText, Award, BookOpen, ClipboardCheck, Grid, RefreshCw } from 'lucide-react'
import { usePDFGenerator } from '../hooks/usePDF.js'
import { EXERCISE_BANK, getAllExercises } from '../data/exercises/exerciseBank.js'
import useStore from '../lib/store.js'

const DOC_TYPES = [
  { id: 'exercises',    icon: '📝', label: 'Fiche d\'exercices',   desc: 'QCM, textes à trous, association',        color: '#185FA5', bg: '#E6F1FB' },
  { id: 'vocab',        icon: '🗂️', label: 'Cartes vocabulaire',   desc: 'Flashcards, mots mêlés, mots croisés',    color: '#534AB7', bg: '#EEEDFE' },
  { id: 'evaluation',   icon: '📊', label: 'Évaluation',           desc: 'Test de fin de chapitre avec barème',     color: '#1D9E75', bg: '#E1F5EE' },
  { id: 'revision',     icon: '📋', label: 'Fiche de révision',    desc: 'Résumé grammaire + vocabulaire',          color: '#BA7517', bg: '#FAEEDA' },
  { id: 'correction',   icon: '✅', label: 'Corrigés formateur',   desc: 'Réponses et explications détaillées',     color: '#639922', bg: '#EAF3DE' },
  { id: 'attestation',  icon: '🏆', label: 'Attestation',          desc: 'PDF personnalisé avec logo du centre',    color: '#D85A30', bg: '#FAECE7' },
]

const UNIT_VOCAB = {
  1: [
    { en: 'hello', fr: 'bonjour', phonetic: 'həˈloʊ', example: 'Hello, my name is Anna.' },
    { en: 'name', fr: 'nom', phonetic: 'neɪm', example: 'What is your name?' },
    { en: 'surname', fr: 'nom de famille', phonetic: 'ˈsɜːrneɪm', example: 'My surname is Dupont.' },
    { en: 'nationality', fr: 'nationalité', phonetic: 'næʃəˈnæləti', example: "I'm French." },
    { en: 'country', fr: 'pays', phonetic: 'ˈkʌntri', example: 'Which country are you from?' },
    { en: 'job', fr: 'métier', phonetic: 'dʒɒb', example: "What's your job?" },
  ],
  3: [
    { en: 'neighbour', fr: 'voisin(e)', phonetic: 'ˈneɪbər', example: 'My neighbour is friendly.' },
    { en: 'flat', fr: 'appartement', phonetic: 'flæt', example: 'She lives in a flat.' },
    { en: 'garden', fr: 'jardin', phonetic: 'ˈɡɑːrdən', example: 'Our garden has flowers.' },
    { en: 'bedroom', fr: 'chambre', phonetic: 'ˈbedruːm', example: 'The flat has two bedrooms.' },
    { en: 'house', fr: 'maison', phonetic: 'haʊs', example: 'They have a big house.' },
    { en: 'car', fr: 'voiture', phonetic: 'kɑːr', example: "He's got a red car." },
  ],
}

export function PrintPage() {
  const { showNotif, profile } = useStore()
  const { generateAttestation, generateExerciseSheet, generateVocabCards, generating } = usePDFGenerator()

  const [cfg, setCfg] = useState({
    type: 'exercises',
    level: 'A1',
    unit: 3,
    format: 'a4_portrait',
    color: 'color',
    logo: true,
    learnerName: '',
    groupName: 'Groupe #AVENIR Le Havre',
    center: 'Centre de formation',
    includeAnswers: false,
  })

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }))

  const getExercisesForUnit = () =>
    getAllExercises()
      .filter(e => e.unit === cfg.unit && e.level === cfg.level)
      .slice(0, 6)

  const handleGenerate = async () => {
    const learner = {
      firstName: cfg.learnerName.split(' ')[0] || '',
      lastName: cfg.learnerName.split(' ').slice(1).join(' ') || '',
      level: cfg.level,
      xp: profile?.xp || 1240,
      streak: profile?.streak || 7,
      exercises: 47,
    }

    if (cfg.type === 'attestation') {
      await generateAttestation({ learner, group: cfg.groupName, center: cfg.center })
    } else if (cfg.type === 'vocab') {
      const words = UNIT_VOCAB[cfg.unit] || UNIT_VOCAB[3]
      await generateVocabCards({ words, unit: cfg.unit, center: cfg.center })
    } else {
      const exercises = getExercisesForUnit()
      await generateExerciseSheet({
        unit: cfg.unit, level: cfg.level,
        group: cfg.groupName, center: cfg.center,
        color: cfg.color, exercises,
      })
    }
    showNotif('📄 Document prêt — fenêtre d\'impression ouverte', 'success')
  }

  const selectedType = DOC_TYPES.find(d => d.id === cfg.type)

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Impression pédagogique</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Générez des fiches, exercices, corrigés et attestations prêts à imprimer
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left — config */}
        <div>
          {/* Type de document */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Type de document</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {DOC_TYPES.map(t => (
                <div key={t.id} onClick={() => set('type', t.id)} style={{
                  padding: 12, border: `1.5px solid ${cfg.type === t.id ? t.color : '#e5e7eb'}`,
                  borderRadius: 10, cursor: 'pointer', background: cfg.type === t.id ? t.bg : '#fff',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: cfg.type === t.id ? t.color : '#1a1a1a' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contenu */}
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Contenu</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 5 }}>Niveau CECRL</label>
                <select value={cfg.level} onChange={e => set('level', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}>
                  {['A1','A2','B1'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 5 }}>Unité</label>
                <select value={cfg.unit} onChange={e => set('unit', Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(u => <option key={u} value={u}>Unité {u}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 5 }}>Centre de formation</label>
                <input value={cfg.center} onChange={e => set('center', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 5 }}>Groupe</label>
                <input value={cfg.groupName} onChange={e => set('groupName', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 5 }}>
                Nom de l'apprenant (optionnel)
              </label>
              <input
                value={cfg.learnerName}
                onChange={e => set('learnerName', e.target.value)}
                placeholder="Prénom Nom"
                style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={cfg.logo} onChange={e => set('logo', e.target.checked)} />
                Logo du centre
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={cfg.includeAnswers} onChange={e => set('includeAnswers', e.target.checked)} />
                Inclure les corrigés
              </label>
            </div>
          </Card>

          {/* Aperçu des exercices sélectionnés */}
          {cfg.type === 'exercises' && (
            <Card>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                Exercices inclus — Unité {cfg.unit} / {cfg.level}
              </h3>
              {getExercisesForUnit().length === 0 ? (
                <p style={{ fontSize: 13, color: '#9ca3af' }}>Aucun exercice disponible pour cette sélection.</p>
              ) : (
                getExercisesForUnit().map((ex, i) => (
                  <div key={ex.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '0.5px solid #f3f4f6', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, width: 20, color: '#9ca3af' }}>{i+1}</span>
                    <span style={{ fontSize: 11, background: '#f3f4f6', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                      {ex.type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 13, flex: 1 }}>{ex.question || ex.sentence || `Association (${ex.pairs?.length} paires)`}</span>
                  </div>
                ))
              )}
            </Card>
          )}
        </div>

        {/* Right — format + generate */}
        <div>
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Format</h3>
            {[
              { id: 'a4_portrait',  label: '📄 A4 Portrait' },
              { id: 'a4_landscape', label: '📄 A4 Paysage' },
              { id: 'simplified',   label: '🖨️ Simplifié (photocopie)' },
            ].map(f => (
              <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="radio" name="format" value={f.id} checked={cfg.format === f.id} onChange={() => set('format', f.id)} />
                {f.label}
              </label>
            ))}
            <div style={{ marginTop: 10, borderTop: '0.5px solid #f3f4f6', paddingTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Couleur</div>
              {[{ id: 'color', label: '🎨 Couleur' }, { id: 'bw', label: '⬛ Noir & blanc' }].map(c => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="color" value={c.id} checked={cfg.color === c.id} onChange={() => set('color', c.id)} />
                  {c.label}
                </label>
              ))}
            </div>
          </Card>

          {/* Summary */}
          <Card style={{ marginBottom: 14, background: selectedType?.bg || '#f9fafb', border: `1px solid ${selectedType?.color || '#e5e7eb'}` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{selectedType?.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: selectedType?.color, marginBottom: 4 }}>{selectedType?.label}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{selectedType?.desc}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>
              <div>Niveau : <strong>{cfg.level}</strong></div>
              <div>Unité : <strong>{cfg.unit}</strong></div>
              <div>Centre : <strong>{cfg.center}</strong></div>
              {cfg.learnerName && <div>Apprenant : <strong>{cfg.learnerName}</strong></div>}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={handleGenerate} disabled={generating} className="btn-primary"
              style={{ justifyContent: 'center', padding: '12px 0', fontSize: 14 }}>
              {generating ? <><Spinner size={16} /> Génération…</> : <><Printer size={15} /> Générer et imprimer</>}
            </button>
            <button onClick={handleGenerate} disabled={generating} className="btn-secondary"
              style={{ justifyContent: 'center' }}>
              <Download size={14} /> Télécharger HTML
            </button>
          </div>

          <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', lineHeight: 1.5, textAlign: 'center' }}>
            Les documents s'ouvrent dans une fenêtre d'impression.<br />
            Compatible A4, format lisible, adapté aux débutants.
          </div>
        </div>
      </div>
    </div>
  )
}
