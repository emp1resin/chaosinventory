import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { runesAll, runeWordBonuses } from '../src/data/runes.js';

// FAQ, section 16: a word grants its listed bonus plus each constituent rune once.
assert.equal(Object.keys(runesAll).length, 26);
assert.equal(Object.keys(runeWordBonuses).length, 15);
assert.equal(runesAll.q[0], 'Интеллект');
assert.equal(runesAll.q[1], 4);
assert.deepEqual(
  Object.fromEntries(Object.entries(runeWordBonuses.storm).filter(([key]) => key !== 'url')),
  {
    мана: 700, 'восстановление маны': 20, Воля: 4, Выносливость: 6,
    'ОД на действие': -0.1, 'восстановление здоровья': 40, 'ОД макс.': 40,
  },
);
assert.equal(runeWordBonuses.devotion.Сила, 8);
assert.equal(runeWordBonuses.devotion.Ловкость, 8);
assert.equal(runeWordBonuses.devotion['крит. удар'], 48);
assert.ok(Math.abs(runeWordBonuses.devotion['ОД на действие'] + 0.3) < 1e-9);
assert.equal(runeWordBonuses.conquest.Интеллект, 13);
assert.equal(runeWordBonuses.jinada.здоровье, 900);

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ ItemInfoSystem }, { default: reducer }] = await Promise.all([
    server.ssrLoadModule('/src/components/ItemInfoSystem.jsx'),
    server.ssrLoadModule('/src/reducers/postReducer.jsx'),
  ]);
  const view = new ItemInfoSystem({});
  const oldWord = view.getRuneWordTotal('devotion', runeWordBonuses, runesAll);
  const newWord = view.getRuneWordTotal('storm', runeWordBonuses, runesAll);
  assert.equal(oldWord.Сила, 8, 'rune letters must not be counted twice');
  assert.equal(newWord['восстановление маны'], 20);

  const original = {
    runes: 'devotionld', runeWord: 'devotion', powerItem: 22,
    bodyItem: 13, dexItem: 18, staminaItem: 16, willItem: 7, intellItem: 0,
    parametrs: { здоровье: 2106, мана: 0, 'ОД на действие': -1.05 },
  };
  let state = reducer(undefined, { type: '@@INIT' });
  state = { ...state, modifireThings: { ...state.modifireThings, Наручи: structuredClone(original) } };
  const changeWord = (name, previous) => {
    state = reducer(state, {
      type: `Добавить РС ${name}|Наручи`, oldRune: previous,
      bonuses: view.getRuneWordTotal(name, runeWordBonuses, runesAll),
      bonusesMinus: view.getRuneWordTotal(previous, runeWordBonuses, runesAll),
    });
  };
  changeWord('storm', 'devotion');
  assert.equal(state.modifireThings.Наручи.powerItem, 14);
  assert.equal(state.modifireThings.Наручи.parametrs.здоровье, 1656);
  assert.equal(state.modifireThings.Наручи.parametrs.мана, 700);
  assert.ok(Math.abs(state.modifireThings.Наручи.parametrs['ОД на действие'] + 0.85) < 1e-9);
  changeWord('devotion', 'storm');
  assert.equal(state.modifireThings.Наручи.powerItem, original.powerItem);
  assert.equal(state.modifireThings.Наручи.parametrs.здоровье, original.parametrs.здоровье);

  const staff = { runes: '', runeWord: '', intellItem: 19, parametrs: {} };
  state = { ...state, modifireThings: { ...state.modifireThings, 'Оружие Справа': staff } };
  const setQ = count => {
    state = reducer(state, {
      type: 'Установить количество рун', typeThing: 'Оружие Справа',
      rune: 'q', parameter: 'Интеллект', bonus: 4, count, limit: 10,
    });
  };
  setQ(10);
  assert.equal(state.modifireThings['Оружие Справа'].intellItem, 59);
  setQ(0);
  assert.equal(state.modifireThings['Оружие Справа'].intellItem, 19);
  console.log('Rune FAQ, word replacement, and 10 intelligence runes: OK');
} finally {
  await server.close();
}
