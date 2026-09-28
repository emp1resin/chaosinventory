const profileBridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site/api/profile-html';
const clanRatingBridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site/api/clan-rating-html';

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
  const response = await fetch(clanRatingBridge);
  if (!response.ok) throw new Error(`Рейтинг кланов: ${response.status}`);
  return parseOfficialClanRating(await response.text());
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://chaosage.space/getAvatarsDataByName?name=${encodeURIComponent(nick)}`,
      { signal: controller.signal });
    if (!response.ok) throw new Error(String(response.status));
    const profile = await response.json();
    if (profile?.out) return { profile, fallback: false };
    throw new Error('Пустой ответ');
  } catch (primaryError) {
    let response;
    try {
      response = await fetch(`${profileBridge}?name=${encodeURIComponent(nick)}`);
    } catch (bridgeError) {
      throw new Error(`Не удалось получить профиль ни из игры, ни через резервный сервер (${bridgeError.message}).`);
    }
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(`Не удалось загрузить персонажа через запасной источник: ${detail.error || response.status}`);
    }
    return { profile: parseOfficialProfile(await response.text()), fallback: true };
  } finally {
    clearTimeout(timeout);
  }
}
