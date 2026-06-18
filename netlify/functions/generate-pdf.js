// netlify/functions/generate-pdf.js
// Génère des PDF côté serveur (attestations, fiches, corrigés)

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

  try {
    const {
      type,        // 'attestation' | 'exercises' | 'vocab' | 'evaluation' | 'correction'
      learner,     // { firstName, lastName, level, xp, progress }
      group,       // nom du groupe
      unit,        // numéro d'unité
      center,      // nom du centre
      content,     // contenu spécifique
      color,       // 'color' | 'bw'
      format,      // 'a4_portrait' | 'a4_landscape'
    } = JSON.parse(event.body)

    // Générer le HTML qui sera converti en PDF
    const html = generatePDFHTML({ type, learner, group, unit, center, content, color, format })

    // Retourner le HTML pour conversion côté client avec html2canvas/jsPDF
    // En production, utiliser puppeteer via une lambda dédiée
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, success: true }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    }
  }
}

function generatePDFHTML({ type, learner, group, unit, center = 'RÉCIFE', content, color }) {
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const primaryColor = color === 'bw' ? '#333' : '#185FA5'
  const accentColor = color === 'bw' ? '#666' : '#1D9E75'

  const baseStyles = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; background: white; }
      .page { width: 210mm; min-height: 297mm; padding: 20mm; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${primaryColor}; padding-bottom: 12px; margin-bottom: 20px; }
      .logo { font-size: 22px; font-weight: 900; color: ${primaryColor}; }
      .center-name { font-size: 10px; color: #666; }
      h1 { font-size: 18px; color: ${primaryColor}; margin-bottom: 8px; }
      h2 { font-size: 14px; color: ${primaryColor}; margin: 16px 0 8px; }
      .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: ${accentColor}; color: white; }
      .meta { display: flex; gap: 16px; font-size: 11px; color: #666; margin-bottom: 16px; }
      .exercise { margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; }
      .exercise-num { font-weight: 700; color: ${primaryColor}; margin-bottom: 6px; }
      .blank { display: inline-block; width: 80px; border-bottom: 1px solid #333; margin: 0 4px; }
      .answer-line { border-bottom: 1px solid #ccc; margin-bottom: 12px; height: 24px; }
      .footer { margin-top: auto; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; display: flex; justify-content: space-between; }
      .stars { color: ${color === 'bw' ? '#333' : '#BA7517'}; font-size: 16px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      th { background: ${primaryColor}; color: white; padding: 6px 10px; font-size: 11px; text-align: left; }
      td { padding: 6px 10px; border-bottom: 1px solid #f3f4f6; font-size: 11px; }
      tr:nth-child(even) td { background: #f9fafb; }
    </style>
  `

  if (type === 'attestation') {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${baseStyles}</head><body><div class="page">
      <div class="header">
        <div><div class="logo">EnglishPath</div><div class="center-name">${center} — Programme Navigate A1–B1</div></div>
        <div style="text-align:right;font-size:10px;color:#666">${date}</div>
      </div>
      <div style="text-align:center;padding:40px 0">
        <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Attestation de participation</div>
        <h1 style="font-size:26px;margin-bottom:8px">${learner?.firstName || ''} ${learner?.lastName || ''}</h1>
        <p style="color:#6b7280;margin-bottom:24px">a participé au programme de formation en anglais</p>
        <div style="font-size:32px;font-weight:900;color:${primaryColor};margin:20px 0">${learner?.level || 'A1'}</div>
        <p style="margin-bottom:8px">Niveau atteint : <span class="badge">${learner?.level || 'A1'} — ${learner?.level === 'A1' ? 'Débutant' : learner?.level === 'A2' ? 'Élémentaire' : 'Intermédiaire'}</span></p>
        <p style="font-size:11px;color:#6b7280">XP total : ${learner?.xp || 0} points · Exercices complétés : ${learner?.exercises || 0}</p>
        <div style="margin:32px auto;max-width:300px;border:2px solid ${primaryColor};border-radius:8px;padding:16px">
          <p style="font-size:10px;color:#666;margin-bottom:4px">Groupe</p>
          <p style="font-weight:700">${group || 'Groupe #AVENIR Le Havre'}</p>
          <p style="font-size:10px;color:#666;margin-top:8px">Centre de formation</p>
          <p style="font-weight:700">${center}</p>
        </div>
        <p style="font-size:10px;color:#9ca3af;margin-top:16px">Document non officiel — à titre indicatif</p>
      </div>
      <div class="footer"><span>EnglishPath — ${center}</span><span>${date}</span><span>Région Normandie · Dispositif #AVENIR</span></div>
    </div></body></html>`
  }

  if (type === 'exercises') {
    const exercises = content?.exercises || getDefaultExercises(unit)
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${baseStyles}</head><body><div class="page">
      <div class="header">
        <div><div class="logo">EnglishPath</div><div class="center-name">${center} — Fiche d'exercices</div></div>
        <div style="text-align:right"><span class="badge">Unité ${unit} — A1</span></div>
      </div>
      <div class="meta">
        <span>📅 ${date}</span>
        <span>👤 ${learner?.firstName || '____________________'} ${learner?.lastName || ''}</span>
        <span>📚 Groupe : ${group || '____________________'}</span>
      </div>
      <h1>Exercices — Unité ${unit}</h1>
      ${exercises.map((ex, i) => `
        <div class="exercise">
          <div class="exercise-num">Exercice ${i + 1} — ${ex.type_label}</div>
          <p style="margin-bottom:10px">${ex.instruction}</p>
          ${ex.questions.map((q, j) => `
            <div style="margin-bottom:10px">
              <p style="margin-bottom:6px">${j + 1}. ${q.text}</p>
              ${q.type === 'qcm' ? q.options.map(o => `
                <label style="display:block;margin-left:16px;margin-bottom:4px">
                  <input type="checkbox" style="margin-right:6px">${o}
                </label>`).join('') : `<div class="answer-line"></div>`}
            </div>
          `).join('')}
        </div>
      `).join('')}
      <div class="footer"><span>EnglishPath</span><span>/___</span><span>${center} — Document formateur</span></div>
    </div></body></html>`
  }

  if (type === 'vocab') {
    const words = content?.words || getDefaultVocab(unit)
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${baseStyles}</head><body><div class="page">
      <div class="header">
        <div><div class="logo">EnglishPath</div><div class="center-name">${center} — Cartes vocabulaire</div></div>
        <span class="badge">Unité ${unit}</span>
      </div>
      <h1 style="margin-bottom:16px">Vocabulaire — Unité ${unit}</h1>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${words.map(w => `
          <div style="border:1.5px solid ${primaryColor};border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:18px;font-weight:900;color:${primaryColor};margin-bottom:4px">${w.en}</div>
            <div style="font-size:12px;color:#666;font-style:italic;margin-bottom:6px">/${w.phonetic || '...'}/</div>
            <div style="font-size:11px;padding:4px 8px;background:#f3f4f6;border-radius:4px">${w.fr}</div>
            <div style="font-size:10px;color:#9ca3af;margin-top:6px;font-style:italic">${w.example || ''}</div>
          </div>
        `).join('')}
      </div>
      <div class="footer"><span>EnglishPath</span><span>${date}</span><span>${center}</span></div>
    </div></body></html>`
  }

  return `<html><body><p>Type de document inconnu</p></body></html>`
}

function getDefaultExercises(unit) {
  return [{
    type_label: 'QCM — Choisissez la bonne réponse',
    instruction: 'Entourez la lettre correspondant à la bonne réponse.',
    questions: [
      { text: `My name _____ John.`, type: 'qcm', options: ['A. are', 'B. is', 'C. am', 'D. be'] },
      { text: `She _____ a car and a bicycle.`, type: 'qcm', options: ['A. have got', 'B. has got', 'C. have', 'D. is got'] },
      { text: `_____ you got a sister?`, type: 'qcm', options: ['A. Do', 'B. Has', 'C. Have', 'D. Are'] },
    ]
  }, {
    type_label: 'Texte à trous — Complétez',
    instruction: 'Complétez les phrases avec : my / your / his / her / our / their',
    questions: [
      { text: `This is _______ book. (Marie)`, type: 'fill' },
      { text: `John and _______ sister live in London.`, type: 'fill' },
      { text: `We love _______ new flat.`, type: 'fill' },
    ]
  }]
}

function getDefaultVocab(unit) {
  return [
    { en: 'neighbour', fr: 'voisin(e)', phonetic: 'ˈneɪbər', example: 'My neighbour is friendly.' },
    { en: 'flat', fr: 'appartement', phonetic: 'flæt', example: 'She lives in a flat.' },
    { en: 'garden', fr: 'jardin', phonetic: 'ˈɡɑːrdən', example: 'Our garden has flowers.' },
    { en: 'bedroom', fr: 'chambre', phonetic: 'ˈbedruːm', example: 'The flat has two bedrooms.' },
    { en: 'have got', fr: 'avoir (possession)', phonetic: 'hæv ɡɒt', example: "I've got a new bike." },
    { en: 'house', fr: 'maison', phonetic: 'haʊs', example: 'They have a big house.' },
  ]
}
