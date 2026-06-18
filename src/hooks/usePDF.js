import { useState } from 'react'
import * as XLSX from 'xlsx'

// ─── Génération PDF côté client (jsPDF) ────────────────────
export function usePDFGenerator() {
  const [generating, setGenerating] = useState(false)

  const generateAttestation = async ({ learner, group, center = 'Centre de formation' }) => {
    setGenerating(true)
    try {
      // Créer le HTML puis l'ouvrir dans une nouvelle fenêtre pour impression
      const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; padding: 20mm; color: #1a1a1a; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #185FA5; padding-bottom: 12px; margin-bottom: 24px; }
  .logo { font-size: 24px; font-weight: 900; color: #185FA5; }
  .center { text-align: center; padding: 40px 0; }
  .level { font-size: 48px; font-weight: 900; color: #185FA5; margin: 20px 0; }
  .name { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .badge { display: inline-block; padding: 6px 16px; background: #1D9E75; color: white; border-radius: 20px; font-size: 14px; font-weight: 700; }
  .info-box { border: 2px solid #185FA5; border-radius: 10px; padding: 16px; max-width: 300px; margin: 24px auto; }
  .unofficial { font-size: 11px; color: #9ca3af; margin-top: 20px; }
  .footer { position: fixed; bottom: 20mm; left: 20mm; right: 20mm; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 8px; }
  @media print { .footer { position: fixed; } }
</style>
</head>
<body>
<div class="header">
  <div><div class="logo">EnglishPath</div><div style="font-size:11px;color:#666">${center} — Programme Navigate A1–B1</div></div>
  <div style="font-size:11px;color:#666;text-align:right">${date}</div>
</div>
<div class="center">
  <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px">Attestation de participation</div>
  <div class="name">${learner?.firstName || ''} ${learner?.lastName || ''}</div>
  <div style="color:#6b7280;margin-bottom:20px">a suivi et complété le programme de formation en anglais</div>
  <div class="level">${learner?.level || 'A1'}</div>
  <div class="badge">Niveau ${learner?.level || 'A1'} — ${getLevelLabel(learner?.level)}</div>
  <div style="margin-top:16px;font-size:13px;color:#6b7280">
    XP total : ${learner?.xp || 0} points · Exercices : ${learner?.exercises || 0} · Série : ${learner?.streak || 0} jours
  </div>
  <div class="info-box">
    <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Groupe</div>
    <div style="font-weight:700;margin-bottom:8px">${group || 'Groupe #AVENIR Le Havre'}</div>
    <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Centre de formation</div>
    <div style="font-weight:700;margin-bottom:8px">${center}</div>
    <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Date</div>
    <div style="font-weight:700">${date}</div>
  </div>
  <div class="unofficial">Document non officiel — attestation de suivi à titre indicatif<br>Dispositif #AVENIR — Région Normandie</div>
</div>
<div class="footer">
  <span>EnglishPath — ${center}</span>
  <span>${date}</span>
  <span>Région Normandie · Dispositif #AVENIR</span>
</div>
</body></html>`

      openPrintWindow(html, `Attestation_${learner?.firstName}_${learner?.lastName}`)
    } finally {
      setGenerating(false)
    }
  }

  const generateExerciseSheet = async ({ unit, level = 'A1', group, center = 'Centre de formation', color = 'color', exercises }) => {
    setGenerating(true)
    try {
      const date = new Date().toLocaleDateString('fr-FR')
      const primaryColor = color === 'bw' ? '#333' : '#185FA5'
      const accent = color === 'bw' ? '#666' : '#1D9E75'

      const exercisesHTML = exercises?.map((ex, idx) => {
        if (ex.type === 'qcm') return `
          <div class="exercise">
            <div class="ex-title">Exercice ${idx + 1} — Choisissez la bonne réponse</div>
            <p class="question">${ex.question}</p>
            <div class="options">
              ${ex.options.map((opt, i) => `
                <label class="option"><input type="radio" name="ex${idx}_${i}"> ${opt}</label>
              `).join('')}
            </div>
          </div>`
        if (ex.type === 'fill') return `
          <div class="exercise">
            <div class="ex-title">Exercice ${idx + 1} — Complétez</div>
            <p class="hint">Mots à utiliser : ${ex.blanks?.join(' · ')}</p>
            <p class="question">${ex.sentence?.replace(/_+/g, '<span class="blank"></span>')}</p>
          </div>`
        if (ex.type === 'match') return `
          <div class="exercise">
            <div class="ex-title">Exercice ${idx + 1} — Associez anglais et français</div>
            <div class="match-grid">
              <div class="match-col">${ex.pairs?.map(p => `<div class="match-item">${p.en}</div>`).join('')}</div>
              <div class="match-col">${ex.pairs?.sort(() => Math.random() - 0.5).map(p => `<div class="match-item">${p.fr}</div>`).join('')}</div>
            </div>
          </div>`
        return ''
      }).join('') || '<p>Aucun exercice sélectionné</p>'

      const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>
        * { box-sizing: border-box; } body { font-family: Arial, sans-serif; font-size: 12px; padding: 15mm 20mm; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${primaryColor}; padding-bottom: 10px; margin-bottom: 16px; }
        .logo { font-size: 18px; font-weight: 900; color: ${primaryColor}; }
        .badge { background: ${accent}; color: white; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .meta { display: flex; gap: 20px; font-size: 11px; color: #666; margin-bottom: 16px; }
        .exercise { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 14px; }
        .ex-title { font-weight: 700; color: ${primaryColor}; margin-bottom: 8px; font-size: 11px; text-transform: uppercase; }
        .question { font-size: 13px; margin-bottom: 8px; font-weight: 500; }
        .hint { font-size: 11px; color: #6b7280; font-style: italic; margin-bottom: 8px; background: #f9fafb; padding: 4px 8px; border-radius: 4px; }
        .options { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .option { display: flex; align-items: center; gap: 6px; font-size: 12px; }
        .blank { display: inline-block; width: 70px; border-bottom: 1.5px solid #333; margin: 0 4px; }
        .match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .match-item { border: 1px solid #e5e7eb; padding: 6px 10px; border-radius: 4px; margin-bottom: 6px; font-size: 12px; }
        .footer { position: fixed; bottom: 10mm; left: 20mm; right: 20mm; display: flex; justify-content: space-between; font-size: 9px; color: #9ca3af; border-top: 0.5px solid #e5e7eb; padding-top: 4px; }
      </style></head><body>
        <div class="header">
          <div><div class="logo">EnglishPath</div><div style="font-size:10px;color:#666">${center}</div></div>
          <div style="text-align:right"><span class="badge">Unité ${unit} — ${level}</span></div>
        </div>
        <div class="meta">
          <span>📅 ${date}</span>
          <span>👤 Nom : _______________________</span>
          <span>📚 ${group || 'Groupe ___________________'}</span>
        </div>
        <h1 style="font-size:16px;color:${primaryColor};margin-bottom:14px">Exercices — Unité ${unit}</h1>
        ${exercisesHTML}
        <div class="footer"><span>EnglishPath</span><span>Score : ___/___</span><span>${center} · ${date}</span></div>
      </body></html>`

      openPrintWindow(html, `Exercices_Unite${unit}_${level}`)
    } finally {
      setGenerating(false)
    }
  }

  const generateVocabCards = async ({ words, unit, center = 'Centre de formation' }) => {
    setGenerating(true)
    try {
      const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>
        body { font-family: Arial, sans-serif; padding: 10mm; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .card { border: 2px solid #185FA5; border-radius: 8px; padding: 12px; text-align: center; min-height: 100px; display: flex; flex-direction: column; justify-content: space-between; }
        .en { font-size: 18px; font-weight: 900; color: #185FA5; }
        .phonetic { font-size: 11px; color: #6b7280; font-style: italic; }
        .fr { font-size: 13px; background: #f3f4f6; border-radius: 4px; padding: 4px 8px; }
        .example { font-size: 10px; color: #9ca3af; font-style: italic; }
        @media print { .grid { page-break-inside: avoid; } }
      </style></head><body>
        <div style="text-align:center;margin-bottom:12px;font-size:14px;font-weight:700;color:#185FA5">
          EnglishPath — Cartes vocabulaire Unité ${unit} · ${center}
        </div>
        <div class="grid">
          ${(words || []).map(w => `
            <div class="card">
              <div class="en">${w.en}</div>
              <div class="phonetic">/${w.phonetic || '...'}/</div>
              <div class="fr">${w.fr}</div>
              ${w.example ? `<div class="example">"${w.example}"</div>` : ''}
            </div>
          `).join('')}
        </div>
      </body></html>`

      openPrintWindow(html, `Vocab_Unite${unit}`)
    } finally {
      setGenerating(false)
    }
  }

  return { generateAttestation, generateExerciseSheet, generateVocabCards, generating }
}

// ─── Export Excel ─────────────────────────────────────────────
export function useExcelExport() {
  const exportGroupResults = (learners, groupName) => {
    const data = learners.map(l => ({
      'Prénom': l.first_name || l.name?.split(' ')[0] || '',
      'Nom': l.last_name || l.name?.split(' ')[1] || '',
      'Email': l.email || '',
      'Niveau': l.level || 'A1',
      'Unité actuelle': l.current_unit || l.unit || 1,
      'XP': l.xp || 0,
      'Streak (jours)': l.streak || 0,
      'Progression (%)': l.progress || 0,
      'Score moyen (%)': l.avg_score || l.avgScore || '-',
      'Exercices complétés': l.exercises_done || '-',
      'Dernière connexion': l.last_active || l.lastSeen || '-',
      'Alerte décrochage': l.alert ? 'OUI ⚠️' : 'Non',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    // Largeurs colonnes
    ws['!cols'] = [
      { wch: 14 }, { wch: 14 }, { wch: 28 }, { wch: 8 }, { wch: 14 },
      { wch: 8 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 18 },
      { wch: 18 }, { wch: 18 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Résultats')

    // Feuille stats globales
    const stats = [{
      'Groupe': groupName,
      'Nombre d\'apprenants': learners.length,
      'Progression moyenne': Math.round(learners.reduce((a, l) => a + (l.progress || 0), 0) / learners.length) + '%',
      'Alertes décrochage': learners.filter(l => l.alert).length,
      'Date export': new Date().toLocaleDateString('fr-FR'),
    }]
    const ws2 = XLSX.utils.json_to_sheet(stats)
    XLSX.utils.book_append_sheet(wb, ws2, 'Statistiques')

    XLSX.writeFile(wb, `EnglishPath_${groupName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportProgressHistory = (history, learnerName) => {
    const data = history.map(h => ({
      'Date': new Date(h.completed_at || h.completedAt).toLocaleDateString('fr-FR'),
      'Unité': h.unit_id || h.unitId,
      'Chapitre': h.chapter_id || h.chapterId,
      'Score (%)': h.score,
      'Temps (min)': Math.round((h.time_spent || 0) / 60),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Historique')
    XLSX.writeFile(wb, `Progression_${learnerName}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return { exportGroupResults, exportProgressHistory }
}

// ─── Helpers ──────────────────────────────────────────────────
function openPrintWindow(html, filename) {
  const win = window.open('', '_blank', 'width=800,height=600')
  if (!win) {
    // Fallback : télécharger en HTML
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.html`
    a.click()
    URL.revokeObjectURL(url)
    return
  }
  win.document.write(html)
  win.document.close()
  setTimeout(() => {
    win.focus()
    win.print()
  }, 500)
}

function getLevelLabel(level) {
  const labels = { A1: 'Débutant', A2: 'Élémentaire', B1: 'Intermédiaire', 'B1+': 'Intermédiaire avancé', TELC: 'Certification TELC' }
  return labels[level] || level
}
