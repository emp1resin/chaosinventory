import { apiBase } from './apiConfig.js';
import { ApiError, requestData } from './apiTransport.js';
import { fetchGameJson, gameUrl } from './gameApi.js';
import { recordDiagnostic } from './diagnostics.js';

// The official clan rating publishes the current glory in the sixth column.
// Only listed clans can be resolved; leave other clans for manual entry.
export function parseOfficialClanRating(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const clans = {};
  for (const table of doc.querySelectorAll('table[width="680"]')) {
    const cells = table.querySelectorAll('td');
    if (cells.length !== 7) continue;
    const name = cells[1].textContent.trim().replace(/\s+/g, ' ');
    const glory = Number(cells[5].textContent.trim());
    if (name && Number.isFinite(glory)) clans[name] = glory;
  }
  if (!Object.keys(clans).length) throw new Error('Рейтинг кланов не содержит славу.');
  return clans;
}

export function parseClans(json) {
  if (!json || typeof json !== 'object' || !Object.keys(json).length) throw new ApiError('INVALID_CLANS', 'Список кланов пуст или повреждён.');
  const clans = {};
  for (const row of Object.values(json)) {
    if (!row || typeof row.clan_name !== 'string' || !row.clan_name.trim() ||
        row.clan_glory == null || row.clan_glory === '' || !Number.isFinite(Number(row.clan_glory))) {
      throw new ApiError('INVALID_CLANS', 'Формат списка кланов изменился.');
    }
    clans[row.clan_name.trim().normalize('NFC')] = Number(row.clan_glory);
  }
  return clans;
}
export async function fetchOfficialClanGlory(options = {}) {
  return parseClans(await fetchGameJson(gameUrl('clans'), {...options, validate:parseClans}));
}

export const emptyThings = {
  'Шлем': 'Шлем', 'Амулет': 'Амулет', 'Наручи': 'Наручи',
  'Перчатки': 'Перчатки', 'Доспехи': 'Доспех', 'Пояс': 'Пояс',
  'Ботинки': 'Обувь', 'Кольцо слева': 'Кольцо', 'Кольцо справа': 'Кольцо',
  'Оружие справа': 'Оружие', 'Оружие слева': 'Щит/Оружие',
};

const fields = {
  'Сила:': 'power', 'Телосложение:': 'body', 'Ловкость:': 'dex',
  'Интеллект:': 'intell', 'Выносливость:': 'stamina', 'Воля:': 'will',
};

// The public character page shows total(base+bonus). The builder starts with
// base characteristics and adds equipment bonuses itself.
export function profileFromCells(cells) {
  const value = key => String(cells[key] || '').replace(/\s+/g, ' ').trim();
  const base = key => {
    const displayed = value(key);
    const match = displayed.match(/^\d+\s*\(\s*(\d+)\s*(?:[+−-]\s*\d+(?:\.\d+)?\s*)?\)$/);
    return match ? Number(match[1]) : /^\d+$/.test(displayed) ? Number(displayed) : NaN;
  };
  const level = Number(value('Уровень:'));
  const race = value('Раса:').replace(/\s*\(\d+\)\s*$/, '');
  const profession = value('Профессия:').match(/^(.*?)\s*\((\d+)\)$/);
  const characteristics = Object.fromEntries(Object.entries(fields)
    .map(([label, key]) => [key, base(label)]));

  if (!race || !Number.isInteger(level) || level < 1 ||
      Object.values(characteristics).some(n => !Number.isSafeInteger(n) || n < 0) || !value('Клан:') || !value('Религия:')) {
    throw new Error('На открытой странице не найдены основные данные персонажа.');
  }

  const normal = key => value(key).toLowerCase() === 'нет' ? 'Нет' : value(key);
  return { out: {
    race, level, profession: profession?.[1] || normal('Профессия:'),
    professionLvl: profession ? Number(profession[2]) : 0,
    clan: normal('Клан:'), religion: normal('Религия:'),
    ...characteristics, things: { ...emptyThings },
  }};
}

export function parseOfficialProfile(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const cells = {};
  const scope = doc.querySelector?.('[name="params"]') || doc;
  for (const td of scope.querySelectorAll('td')) {
    const label = td.textContent.replace(/\s+/g, ' ').trim();
    if ((label in fields || ['Раса:', 'Уровень:', 'Профессия:', 'Клан:', 'Религия:'].includes(label)) &&
        td.nextElementSibling?.tagName === 'TD') {
      const value = td.nextElementSibling.textContent;
      if (cells[label] != null && cells[label].replace(/\s+/g,' ').trim() !== value.replace(/\s+/g,' ').trim()) throw new ApiError('AMBIGUOUS_PROFILE', `Страница содержит разные значения поля «${label}».`);
      cells[label] = value;
    }
  }
  return profileFromCells(cells);
}

export async function fetchCharacterProfile(name, options = {}) {
  const nick = String(name).trim().normalize('NFC');
  const html = await requestData(`${apiBase}/api/profile-html?name=${encodeURIComponent(nick)}`, {
    ...options, format:'text', source:'profile-server', timeoutMs:options.timeoutMs || 15000,
  });
  const profile = parseOfficialProfile(html);
  recordDiagnostic('profile_parsed', {source:'official-html', nick});
  return {profile, fallback:false};
}
