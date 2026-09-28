import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { golemSupportDetails } from '../src/data/golem.js';

const scenarios = [
  [{ level: 1, energy: 0, overdrive: 0 }, 5],
  [{ level: 1, energy: 100, overdrive: 100 }, 8],
  [{ level: 100, energy: 100, overdrive: 100 }, 13.5],
];

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ default: reducer }, { Result }] = await Promise.all([
    server.ssrLoadModule('/src/reducers/postReducer.jsx'),
    server.ssrLoadModule('/src/components/Results.jsx'),
  ]);
  const state = structuredClone(reducer(undefined, { type: '@@INIT' }));
  state.willChange = 100;
  const modifier = state.modifireThings['Наручи'].parametrs;
  modifier['поглощение урона'] = 40;
  modifier['призыватель'] = 0.4;
  modifier['заклинатель'] = 0.3;
  modifier['разрушитель'] = 0.2;
  modifier['осквернитель'] = 0.2;
  modifier['уклон.'] = 5;
  modifier['магический вампиризм'] = 2;

  const calculate = (golem) => {
    const component = new Result({ ...state, golem, level: state.levelChange, renderless: true });
    component.render();
    return component.comparisonResult;
  };
  const baseline = calculate({ type: 'Нет', mode: 'Нет' });
  assert.equal(baseline.resistDamage, 40, 'Fixture must have uncapped absorption');
  assert.ok(baseline.powerOfDark > 0 && baseline.powerOfPray > 0);
  for (const [settings, expected] of scenarios) {
    const golem = { type: 'Золотой', mode: 'Поддержка', ...settings };
    const detail = golemSupportDetails(golem);
    assert.deepEqual(detail, { percent: expected, source: 'example' });
    const actual = calculate(golem);
    const multiplier = 1 + expected / 100;
    assert.equal(actual.atack, Math.round(baseline.atack * multiplier), 'Attack should gain Support');
    assert.deepEqual(actual.damage, baseline.damage.map(value => Math.round(value * multiplier)));
    assert.equal(actual.resistDamage, Math.round(baseline.resistDamage * multiplier));
    for (const name of ['powerOfDark', 'powerOfLight', 'powerOfDestruction', 'powerOfDefiler', 'powerOfPray']) {
      assert.ok(actual[name] > baseline[name], `${name} should gain Support`);
    }
    for (const name of ['dodge', 'dodgeBySpell', 'physicalVampirism', 'magicalVampirism', 'reflectionResistance']) {
      assert.equal(actual[name], baseline[name], `${name} must not gain Support`);
    }
  }
  assert.deepEqual(golemSupportDetails({ type: 'Золотой', mode: 'Поддержка', level: 2, energy: 0, overdrive: 0, supportManual: '7.2' }), { percent: 7.2, source: 'manual' });
  assert.equal(golemSupportDetails({ type: 'Золотой', mode: 'Поддержка', level: 2, energy: 0, overdrive: 0 }).source, 'estimate');
  assert.equal(golemSupportDetails({ type: 'Золотой', mode: 'Добыча', level: 1, energy: 100, overdrive: 100 }).percent, 0);
  console.log('GOLEM_SUPPORT_OK: three table cases, passive zero energy, damage/magic/absorption and exclusions');
} finally {
  await server.close();
}
