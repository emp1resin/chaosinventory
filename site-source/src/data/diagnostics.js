const bridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site';
const queueKey = 'chaosinventory:pending-reports:v1';
const events = [];

export function recordDiagnostic(stage, detail = {}) {
  // Only explicit, short fields are recorded. Never collect saved builds or console output.
  const safe = Object.fromEntries(Object.entries(detail).filter(([, value]) =>
    typeof value === 'number' || typeof value === 'boolean' ||
    (typeof value === 'string' && value.length <= 250)));
  events.push({ at: new Date().toISOString(), stage, ...safe });
  if (events.length > 35) events.shift();
}

export function beginImport(nick) {
  events.length = 0;
  recordDiagnostic('import_start', { nick: String(nick).trim().slice(0, 60) });
}

export function describeRequest(url) {
  const parsed = new URL(url);
  return parsed.pathname === '/sAPI2.php' || parsed.pathname === '/api/game-json'
    ? `${parsed.pathname}:${parsed.searchParams.get('request') || 'unknown'}`
    : parsed.pathname;
}

export async function probeBridge() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  const started = Date.now();
  try {
    const response = await fetch(`${bridge}/health?report=1`, { signal: controller.signal, cache: 'no-store' });
    recordDiagnostic('bridge_health', { status: response.status, ms: Date.now() - started });
  } catch (error) {
    recordDiagnostic('bridge_health', { error: error.name || 'Error', message: String(error.message).slice(0, 120), ms: Date.now() - started });
  } finally {
    clearTimeout(timeout);
  }
}

export function snapshotBuild(state) {
  if (!state) return null;
  const numberKeys = ['levelChange', 'powerChange', 'bodyChange', 'dexChange', 'intellChange', 'staminaChange', 'willChange', 'clanGlory',
    'clansArtSword', 'clansArtSphere', 'clansArtRune', 'clansArtMask'];
  const values = Object.fromEntries(numberKeys.map(key => [key, state[key]]));
  const skills = Object.fromEntries(Object.entries(state.allSkills || {}).filter(([, level]) => Number(level) > 0));
  const mastery = Object.fromEntries(Object.entries(state.allSkillsMaster || {}).filter(([, level]) => Number(level) > 0));
  const slots = Object.entries(state.thingOnPers || {}).map(([slot, item]) => {
    const mod = state.modifireThings?.[slot] || {};
    return {
      slot, name: String(item?.name || '').slice(0, 80), sourceId: item?.sourceId || null,
      instanceId: mod.id || null, runes: String(mod.runes || '').slice(0, 80),
      runeWord: String(mod.runeWord || '').slice(0, 50), breachRune: String(mod.breachRune || '').slice(0, 60),
      bonuses: Object.fromEntries(Object.entries(mod.parametrs || {}).filter(([, value]) =>
        Array.isArray(value) ? value.some(Number) : Number(value) !== 0)),
    };
  });
  return { values, skills, mastery, clan: state.clan, religion: state.religion,
    bless: [state.charBless, state.lifeBless], elixirs: state.elixirs, golem: state.golem, slots };
}

export function createBugReport({ nick, category, lastError, build, loadedNick }) {
  return {
    schema: 1,
    clientId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    category,
    nick: String(nick || '').trim().slice(0, 60),
    loadedNick: String(loadedNick || '').trim().slice(0, 60),
    note: '',
    lastError: String(lastError || '').slice(0, 250),
    browser: {
      userAgent: navigator.userAgent.slice(0, 350),
      language: navigator.language,
      online: navigator.onLine,
      page: location.origin + location.pathname,
    },
    events: events.slice(),
    build: snapshotBuild(build),
  };
}

export async function sendBugReport(report) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${bridge}/api/bug-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.id) throw new Error(result.error || `HTTP ${response.status}`);
    return result.id;
  } finally {
    clearTimeout(timeout);
  }
}

function pendingReports() {
  try {
    const parsed = JSON.parse(localStorage.getItem(queueKey) || '[]');
    return Array.isArray(parsed) ? parsed.slice(-5) : [];
  } catch { return []; }
}

export function queueBugReport(report) {
  try {
    const queue = pendingReports().filter(item => item.clientId !== report.clientId);
    queue.push(report);
    localStorage.setItem(queueKey, JSON.stringify(queue.slice(-5)));
    return true;
  } catch { return false; }
}

export function pendingReportIdFor(nick) {
  return pendingReports().filter(report => report.nick === nick).at(-1)?.clientId || '';
}

let flushing = false;
export async function flushPendingReports() {
  if (flushing || !navigator.onLine) return;
  flushing = true;
  try {
    for (const report of pendingReports()) {
      let id;
      try { id = await sendBugReport(report); }
      catch { break; }
      try {
        const remaining = pendingReports().filter(item => item.clientId !== report.clientId);
        localStorage.setItem(queueKey, JSON.stringify(remaining));
      } catch { /* The server has already saved it; its UUID makes retries safe. */ }
      window.dispatchEvent(new CustomEvent('chaosinventory:report-delivered', { detail: { id } }));
    }
  } finally { flushing = false; }
}

export function startReportRetry() {
  setTimeout(flushPendingReports, 3000);
  window.addEventListener('online', flushPendingReports);
  window.addEventListener('focus', flushPendingReports);
  setInterval(flushPendingReports, 120_000);
}
