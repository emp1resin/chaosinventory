const profileBridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site/api/profile-html';
const clanRatingBridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site/api/clan-rating-html';
import { recordDiagnostic } from './diagnostics';

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

export async function fetchOfficialClanGlory() {
  try {
    const response = await fetch('https://chaosage.ru/rating.php?type=2', { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const clans = parseOfficialClanRating(await response.text());
    recordDiagnostic('clan_rating_direct_ok', { count: Object.keys(clans).length });
    return clans;
  } catch (error) {
    recordDiagnostic('clan_rating_direct_failed', { message: String(error.message).slice(0, 120) });
    const response = await fetch(clanRatingBridge, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Рейтинг кланов: ${response.status}`);
    return parseOfficialClanRating(await response.text());
  }
}

const emptyThings = {
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
    const match = displayed.match(/\((\d+)\s*\+/);
    return Number(match ? match[1] : displayed.match(/^\d+/)?.[0]);
  };
  const level = Number(value('Уровень:'));
  const race = value('Раса:').replace(/\s*\(\d+\)\s*$/, '');
  const profession = value('Профессия:').match(/^(.*?)\s*\((\d+)\)$/);
  const characteristics = Object.fromEntries(Object.entries(fields)
    .map(([label, key]) => [key, base(label)]));

  if (!race || !Number.isInteger(level) || level < 1 ||
      Object.values(characteristics).some(n => !Number.isFinite(n))) {
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
  for (const td of doc.querySelectorAll('td')) {
    const label = td.textContent.replace(/\s+/g, ' ').trim();
    if ((label in fields || ['Раса:', 'Уровень:', 'Профессия:', 'Клан:', 'Религия:'].includes(label)) &&
        td.nextElementSibling?.tagName === 'TD') {
      cells[label] = td.nextElementSibling.textContent;
    }
  }
  return profileFromCells(cells);
}

export async function fetchCharacterProfile(name) {
  const nick = name.trim();
  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://chaosage.space/getAvatarsDataByName?name=${encodeURIComponent(nick)}`,
      { signal: controller.signal });
    if (!response.ok) {
      recordDiagnostic('profile_direct_http', { status: response.status, ms: Date.now() - started });
      throw new Error(String(response.status));
    }
    const profile = await response.json();
    if (profile?.out) {
      recordDiagnostic('profile_direct_ok', { status: response.status, ms: Date.now() - started });
      return { profile, fallback: false };
    }
    throw new Error('Пустой ответ');
  } catch (primaryError) {
    recordDiagnostic('profile_direct_failed', { error: primaryError.name, message: String(primaryError.message).slice(0, 120), ms: Date.now() - started });
    const officialStarted = Date.now();
    try {
      const response = await fetch(`https://chaosage.ru/showInfo.php?avatar=${encodeURIComponent(nick)}`,
        { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const profile = parseOfficialProfile(await response.text());
      recordDiagnostic('profile_official_ok', { status: response.status, ms: Date.now() - officialStarted });
      return { profile, fallback: true };
    } catch (officialError) {
      recordDiagnostic('profile_official_failed', {
        error: officialError.name, message: String(officialError.message).slice(0, 120), ms: Date.now() - officialStarted,
      });
    }
    let response;
    const bridgeStarted = Date.now();
    const bridgeController = new AbortController();
    const bridgeTimeout = setTimeout(() => bridgeController.abort(), 12000);
    try {
      response = await fetch(`${profileBridge}?name=${encodeURIComponent(nick)}`, { signal: bridgeController.signal });
    } catch (bridgeError) {
      recordDiagnostic('profile_bridge_failed', { error: bridgeError.name, message: String(bridgeError.message).slice(0, 120), ms: Date.now() - bridgeStarted });
      throw new Error(`Не удалось получить профиль ни из игры, ни через резервный сервер (${bridgeError.message}).`);
    } finally {
      clearTimeout(bridgeTimeout);
    }
    if (!response.ok) {
      recordDiagnostic('profile_bridge_http', { status: response.status, ms: Date.now() - bridgeStarted });
      const detail = await response.json().catch(() => ({}));
      throw new Error(`Не удалось загрузить персонажа через запасной источник: ${detail.error || response.status}`);
    }
    const profile = parseOfficialProfile(await response.text());
    recordDiagnostic('profile_bridge_ok', { status: response.status, ms: Date.now() - bridgeStarted });
    return { profile, fallback: true };
  } finally {
    clearTimeout(timeout);
  }
}
