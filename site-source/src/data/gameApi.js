import { apiBase } from './apiConfig.js';
import { ApiError, requestData, throwIfCancelled } from './apiTransport.js';

const namedRequests = new Set(['user_equipment_list', 'user_fraction', 'clan_list_by_user_name', 'user_religionBonuses']);
let directUnavailableUntil = 0;

export function gameUrl(request, parameters = {}) {
  const url = new URL('https://chaosage.ru/sAPI2.php');
  url.search = new URLSearchParams({request, ...parameters}).toString();
  return url.toString();
}
export function bridgeUrlFor(url) {
  const source = new URL(url);
  if (source.origin !== 'https://chaosage.ru' || source.pathname !== '/sAPI2.php') throw new ApiError('INVALID_REQUEST', 'Неизвестный источник игровых данных.');
  const request = source.searchParams.get('request');
  const params = new URLSearchParams({request});
  if (namedRequests.has(request)) params.set('user_name', source.searchParams.get('user_name') || '');
  else if (request === 'equipment_info') params.set('id', source.searchParams.get('id') || '');
  else if (request !== 'clans') throw new ApiError('INVALID_REQUEST', 'Неизвестный метод игрового API.');
  return `${apiBase}/api/game-json?${params}`;
}

export async function fetchGameJson(url, options = {}) {
  throwIfCancelled(options.signal);
  const bridge = bridgeUrlFor(url);
  const routes = Date.now() < directUnavailableUntil ? [[bridge,'bridge'],[url,'official']] : [[url,'official'],[bridge,'bridge']];
  const errors = [];
  for (const [target, source] of routes) {
    try {
      const result = await requestData(target, {...options, source, timeoutMs:options.timeoutMs || (source === 'official' ? 7000 : 15000)});
      if (source === 'official') directUnavailableUntil = 0;
      if (options.validate) options.validate(result);
      return result;
    } catch (error) {
      if (error.code === 'CANCELLED') throw error;
      errors.push(error);
      if ([400,401,404,429].includes(error.status)) throw error;
      if (source === 'official' && ['NETWORK','TIMEOUT'].includes(error.code)) directUnavailableUntil = Date.now() + 30000;
    }
  }
  throw new ApiError('SOURCES_UNAVAILABLE', `Игровые данные не получены: ${errors.map((e,i) => `${routes[i][1] === 'official' ? 'игра' : 'наш сервер'} — ${e.message}`).join('; ')}`, {
    retryable:errors.some(e=>e.retryable), attempts:errors.map(e=>({code:e.code,status:e.status})),
  });
}
export async function fetchOptionalGameJson(url, options = {}) {
  try { return await fetchGameJson(url, options); }
  catch (error) { if (error.code === 'CANCELLED') throw error; return null; }
}
