import { readFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';

const base = 'https://chaosage.ru';
const categories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21];
const characters = [
  'Gedeon', 'LordTmu', 'Ф_Е_Н_Р_И_Р', 'алексвв', 'авв', 'Азраэль',
  'Пиранья', 'soulv', 'lory', 'ДИКИЙ_ТРОЛЛЬ', 'Sikome', 'Кенни',
  'SunRise', 'LICHonTHEbeach', 'Рафаил', 'Израель', 'DWARF', 'Raphael',
  'алекс2', 'alexv', 'avv', 'Valance', 'Азраил', 'TANOS', 'Foxeer',
];
const slots = ['arms', 'gloves', 'weapon', 'belt', 'boots', 'helm', 'amulet', 'shield', 'ring1', 'ring2', 'armor'];
const source = await readFile(new URL('../src/components/ItemsAll.jsx', import.meta.url), 'utf8');
const catalog = JSON.parse(source.slice(source.indexOf('['), source.lastIndexOf('];') + 1));
const byId = new Map(catalog.filter(item => item.sourceId).map(item => [String(item.sourceId), item]));

async function pooled(values, concurrency, task) {
  const out = Array(values.length);
  let next = 0;
  await Promise.all(Array.from({length: concurrency}, async () => {
    while (next < values.length) {
      const index = next++;
      try { out[index] = await task(values[index]); }
      catch (error) { out[index] = {error: String(error)}; }
    }
  }));
  return out;
}
async function json(url) {
  const response = await fetch(url, {signal: AbortSignal.timeout(25000)});
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

const faqPages = await pooled(categories, 5, async type => {
  const response = await fetch(`${base}/help.php?section=5&type=${type}`, {signal: AbortSignal.timeout(25000)});
  if (!response.ok) throw new Error(`${response.status} FAQ ${type}`);
  const $ = cheerio.load(await response.text());
  const ids = [];
  $('[onclick*="copyToClipboard"]').each((_, el) => {
    const match = ($(el).attr('onclick') || '').match(/:item(\d+):/);
    if (match) ids.push(match[1]);
  });
  return {type, ids};
});
const faqIds = new Set(faqPages.flatMap(page => page.ids || []));
const missing = [...faqIds].filter(id => !byId.has(id));
const removed = [...byId.keys()].filter(id => !faqIds.has(id));
const nameCounts = new Map();
for (const item of byId.values()) nameCounts.set(item.name, (nameCounts.get(item.name) || 0) + 1);
console.log(JSON.stringify({faqCategories: faqPages.map(p => ({type:p.type, count:p.ids?.length, error:p.error})),
  faqCount: faqIds.size, catalogCount: byId.size,
  repeatedNameGroups: [...nameCounts.values()].filter(count => count > 1).length,
  missing, removed}, null, 2));

const characterResults = await pooled(characters, 3, async name => {
  const equipped = await json(`${base}/sAPI2.php?user_name=${encodeURIComponent(name)}&request=user_equipment_list`);
  if (!equipped?.user_id) throw new Error('Empty official equipment API response');
  const items = await pooled(slots.filter(slot => Number(equipped[slot]) > 0), 6, async slot => {
    const data = await json(`${base}/sAPI2.php?id=${equipped[slot]}&request=equipment_info`);
    const item = byId.get(String(data.original_id));
    return {slot, id: String(data.id), original_id: String(data.original_id), name: data.name, catalogName: item?.name,
      imageMatches: item?.imgUrl.endsWith(`/${data.image}`) || false,
      match: Boolean(item), error: undefined};
  });
  const result = {name, equippedCount: items.length, items, errors: items.filter(item => item.error), missing: items.filter(item => !item.match)};
  console.log(JSON.stringify({name, equippedCount: items.length, errors: result.errors.length, missing: result.missing.length}));
  return result;
});
const issues = characterResults.flatMap(person => person.error
  ? [{name: person.name, error: person.error}]
  : person.items.filter(item => item.error || !item.match || !item.imageMatches)
    .map(item => ({name: person.name, ...item})));
console.log(JSON.stringify({summary: {
  checkedCharacters: characterResults.length,
  checkedEquippedItems: characterResults.reduce((total, person) => total + (person.equippedCount || 0), 0),
  charactersWithNoEquipment: characterResults.filter(person => person.equippedCount === 0).map(person => person.name),
  issues,
}}, null, 2));
if (faqPages.some(page => page.error) || missing.length || removed.length || issues.length) process.exitCode = 1;
