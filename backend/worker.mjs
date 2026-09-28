const allowedOrigins = new Set([
  'https://emp1resin.github.io',
  'https://chaosinventory.emp1res1n.chatgpt.site',
]);
const requestsByAddress = new Map();
const reportsByAddress = new Map();
const sharedResponses = new Map();
const pendingShared = new Map();
const gameRequestsByName = new Set([
  'user_equipment_list', 'user_fraction', 'clan_list_by_user_name', 'user_religionBonuses',
]);

function corsHeaders(origin) {
  return origin && allowedOrigins.has(origin)
    ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
    : { Vary: 'Origin' };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    if (url.pathname === '/health') return jsonResponse({ ok: true, version:'official-api-v1' }, 200, origin);
    if (url.pathname !== '/api/profile-html' && url.pathname !== '/api/avatar-rating-html' && url.pathname !== '/api/clan-rating-html' && url.pathname !== '/api/game-json' && url.pathname !== '/api/bug-report') {
      return new Response(`<!doctype html><html lang="ru"><meta charset="utf-8"><title>ChaosInventory — проверка данных</title><body><h1>Проверка открытого профиля</h1><form id="check"><input name="name" value="Thrandu1l"><button>Проверить</button></form><pre id="result"></pre><script>document.getElementById('check').onsubmit=async e=>{e.preventDefault();const out=document.getElementById('result');out.textContent='Загрузка';try{const r=await fetch('/api/profile-html?name='+encodeURIComponent(e.target.name.value));const t=await r.text();out.textContent='HTTP '+r.status+'; длина '+t.length+'; '+t.slice(0,150)}catch(err){out.textContent=String(err)}};</script></body></html>`, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders(origin) },
      });
    }

    if (origin && !allowedOrigins.has(origin)) return jsonResponse({ error: 'Доступ запрещён' }, 403, origin);
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin),
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '3600',
        },
      });
    }
    if (url.pathname === '/api/bug-report') {
      if (request.method !== 'POST') return jsonResponse({ error: 'Разрешён только POST' }, 405, origin);
      if (!['application/json','text/plain'].includes(request.headers.get('Content-Type')?.split(';')[0].trim())) {
        return jsonResponse({ error: 'Ожидается JSON' }, 415, origin);
      }
      if (Number(request.headers.get('Content-Length')) > 24_000) return jsonResponse({ error: 'Отчёт слишком большой' }, 413, origin);
      let raw;
      try { raw = await readLimited(request, 24_000); } catch { return jsonResponse({ error:'Отчёт слишком большой', code:'REPORT_TOO_LARGE' }, 413, origin); }
      if (new TextEncoder().encode(raw).length > 24_000) return jsonResponse({ error: 'Отчёт слишком большой' }, 413, origin);
      let report;
      try { report = JSON.parse(raw); } catch { return jsonResponse({ error: 'Неверный JSON' }, 400, origin); }
      const categories = new Set(['import', 'equipment', 'calculation', 'other']);
      if (!report || report.schema !== 1 ||
          typeof report.clientId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(report.clientId) ||
          !categories.has(report.category) ||
          typeof report.nick !== 'string' || report.nick.length > 60 ||
          typeof report.note !== 'string' || report.note.length > 1000 ||
          !Array.isArray(report.events) || report.events.length > 35 ||
          report.events.some(event => typeof event !== 'object' || JSON.stringify(event).length > 600) ||
          typeof report.browser !== 'object' || JSON.stringify(report.browser).length > 800 ||
          (report.build != null && JSON.stringify(report.build).length > 12_000)) {
        return jsonResponse({ error: 'Неверный формат отчёта' }, 400, origin);
      }
      const address = request.headers.get('CF-Connecting-IP') || 'anonymous';
      const now = Date.now();
      const bucket = reportsByAddress.get(address);
      const next = bucket && now - bucket.started < 3_600_000
        ? { started: bucket.started, count: bucket.count + 1 }
        : { started: now, count: 1 };
      reportsByAddress.set(address, next);
      if (reportsByAddress.size > 1024) {
        for (const [key, value] of reportsByAddress) if (now - value.started > 3_600_000) reportsByAddress.delete(key);
      }
      if (next.count > 40) return jsonResponse({ error: 'Лимит отчётов: попробуйте через час' }, 429, origin);
      if (!env?.DB) return jsonResponse({ error: 'Хранилище отчётов временно недоступно' }, 503, origin);
      const id = report.clientId;
      const createdAt = new Date().toISOString();
      try {
        const statements = [env.DB.prepare('INSERT OR IGNORE INTO bug_reports (id, created_at, category, nick, report_json) VALUES (?, ?, ?, ?, ?)')
          .bind(id, createdAt, report.category, report.nick, raw)];
        for (let index = 0; index * 900 < raw.length; index++) {
          statements.push(env.DB.prepare('INSERT OR IGNORE INTO bug_report_parts (id, report_id, part_number, part_text) VALUES (?, ?, ?, ?)')
            .bind(`${id}:${String(index).padStart(4, '0')}`, id, index, raw.slice(index * 900, (index + 1) * 900)));
        }
        await env.DB.batch(statements);
        return jsonResponse({ id, createdAt }, 201, origin);
      } catch (error) {
        console.error('bug_report_storage_failed', error);
        return jsonResponse({ error: 'Не удалось сохранить отчёт' }, 503, origin);
      }
    }
    if (request.method !== 'GET') return jsonResponse({ error: 'Разрешён только GET' }, 405, origin);

    const name = (url.searchParams.get('name') || '').trim().normalize('NFC');
    if (url.pathname === '/api/profile-html' && !/^[\p{L}\p{N}_-]{1,60}$/u.test(name)) {
      return jsonResponse({ error: 'Некорректный ник персонажа' }, 400, origin);
    }
    let gameSource;
    if (url.pathname === '/api/game-json') {
      const gameRequest = url.searchParams.get('request');
      const id = url.searchParams.get('id');
      const userName = (url.searchParams.get('user_name') || '').trim().normalize('NFC');
      if (gameRequest !== 'clans' && !(gameRequestsByName.has(gameRequest) && /^[\p{L}\p{N}_-]{1,60}$/u.test(userName)) &&
          !(gameRequest === 'equipment_info' && /^\d{1,12}$/.test(id || ''))) {
        return jsonResponse({ error: 'Некорректный запрос к игровым данным' }, 400, origin);
      }
      gameSource = new URL('https://chaosage.ru/sAPI2.php');
      gameSource.searchParams.set('request', gameRequest);
      if (gameRequest === 'equipment_info') gameSource.searchParams.set('id', id);
      else if (gameRequest !== 'clans') gameSource.searchParams.set('user_name', userName);
    }

    // Simple per-isolate limit. It protects the game page from accidental bursts.
    const address = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const now = Date.now();
    const bucket = requestsByAddress.get(address);
    const next = bucket && now - bucket.started < 60_000
      ? { started: bucket.started, count: bucket.count + 1 }
      : { started: now, count: 1 };
    requestsByAddress.set(address, next);
    if (requestsByAddress.size > 1024) {
      for (const [key, value] of requestsByAddress) {
        if (now - value.started > 60_000) requestsByAddress.delete(key);
      }
    }
    if (next.count > 90) return jsonResponse({ error: 'Слишком много запросов. Повторите через минуту.' }, 429, origin);

    let source, format = 'text', shared = false;
    if (gameSource) {
      source = gameSource;
      format = 'json';
      shared = source.searchParams.get('request') === 'clans';
    } else if (url.pathname === '/api/clan-rating-html' || url.pathname === '/api/avatar-rating-html') {
      source = new URL('https://chaosage.ru/rating.php');
      if (url.pathname === '/api/clan-rating-html') source.searchParams.set('type','2');
      shared = true;
    } else {
      source = new URL('https://chaosage.ru/showInfo.php');
      source.searchParams.set('avatar', name);
    }
    try {
      const key = source.toString();
      let result = shared && sharedResponses.get(key);
      if (!result || now - result.at >= 60000) {
        const fetchUpstream = async () => {
          const upstream = await fetch(source, {
            signal:AbortSignal.timeout(12000), cache:'no-store',
            headers:{Accept:format === 'json'?'application/json':'text/html'},
          });
          if (!upstream.ok) {
            const error = new Error(`Игра вернула HTTP ${upstream.status}`);
            error.code = 'UPSTREAM_HTTP'; error.upstreamStatus = upstream.status;
            throw error;
          }
          const body = await readLimited(upstream, 500000);
          if (format === 'json') {
            try { JSON.parse(body); } catch { const error = new Error('Игра вернула повреждённый JSON'); error.code='UPSTREAM_JSON'; throw error; }
          }
          return {body,at:Date.now()};
        };
        if (shared) {
          if (!pendingShared.has(key)) pendingShared.set(key, fetchUpstream().finally(()=>pendingShared.delete(key)));
          result = await pendingShared.get(key);
          sharedResponses.set(key,result);
        } else result = await fetchUpstream();
      }
      return new Response(result.body, {headers:{
        'Content-Type':format === 'json'?'application/json; charset=utf-8':'text/plain; charset=utf-8',
        'Cache-Control':'no-store',
        'X-Data-Fetched-At':new Date(result.at).toISOString(),
        'Access-Control-Expose-Headers':'X-Data-Fetched-At',
        ...corsHeaders(origin),
      }});
    } catch (error) {
      const timeout = error.name === 'TimeoutError' || error.name === 'AbortError';
      return jsonResponse({error:timeout?'Игра не ответила нашему серверу за 12 с.':error.message,
        code:timeout?'UPSTREAM_TIMEOUT':error.code || 'UPSTREAM_NETWORK',
        ...(error.upstreamStatus?{upstreamStatus:error.upstreamStatus}:{}),
      }, timeout?504:502, origin);
    }
  },
};

async function readLimited(message, limit) {
  if (Number(message.headers.get('Content-Length')) > limit) throw new Error('Ответ превышает допустимый размер');
  const reader = message.body?.getReader();
  if (!reader) return '';
  const chunks = []; let size = 0;
  try {
    while (true) {
      const {value,done} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error('Ответ превышает допустимый размер'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
