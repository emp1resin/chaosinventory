// Numeric effects from the game's FAQ (section 6, type 5) and supplied
// screenshots of the in-game shop, 27 September 2026. The game does not
// document whether the percentage applies before or after the fixed bonus;
// the calculator uses current * (1 + percent / 100) + flat provisionally.
const effect = (stat, flat = 0, percent = 0) => ({ [stat]: { flat, percent } });
const both = (left, right) => ({ ...left, ...right });

export const elixirs = [
  { id: 'attack', name: 'Эликсир наступления', source: 'Скриншот', effects: effect('attack', 300, 10) },
  { id: 'defence', name: 'Эликсир обороны', source: 'Скриншот', effects: effect('defence', 300, 10) },
  { id: 'armor', name: 'Эликсир фортификации', source: 'Скриншот', effects: effect('armor', 250, 10) },
  { id: 'resistance', name: 'Эликсир рассеяния', source: 'Скриншот', effects: effect('resistance', 300, 10) },
  { id: 'weaponDamage', name: 'Эликсир опустошения', source: 'Скриншот', effects: effect('weaponDamage', 250, 10) },
  { id: 'temporaryDamage', name: 'Эликсир чистоты', source: 'Скриншот', effects: effect('temporaryDamage', 15) },
  { id: 'destruction', name: 'Эликсир разрушения', source: 'Скриншот', effects: effect('destruction', 50, 5) },
  { id: 'caster', name: 'Эликсир зачарования', source: 'Скриншот', effects: effect('caster', 50, 5) },
  { id: 'summoner', name: 'Эликсир призыва', source: 'Скриншот', effects: effect('summoner', 50, 5) },
  { id: 'faith', name: 'Эликсир веры', source: 'Скриншот', effects: effect('faith', 10, 5) },
  { id: 'defiler', name: 'Эликсир чумы', source: 'Скриншот', effects: effect('defiler', 50, 5) },
  { id: 'greatAttack', name: 'Эликсир великого наступления', source: 'Скриншот', effects: effect('attack', 600, 15) },
  { id: 'greatDefence', name: 'Эликсир великой обороны', source: 'Скриншот', effects: effect('defence', 600, 15) },
  { id: 'greatArmor', name: 'Эликсир великой фортификации', source: 'Скриншот', effects: effect('armor', 500, 15) },
  { id: 'greatResistance', name: 'Эликсир великого рассеяния', source: 'Скриншот', effects: effect('resistance', 600, 15) },
  { id: 'greatWeaponDamage', name: 'Эликсир великого опустошения', source: 'Скриншот', effects: effect('weaponDamage', 500, 15) },
  { id: 'greatTemporaryDamage', name: 'Эликсир великой чистоты', source: 'Скриншот', effects: effect('temporaryDamage', 25) },
  { id: 'greatDestruction', name: 'Эликсир великого разрушения', source: 'Скриншот', effects: effect('destruction', 75, 10) },
  { id: 'greatCaster', name: 'Эликсир великого зачарования', source: 'Скриншот', effects: effect('caster', 75, 10) },
  { id: 'greatSummoner', name: 'Эликсир великого призыва', source: 'Скриншот', effects: effect('summoner', 75, 10) },
  { id: 'greatFaith', name: 'Эликсир великой веры', source: 'Скриншот', effects: effect('faith', 20, 10) },
  { id: 'greatDefiler', name: 'Эликсир великой чумы', source: 'Скриншот', effects: effect('defiler', 75, 10) },
  { id: 'rejuvenation', name: 'Эликсир омоложения', source: 'FAQ', effects: effect('regenerationHP', 70) },
  { id: 'flow', name: 'Эликсир потока', source: 'FAQ', effects: effect('regenerationMP', 50) },
  { id: 'vortex', name: 'Эликсир вихря', source: 'FAQ', effects: effect('regenerationMP', 120) },
  { id: 'reflection', name: 'Эликсир отражения', source: 'FAQ', effects: effect('parry', 20) },
  { id: 'invulnerability', name: 'Эликсир неуязвимости', source: 'FAQ', effects: both(effect('armor', 50), effect('resistance', 60)) },
  { id: 'greatInvulnerability', name: 'Эликсир великой неуязвимости', source: 'FAQ', effects: both(effect('armor', 80), effect('resistance', 120)) },
  { id: 'heroism', name: 'Эликсир героизма', source: 'FAQ', effects: both(effect('attack', 110), effect('defence', 110)) },
  { id: 'crystal', name: 'Волшебный кристалл', source: 'Скриншот', effects: effect('attributes', 50), special: 'Не складывается с благословением гармонии; +50 ко всем шести характеристикам на 6 часов.' },
  { id: 'absorption', name: 'Эликсир поглощения', source: 'FAQ', effects: {}, unknown: 'FAQ сообщает об увеличении брони без точного числа. Пока не рассчитывается.' },
  { id: 'glory', name: 'Эликсир славы', source: 'FAQ', effects: {}, unknown: 'FAQ сообщает об увеличении атаки и защиты без точных чисел. Пока не рассчитывается.' },
];

export const elixirById = Object.fromEntries(elixirs.map(item => [item.id, item]));

export function elixirDescription(item) {
  if (item.unknown) return item.unknown;
  if (item.special) return item.special;
  const labels = { attack: 'Атака', defence: 'Защита', armor: 'Броня', resistance: 'Сопротивление', weaponDamage: 'Урон оружием', temporaryDamage: 'Сопротивление временному урону', destruction: 'Разрушитель', caster: 'Заклинатель', summoner: 'Призыватель', faith: 'Вера', defiler: 'Осквернитель', regenerationHP: 'Восст. здоровья/мин', regenerationMP: 'Восст. маны/мин', parry: 'Парирование' };
  return Object.entries(item.effects).map(([stat, value]) => `${labels[stat]} +${value.flat}${value.percent ? ` и +${value.percent}%` : ''}`).join('; ');
}

export function selectElixir(selected = [], id) {
  const item = elixirById[id];
  if (!item) return selected;
  if (selected.includes(id)) return selected.filter(key => key !== id);
  const targets = Object.keys(item.effects);
  return [...selected.filter(key => !Object.keys(elixirById[key]?.effects || {}).some(target => targets.includes(target))), id];
}

export function applyElixirs(selected = [], stats) {
  const result = { ...stats };
  for (const id of selected) {
    for (const [stat, value] of Object.entries(elixirById[id]?.effects || {})) {
      if (stat === 'attributes') continue;
      result[stat] = (result[stat] || 0) * (1 + value.percent / 100) + value.flat;
    }
  }
  return result;
}
