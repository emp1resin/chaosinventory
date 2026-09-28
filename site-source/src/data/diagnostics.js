import { apiBase as bridge, buildVersion } from './apiConfig.js';
const queueKey = 'chaosinventory:pending-reports:v1';
const events = [];

export function recordDiagnostic(stage, detail = {}) {
  // Only explicit, short fields are recorded. Never collect saved builds or console output.
  const safe = Object.fromEntries(Object.entries(detail).filter(([, value]) =>
    typeof value === 'number' || typeof value === 'boolean' ||
    (typeof value === 'string' && value.length <= 250)));
  const event = {at:new Date().toISOString(),stage:String(stage).slice(0,60),...safe};
  for (const key of Object.keys(safe).reverse()) { if (JSON.stringify(event).length <= 600) break; delete event[key]; }
  events.push(event);
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
  const numberKeys = ['levelChange', 'powerChange', 'bodyChange', 'dexChange', 'intellChange', 'staminaChange', 'willChange', 'clanGlory', 'clanPosition', 'fractionReputation',
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
    version: buildVersion,
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

export function compactBugReport(report) {
  const copy = JSON.parse(JSON.stringify(report));
  copy.events = (Array.isArray(copy.events)?copy.events:[]).slice(-35).map(event => {
    if (JSON.stringify(event).length <= 600) return event;
    return {at:event.at,stage:event.stage,code:event.code,status:event.status,message:String(event.message || '').slice(0,150),truncated:true};
  });
  if (copy.build && JSON.stringify(copy.build).length > 12000) {
    copy.build = {...copy.build, slots:copy.build.slots?.map(({bonuses,...item})=>item), truncated:true};
  }
  const size = () => new TextEncoder().encode(JSON.stringify(copy)).length;
  while (size() > 22500 && copy.events.length > 1) {
    const ok = copy.events.findIndex(e=>e.stage?.endsWith('_ok'));
    copy.events.splice(ok < 0 ? 0 : ok,1);
    copy.truncated = true;
  }
  if (size() > 22500 && copy.build?.slots) {
    copy.build.slots = copy.build.slots.map(({bonuses,...slot})=>slot);
    copy.build.truncated = true;
  }
  if (copy.browser && JSON.stringify(copy.browser).length > 800) copy.browser = {userAgent:String(copy.browser.userAgent || '').slice(0,300),online:copy.browser.online};
  if (size() > 22500) { copy.build = null; copy.truncated = true; }
  return copy;
}
export function isRetryableReportError(error) { return error.retryable !== false; }
export async function sendBugReport(report) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(()=>{controller.abort();reject(new Error('Время ожидания отправки истекло'));},12000);
  });
  try {
    return await Promise.race([timeout, (async()=>{
      const response = await fetch(`${bridge}/api/bug-report`, {
        method:'POST', credentials:'omit',
        // JSON encoded as a simple CORS request; no preflight dependency.
        headers:{'Content-Type':'text/plain;charset=UTF-8'},
        body:JSON.stringify(compactBugReport(report)), signal:controller.signal,
      });
      const result = await response.json().catch(()=>({}));
      if (!response.ok || result.id !== report.clientId) {
        const error = new Error(result.error || `HTTP ${response.status}`);
        error.status = response.status;
        error.retryable = response.status === 429 || response.status >= 500 || response.ok;
        throw error;
      }
      return result.id;
    })()]);
  } finally { clearTimeout(timer); }
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
    queue.push(compactBugReport(report));
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
      catch (error) {
        if (isRetryableReportError(error)) break;
        try { localStorage.setItem(queueKey,JSON.stringify(pendingReports().filter(item=>item.clientId!==report.clientId))); } catch {}
        window.dispatchEvent(new CustomEvent('chaosinventory:report-rejected',{detail:{id:report.clientId,message:error.message}}));
        continue;
      }
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
