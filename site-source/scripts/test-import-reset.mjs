import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { golemSupportPercent } from '../src/data/golem.js';
import { applyElixirs } from '../src/data/elixirs.js';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: reducer } = await server.ssrLoadModule('/src/reducers/postReducer.jsx');
  const avatar = (name) => ({ out: {
    race: 'Человек', profession: 'Нет', professionLvl: 0, religion: 'нет', clan: 'Нет',
    level: 60, power: 5, body: 5, dex: 5, intell: 5, stamina: 5, will: 5,
    things: {
      'Шлем': 'Шлем', 'Амулет': 'Амулет', 'Наручи': 'Наручи', 'Перчатки': 'Перчатки',
      'Доспехи': 'Доспех', 'Пояс': 'Пояс', 'Ботинки': 'Обувь',
      'Кольцо справа': 'Кольцо', 'Кольцо слева': 'Кольцо',
      'Оружие справа': 'Оружие', 'Оружие слева': 0,
    }, name,
  } });
  const importAvatar = (state, name) => reducer(state, {
    type: 'Загрузка персонажа', data: avatar(name), modifireInformation: Array.from({ length: 11 }, () => ({})),
    dataGlory: 0, fractionData: 0, positionOnClan: 100,
  });

  let first = importAvatar(undefined, 'первый');
  first = reducer(first, { type: 'Изменить навык Тиран', data: 12 });
  first = reducer(first, { type: 'Изменить мастерство навыка Тиран', data: 2 });
  first = reducer(first, { type: 'Изменить Руна правителей', data: 1 });
  first = reducer(first, { type: 'Изменить Турнирная руна' });
  first = reducer(first, { type: 'Смена Блага Жизни', data: '3' });
  first = reducer(first, { type: 'Смена голема', data: { type: 'Золотой', mode: 'Поддержка' } });
  assert.equal(golemSupportPercent(first.golem), 5.5);
  first = reducer(first, { type: 'Изменить мастерство навыка Магия стихий', data: 3 });
  first = reducer(first, { type: 'Переключить эликсир', data: 'attack' });
  first = reducer(first, { type: 'Переключить эликсир', data: 'armor' });
  first = reducer(first, { type: 'Переключить эликсир', data: 'greatAttack' });
  assert.deepEqual(first.elixirs, ['armor', 'greatAttack'], 'stronger attack elixir replaces weaker one');
  assert.deepEqual(applyElixirs(first.elixirs, { attack: 1000, armor: 100 }), { attack: 1750, armor: 360 });
  const previousEquipment = first.thingOnPers;
  const previousModifiers = first.modifireThings;
  const previousSkills = first.allSkills;

  const second = importAvatar(first, 'второй');
  assert.equal(second.allSkills.critDamageSkills, 0);
  assert.equal(second.allSkillsMaster.critDamageSkills, 0);
  assert.equal(second.clansArtRune, 0);
  assert.equal(second.turnireRune, false);
  assert.equal(second.lifeBless, 'Нет');
  assert.equal(second.charBless, 'Нет');
  assert.equal(second.golem.type, 'Нет');
  assert.equal(second.allSkillsMaster.elementSkills, 0);
  assert.deepEqual(second.elixirs, []);
  assert.notStrictEqual(second.thingOnPers, previousEquipment);
  assert.notStrictEqual(second.modifireThings, previousModifiers);
  assert.notStrictEqual(second.allSkills, previousSkills);
  assert.equal(first.clansArtRune, 1);
  assert.equal(first.turnireRune, true);
  assert.equal(first.golem.type, 'Золотой');

  const saved = reducer(second, { type: 'Загрузить все данные игрока', data: first });
  assert.equal(golemSupportPercent(saved.golem), 5.5);
  assert.equal(saved.allSkillsMaster.elementSkills, 3);
  assert.deepEqual(saved.elixirs, ['armor', 'greatAttack']);
  const olderSave = reducer(saved, { type: 'Загрузить все данные игрока', data: { ...first, golem: undefined, elixirs: undefined } });
  assert.equal(olderSave.golem.type, 'Нет');
  assert.deepEqual(olderSave.elixirs, []);

  const ranger = avatar('Рейнджер');
  ranger.out.clan = 'Наблюдатели';
  const imported = (state, dataGlory, positionOnClan) => reducer(state, {
    type: 'Загрузка персонажа', data: ranger,
    modifireInformation: Array.from({ length: 11 }, () => ({})),
    dataGlory, positionOnClan, fractionData: 0,
  });
  const missingGlory = imported(second, null, 4);
  assert.equal(missingGlory.clanGlory, null, 'An unavailable glory API is not zero glory');
  assert.equal(missingGlory.clanPosition, 4);
  const manualGlory = reducer(missingGlory, { type: 'Смена Клановой славы', data: '20.582' });
  assert.equal(manualGlory.clanGlory, '20.582');
  const refreshed = imported(manualGlory, 20.582, 4);
  assert.equal(refreshed.clanGlory, 20.582);
  assert.equal(imported(refreshed, null, null).clanPosition, null);
  console.log('Импорт второго аватара сбрасывает ручные настройки и не меняет снимок первого.');
} finally {
  await server.close();
}
