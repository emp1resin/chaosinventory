import assert from 'node:assert/strict';
import { createServer } from 'vite';

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
  assert.notStrictEqual(second.thingOnPers, previousEquipment);
  assert.notStrictEqual(second.modifireThings, previousModifiers);
  assert.notStrictEqual(second.allSkills, previousSkills);
  assert.equal(first.clansArtRune, 1);
  assert.equal(first.turnireRune, true);

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
