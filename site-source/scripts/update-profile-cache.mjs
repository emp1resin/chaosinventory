import { readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';

const names = (await readFile(new URL('./profile-cache-names.txt', import.meta.url), 'utf8'))
  .split(/\r?\n/).map(name => name.trim()).filter(name => name && !name.startsWith('#'));
const destination = new URL('../public/profile-cache.json', import.meta.url);
const old = JSON.parse(await readFile(destination, 'utf8').catch(() => '{"profiles":{}}'));
const profiles = { ...(old.profiles || {}) };
const labels = new Set([
  'Раса:', 'Уровень:', 'Профессия:', 'Клан:', 'Религия:',
  'Сила:', 'Телосложение:', 'Ловкость:', 'Интеллект:', 'Выносливость:', 'Воля:',
]);

function extractCells(html) {
  const $ = load(html);
  const cells = {};
  $('td').each((_, element) => {
    const label = $(element).text().replace(/\s+/g, ' ').trim();
    if (labels.has(label) && $(element).next('td').length) {
      cells[label] = $(element).next('td').text().replace(/\s+/g, ' ').trim();
    }
  });
  if (!cells['Раса:'] || !Number(cells['Уровень:']) ||
      ['Сила:', 'Телосложение:', 'Ловкость:', 'Интеллект:', 'Выносливость:', 'Воля:']
        .some(key => !/\d/.test(cells[key] || ''))) {
    throw new Error('Не найдены характеристики на странице игры');
  }
  return cells;
}

let updated = 0;
let failed = 0;
for (let i = 0; i < names.length; i += 4) {
  await Promise.all(names.slice(i, i + 4).map(async name => {
    try {
      const url = `https://chaosage.ru/showInfo.php?avatar=${encodeURIComponent(name)}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const cells = extractCells(await response.text());
      profiles[name.normalize('NFC').toLocaleLowerCase('ru-RU')] = {
        cells, updatedAt: new Date().toISOString(),
      };
      updated++;
    } catch (error) {
      failed++;
      console.warn(`Профиль ${name}: ${error.message}`);
    }
  }));
}

if (updated === 0 && !Object.keys(profiles).length) {
  throw new Error('Не удалось получить ни одного открытого профиля');
}
await writeFile(destination, `${JSON.stringify({ profiles })}\n`);
console.log(`Сохранены профили: ${updated}; ошибки: ${failed}; всего: ${Object.keys(profiles).length}`);
