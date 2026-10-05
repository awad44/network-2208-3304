// A small static app: edit the question bank and styles without a framework.
const root = document.querySelector('#root');
const levels = ['Normal', 'Medium', 'Hard'];
const levelCopy = ['Build your foundations', 'Connect the concepts', 'Work through the challenge'];
let questions = [], topics = [];
let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
try { theme = localStorage.getItem('network-lab-theme') || theme; } catch {}
const state = { screen: 'home', level: 'Normal', topic: 'All topics', length: '10', mode: 'practice', sessionMode: 'practice', session: [], answers: {}, index: 0, locked: false, missedOnly: false };
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const btn = (action, text, cls = 'primary', attrs = '') => `<button type="button" class="${cls}" data-action="${action}" ${attrs}>${text}</button>`;
const source = q => `<span class="source">Source: Part ${q.source.part} · PDF page ${q.source.page}</span>`;
const mark = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 12 28 20 12 28Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4"/><circle cx="28" cy="20" r="4"/><circle cx="12" cy="28" r="4"/></svg>`;
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
function pool() { return questions.filter(q => (state.level === 'All' || q.difficulty === state.level) && (state.topic === 'All topics' || q.topic === state.topic)); }
function sessionCount() { return state.length === 'all' ? pool().length : Math.min(Number(state.length), pool().length); }
function missed() { return state.session.filter(q => state.answers[q.id] !== q.correctIndex); }
function start(selected = pool(), count = sessionCount()) {
  if (!selected.length) return;
  state.session = shuffle(selected).slice(0, count).map(q => ({ ...q, order: shuffle([0, 1, 2, 3]) }));
  state.sessionMode = state.mode; state.answers = {}; state.index = 0; state.locked = false; state.missedOnly = false; state.screen = 'quiz';
  render(true);
}
function art() { return `<div class="network-art" aria-hidden="true"><div class="art-top"><span>THE LEARNING NETWORK</span><span class="live-dot">CONNECTED</span></div><svg viewBox="0 0 420 260"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#7d9386" opacity=".25"/></pattern></defs><rect width="420" height="260" fill="url(#dots)"/><g stroke="#8ea787" stroke-width="1.3" fill="none"><path d="M70 70 200 130 335 65M70 200 200 130 340 200M70 70 70 200M335 65 340 200M200 130 205 30M200 130 205 235"/><path d="M70 70 335 65M70 200 340 200" stroke-dasharray="4 6" opacity=".5"/></g><g fill="#263d32" stroke="#94b478"><circle cx="70" cy="70" r="23"/><circle cx="335" cy="65" r="23"/><circle cx="70" cy="200" r="23"/><circle cx="340" cy="200" r="23"/><circle cx="205" cy="30" r="8"/><circle cx="205" cy="235" r="8"/></g><circle cx="200" cy="130" r="40" fill="#c6ed86"/><circle cx="200" cy="130" r="49" fill="none" stroke="#c6ed86" opacity=".35"/><g font-family="monospace" font-size="12" fill="#c6ed86" text-anchor="middle"><text x="70" y="74">01</text><text x="335" y="69">02</text><text x="70" y="204">03</text><text x="340" y="204">04</text><text x="200" y="134" fill="#152925" font-weight="bold">YOU</text></g></svg><div class="art-bottom"><span>CONCEPT → PRACTICE → CONFIDENCE</span><span>↗</span></div></div>`; }
function homeView() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="tiny-dot"></span> COMPUTER NETWORKS / STUDY SPACE</p><h1>Make the<br>connections <em>click.</em></h1><p class="hero-description">From your first packet to your next subnet. Practice the course, understand your mistakes, and head into class with confidence.</p><a class="text-link" href="#setup">Find your starting point <span>↓</span></a></div>${art()}</section>
  <section class="stats" aria-label="Question bank overview"><div><strong>100</strong><span>course-based questions</span></div><div><strong>03</strong><span>difficulty levels</span></div><div><strong>07</strong><span>source PDFs</span></div><div><span class="stat-icon">✓</span><span>Explanations &amp; source<br>references for every answer</span></div></section>
  <section id="setup" class="setup"><div class="section-heading"><div><p class="eyebrow">01 / CHOOSE YOUR PATH</p><h2>A little practice. A lot of progress.</h2></div><span class="section-note">Your pace. Your next step.</span></div>
  <fieldset class="level-field"><legend class="sr-only">Difficulty level</legend><div class="level-grid">${levels.map((level, i) => btn('level', `<div class="card-top"><span class="level-number">0${i + 1}</span><span class="radio-dot"></span></div><h3>${level}</h3><p>${levelCopy[i]}</p><div class="card-bottom"><span>${questions.filter(q => q.difficulty === level).length} questions</span><span class="bars">${'▮'.repeat(i + 1)}<span>${'▮'.repeat(2 - i)}</span></span></div>`, `level-card ${state.level === level ? 'active' : ''}`, `data-value="${level}" aria-pressed="${state.level === level}"`)).join('')}</div></fieldset>
  ${btn('mix', `${state.level === 'All' ? '✓' : '↻'} Mix all three levels`, 'mix-button', `aria-pressed="${state.level === 'All'}"`)}
  <div class="session-builder"><div class="builder-fields"><label>Focus on a topic<select data-setting="topic">${['All topics', ...topics].map(t => `<option ${state.topic === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label><label>Session length<select data-setting="length">${[['10', '10 questions'], ['20', '20 questions'], ['all', 'All matching questions']].map(([v, t]) => `<option value="${v}" ${state.length === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label><fieldset class="mode-field"><legend>How do you want to practice?</legend><div class="segmented">${btn('mode', 'Practice', '', `data-value="practice" aria-pressed="${state.mode === 'practice'}"`)}${btn('mode', 'Exam', '', `data-value="exam" aria-pressed="${state.mode === 'exam'}"`)}</div><small>${state.mode === 'practice' ? 'Feedback after each answer' : 'Review when you finish'}</small></fieldset></div><div class="builder-action"><div><strong>${sessionCount()} questions ready</strong><p>${pool().length} match your selection · shuffled every session</p></div>${btn('start', 'Start session <span>↗</span>', 'primary', !sessionCount() ? 'disabled' : '')}</div></div></section>
  <section class="course-note"><div class="note-symbol">i</div><div><h3>Built around your course.</h3><p>Every question is grounded in the uploaded I2208 Computer Networks notes, Parts 1–7. Calculations apply the methods in those notes. Source references use PDF page numbers, not slide numbers.</p></div><span class="note-tag">STUDY / CHECK / REPEAT</span></section>`;
}
function quizView() {
  const q = state.session[state.index], answer = state.answers[q.id], reveal = state.locked && state.sessionMode === 'practice';
  return `<section class="quiz-layout"><div class="quiz-top">${btn('exit', '← Leave session', 'text-button')}<span>${state.sessionMode === 'practice' ? 'Practice' : 'Exam'} mode · ${state.session.length} questions</span></div><div class="progress-heading"><span>Question ${state.index + 1} of ${state.session.length}</span><span>${Math.round(state.index / state.session.length * 100)}% complete</span></div><div class="progress" role="progressbar" aria-label="Quiz progress" aria-valuenow="${state.index}" aria-valuemin="0" aria-valuemax="${state.session.length}"><div style="width:${state.index / state.session.length * 100}%"></div></div>
  <article class="question-card"><div class="question-meta"><span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span><span>${esc(q.topic)}</span><span class="question-id">${q.id.toUpperCase()}</span></div><h1 tabindex="-1" class="question-title">${esc(q.prompt)}</h1><p class="instruction">Select one answer.</p><div class="options" role="group" aria-label="Answer options">${q.order.map((o, pos) => {
    const selected = answer === o, correct = o === q.correctIndex;
    return btn('answer', `<span class="option-letter">${'ABCD'[pos]}</span><span>${esc(q.options[o])}</span>${reveal && (correct || selected) ? `<span class="option-status">${correct ? '✓ Correct' : '✕ Your answer'}</span>` : ''}`, `option ${selected ? 'selected' : ''} ${reveal && correct ? 'correct' : ''} ${reveal && selected && !correct ? 'incorrect' : ''}`, `data-value="${o}" aria-pressed="${selected}" ${state.locked ? 'disabled' : ''}`);
  }).join('')}</div>
  ${reveal ? `<div class="feedback ${answer === q.correctIndex ? 'success' : ''}" role="status"><strong>${answer === q.correctIndex ? 'That’s right.' : 'A connection to revisit.'}</strong><p>${esc(q.explanation)}</p>${source(q)}</div>` : ''}
  <div class="question-footer"><span>${state.sessionMode === 'exam' ? 'Answers revealed at the end' : state.locked ? 'Take a moment to understand why.' : 'No timer. Take your time.'}</span>${state.locked ? btn('next', `${state.index + 1 === state.session.length ? 'See results' : 'Next question'} →`) : btn('check', `${state.sessionMode === 'practice' ? 'Check answer' : state.index + 1 === state.session.length ? 'Finish session' : 'Save &amp; continue'} →`, 'primary', answer === undefined ? 'disabled' : '')}</div></article></section>`;
}
function resultsView() {
  const wrong = missed(), correct = state.session.length - wrong.length, percent = Math.round(correct / state.session.length * 100);
  return `<section class="results"><p class="eyebrow">SESSION COMPLETE / KEEP CONNECTING</p><div class="result-hero"><div><h1 tabindex="-1">${percent >= 80 ? 'Great connections.' : percent >= 50 ? 'You’re getting there.' : 'A starting point to grow.'}</h1><p>${correct} correct out of ${state.session.length}. ${wrong.length ? 'Review the explanations below and give the tricky ones another try.' : 'You answered every question correctly. Try another level or topic next.'}</p><div class="result-actions">${btn('home', 'New session ↗')}${wrong.length ? btn('retry', `Retry ${wrong.length} missed`, 'secondary') : ''}${btn('restart', 'Restart this set ↻', 'text-button')}</div></div><div class="score-circle" style="--score:${percent}%"><div><strong>${percent}<small>%</small></strong><span>YOUR SCORE</span></div></div></div>
  <div class="topic-results"><h2>By topic</h2>${topics.filter(t => state.session.some(q => q.topic === t)).map(t => { const subset = state.session.filter(q => q.topic === t), n = subset.filter(q => state.answers[q.id] === q.correctIndex).length; return `<div class="topic-row"><span>${esc(t)}</span><div class="mini-progress"><div style="width:${n / subset.length * 100}%"></div></div><strong>${n} / ${subset.length}</strong></div>`; }).join('')}</div>
  <div class="review-heading"><div><p class="eyebrow">02 / UNDERSTAND THE WHY</p><h2>Review your answers</h2></div>${btn('review', state.missedOnly ? 'Show all answers' : 'Show missed only', 'secondary', `aria-pressed="${state.missedOnly}"`)}</div>
  ${state.missedOnly && !wrong.length ? '<p class="empty-state">Nothing to revisit — all answers are correct.</p>' : ''}
  ${(state.missedOnly ? wrong : state.session).map(q => `<article class="review-card"><div class="question-meta"><span class="${state.answers[q.id] === q.correctIndex ? 'review-correct' : 'review-incorrect'}">${state.answers[q.id] === q.correctIndex ? '✓ Correct' : '✕ Incorrect'}</span><span>${q.difficulty} · ${esc(q.topic)}</span><span class="question-id">${q.id.toUpperCase()}</span></div><h3>${esc(q.prompt)}</h3><div class="review-options">${q.order.map((o, i) => `<div class="review-option ${o === q.correctIndex ? 'correct' : state.answers[q.id] === o ? 'incorrect' : ''}"><span>${'ABCD'[i]}.</span><span>${esc(q.options[o])}</span><small>${o === q.correctIndex ? '✓ Correct answer' : state.answers[q.id] === o ? '✕ Your answer' : ''}</small></div>`).join('')}</div><p class="review-explanation">${esc(q.explanation)}</p>${source(q)}</article>`).join('')}</section>`;
}
function render(move = false, focusKey = '') {
  document.documentElement.dataset.theme = theme;
  root.innerHTML = `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner">${btn('brand', `${mark}<span>network<span class="brand-light">lab</span></span>`, 'brand', 'aria-label="Network Lab home"')}<div class="header-right"><span class="course-pill">I2208 · 2024–2025</span>${btn('theme', `${theme === 'dark' ? '☀' : '☾'}<span>${theme === 'dark' ? 'Light' : 'Dark'}</span>`, 'theme-toggle', `aria-label="Switch to ${theme === 'dark' ? 'light' : 'dark'} theme"`)}</div></div></header><main id="main" class="container">${state.screen === 'home' ? homeView() : state.screen === 'quiz' ? quizView() : resultsView()}</main><footer class="site-footer"><span>networklab <span>·</span> Made for learning together.</span><span>I2208 Computer Networks · Parts 1–7</span></footer><dialog><h2>Leave this session?</h2><p>Your current answers will be cleared when you start a new session.</p><div class="dialog-actions">${btn('cancel-exit', 'Keep practicing', 'secondary', 'autofocus')}${btn('confirm-exit', 'Leave session')}</div></dialog>`;
  if (move) { window.scrollTo({ top: 0 }); root.querySelector('h1')?.focus({ preventScroll: true }); }
  else if (focusKey) root.querySelector(focusKey)?.focus({ preventScroll: true });
}
function next() { if (state.index + 1 === state.session.length) state.screen = 'results'; else { state.index++; state.locked = false; } render(true); }
function showExit() {
  const dialog = root.querySelector('dialog');
  dialog.addEventListener('close', () => root.querySelector('[data-action="exit"]')?.focus(), { once: true });
  dialog.showModal();
}
root.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button || button.disabled) return;
  const { action, value } = button.dataset;
  switch (action) {
    case 'theme': theme = theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('network-lab-theme', theme); } catch {} render(false, '[data-action="theme"]'); break;
    case 'level': state.level = value; render(false, `[data-action="level"][data-value="${value}"]`); break;
    case 'mix': state.level = state.level === 'All' ? 'Normal' : 'All'; render(false, '[data-action="mix"]'); break;
    case 'mode': state.mode = value; render(false, `[data-action="mode"][data-value="${value}"]`); break;
    case 'start': start(); break;
    case 'answer': if (!state.locked) { state.answers[state.session[state.index].id] = Number(value); render(false, `[data-action="answer"][data-value="${value}"]`); } break;
    case 'check': if (state.answers[state.session[state.index].id] === undefined) return; if (state.sessionMode === 'practice') { state.locked = true; render(false, '[data-action="next"]'); } else next(); break;
    case 'next': next(); break;
    case 'retry': start(missed(), missed().length); break;
    case 'restart': start(state.session, state.session.length); break;
    case 'review': state.missedOnly = !state.missedOnly; render(false, '[data-action="review"]'); break;
    case 'brand': if (state.screen === 'quiz') { showExit(); break; } // Otherwise go home.
    case 'home': case 'confirm-exit': state.screen = 'home'; render(true); break;
    case 'exit': showExit(); break;
    case 'cancel-exit': root.querySelector('dialog').close(); break;
  }
});
root.addEventListener('change', event => {
  const key = event.target.dataset.setting;
  if (key === 'topic' || key === 'length') { state[key] = event.target.value; render(false, `[data-setting="${key}"]`); }
});
window.addEventListener('beforeunload', event => { if (state.screen === 'quiz') event.preventDefault(); });
try {
  const response = await fetch(new URL('./questions.json', import.meta.url));
  if (!response.ok) throw new Error('Question bank could not be loaded');
  questions = await response.json(); topics = [...new Set(questions.map(q => q.topic))]; render();
} catch {
  root.innerHTML = '<main class="container" style="padding-block:60px"><h1>Let’s reconnect.</h1><p style="margin-top:20px">The question bank could not be loaded. Refresh the page, or run this project using the local server described in the README.</p></main>';
}
