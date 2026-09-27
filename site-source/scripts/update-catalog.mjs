import { writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';

const BASE = 'https://chaosage.ru';
const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21];
const kinds = {
  1: 'Мечи', 2: 'Топоры', 3: 'Копья', 4: 'Дубины', 5: 'Луки',
  6: 'Арбалеты', 7: 'Наручи', 8: 'Перчатки', 9: 'Пояса',
  10: 'Ботинки', 11: 'Шлемы', 12: 'Амулеты', 13: 'Щиты',
  14: 'Кольца', 15: 'Доспехи', 16: 'Кловеры', 17: 'Артефакты',
  18: 'Клановые артефакты', 19: 'Священные артефакты', 21: 'Посохи',
};
const emptyImages = {
  Пояса: 'empty_belt.gif', Шлемы: 'empty_helm.gif', Наручи: 'empty_arms.gif',
  Перчатки: 'empty_gloves.gif', Амулеты: 'empty_amulet.gif', Ботинки: 'empty_boots.gif',
  Доспехи: 'empty_armor.gif', Кольца: 'empty_ring1.gif', Мечи: 'empty_weapon.gif',
  Топоры: 'empty_weapon.gif', Копья: 'empty_weapon.gif', Дубины: 'empty_weapon.gif',
  Луки: 'empty_weapon.gif', Арбалеты: 'empty_weapon.gif', Кловеры: 'empty_weapon.gif',
  Посохи: 'empty_weapon.gif', Щиты: 'empty_shield.gif', Артефакты: 'empty_amulet.gif',
  'Клановые артефакты': 'empty_amulet.gif', 'Священные артефакты': 'empty_amulet.gif',
};
const number = (value) => Number.parseFloat(value || 0) || 0;

function emptyItem(kind) {
  return {
    name: 'Нет', typeThing: 'Нет', kindOfThing: kind, needlvl: 0, durability: 0,
    weight: 0, costType: 'Цена покупки (серебро)', cost: 0,
    imgUrl: `${BASE}/images/${emptyImages[kind]}`,
    needPower: 0, needBody: 0, needDex: 0, powerItem: 0, bodyItem: 0,
    dexItem: 0, staminaItem: 0, willItem: 0, intellItem: 0,
    parametrs: parameters({}), complect: 'Нет', sourceId: 0,
  };
}

function parameters(item) {
  return {
    'урон': [number(item.minDamage), number(item.maxDamage)],
    'ОД на действие': number(item.APexp),
    'здоровье': number(item.HP),
    'мана': number(item.MP),
    'атака': number(item.attack),
    'защита': number(item.defence),
    'броня': number(item.armor),
    'пробой брони': number(item.pierce),
    'устойчивость': number(item.fastness),
    'ОД макс.': number(item.AP),
    'реакция': number(item.reaction),
    'восстановление маны': number(item.MPreg),
    'восстановление здоровья': number(item.HPreg),
    'крит. удар': number(item.critical),
    'крит. урон': number(item.criticalDamage),
    'сопротивление': number(item.resistance),
    'парирование': number(item.parry),
    'разрушитель': number(item.damageFactor),
    'заклинатель': number(item.charmFactor),
    'призыватель': number(item.summonFactor),
    'осквернитель': number(item.defiler),
    'поглощение урона': number(item.absorbtion),
    'сопрот. врем. эффектам': number(item.poisonResist),
    'контрудар': number(item.counterstrike),
    'уклон. магии': number(item.evasionMagic),
    'уклон.': number(item.evasion),
  };
}

function archetype(item) {
  const magic = number(item.giveIntelligence) + number(item.damageFactor) +
    number(item.charmFactor) + number(item.summonFactor) + number(item.defiler);
  const physical = number(item.giveStrength) + number(item.giveConstitution) +
    number(item.giveDexterity);
  if (magic > physical) return 'Маг';
  const requirements = [
    ['Силовик', number(item.needStrength)],
    ['Танк', number(item.needConstitution)],
    ['Ловкач', number(item.needDexterity)],
  ].sort((a, b) => b[1] - a[1]);
  return requirements[0][1] ? requirements[0][0] : 'Нет';
}

function convert(item, setNames) {
  const type = Number(item.type);
  const kind = kinds[type] || 'Артефакты';
  const gold = number(item.gold);
  return {
    name: item.name, typeThing: archetype(item), kindOfThing: kind,
    needlvl: number(item.needLevel), durability: number(item.durabilityMax),
    weight: number(item.weight),
    costType: gold ? 'Цена покупки (золото)' : 'Цена покупки (серебро)',
    cost: gold || number(item.silver),
    imgUrl: `${BASE}/images/${item.image}`,
    needPower: number(item.needStrength), needBody: number(item.needConstitution),
    needDex: number(item.needDexterity), powerItem: number(item.giveStrength),
    bodyItem: number(item.giveConstitution), dexItem: number(item.giveDexterity),
    staminaItem: number(item.giveEndurance), willItem: number(item.giveWill),
    intellItem: number(item.giveIntelligence), parametrs: parameters(item),
    complect: setNames.get(String(item.set)) || 'Некомплектный',
    sourceId: number(item.id), weaponType: number(item.weaponType),
    artifact: number(item.art) > 0,
    runeSlots: number(item.art) > 0 ? 15 : 10,
    description: item.desc || '',
  };
}

async function pooled(values, limit, worker) {
  const output = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      output[index] = await worker(values[index], index);
    }
  }));
  return output;
}

console.log('Читаем актуальные страницы FAQ…');
const pages = await pooled(sections, 6, async (type) => {
  const response = await fetch(`${BASE}/help.php?section=5&type=${type}`);
  if (!response.ok) throw new Error(`FAQ type=${type}: ${response.status}`);
  return [type, await response.text()];
});

const ids = new Set();
const setNames = new Map();
for (const [, html] of pages) {
  const $ = cheerio.load(html);
  $('[id^="div_set"]').each((_, element) => {
    const id = $(element).attr('id')?.replace('div_set', '');
    const title = $(element).find('u').first().text().replace(/\s+/g, ' ').trim();
    if (id && title) setNames.set(id, title);
  });
  $('[onclick*="copyToClipboard"]').each((_, element) => {
    const match = ($(element).attr('onclick') || '').match(/:item(\d+):/);
    if (match) ids.add(match[1]);
  });
}

console.log(`Загружаем ${ids.size} базовых предметов из игрового API…`);
const rawItems = await pooled([...ids], 18, async (id) => {
  const response = await fetch(`${BASE}/sAPI2.php?id=${id}&request=equipment_info`);
  if (!response.ok) throw new Error(`equipment ${id}: ${response.status}`);
  return response.json();
});

const emptyKinds = [...new Set(Object.values(kinds))];
const catalog = [
  ...emptyKinds.map(emptyItem),
  ...rawItems.filter((item) => item?.name).map((item) => convert(item, setNames)),
];
const stamp = new Date().toISOString();
const source = `// Автоматически создано scripts/update-catalog.mjs из FAQ и игрового API.\n` +
  `// Обновлено: ${stamp}; предметов: ${rawItems.length}.\n` +
  `const allItems = ${JSON.stringify(catalog, null, 2)};\n\nexport { allItems };\nexport default allItems;\n`;
await writeFile('src/components/ItemsAll.jsx', source);
console.log(`Готово: ${catalog.length} записей, ${setNames.size} комплектов.`);
