export const emptyGolem = Object.freeze({ type: 'Нет', mode: 'Нет', level: 1, energy: 0, overdrive: 0, supportManual: '' });

const bounded = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));

/** The three Golden/Support scenarios supplied by the player are control points. */
const observedGoldenSupport = new Map([
  ['1:0:0', 5],
  ['1:100:100', 8],
  ['100:100:100', 13.5],
]);

export function golemSupportDetails(golem = emptyGolem) {
  if (!golem || golem.type === 'Нет' || golem.mode !== 'Поддержка') return { percent: 0, source: 'off' };
  const manual = golem.supportManual;
  if (manual !== '' && manual !== undefined && manual !== null &&
    Number.isFinite(Number(manual)) && Number(manual) >= 0 && Number(manual) <= 100) {
    return { percent: Number(manual), source: 'manual' };
  }
  const energy = bounded(golem.energy, 0, 1000);
  const level = bounded(golem.level, 1, 100);
  const overdrive = bounded(golem.overdrive, 0, 1000);
  const observed = golem.type === 'Золотой' && observedGoldenSupport.get(`${level}:${energy}:${overdrive}`);
  if (observed !== undefined) return { percent: observed, source: 'example' };

  // FAQ lists effectiveness factors but does not specify exact character-stat rounding.
  // Keep this explicitly estimated until a game measurement establishes the rule.
  const gold = golem.type === 'Золотой' ? 0.10 : 0;
  const increaseFromBase = gold + (level - 1) * 0.01 + Math.floor(energy / 10) * 0.01 + overdrive * 0.005;
  return { percent: Math.round(5 * (1 + increaseFromBase) * 1000) / 1000, source: 'estimate' };
}

export function golemSupportPercent(golem = emptyGolem) {
  return golemSupportDetails(golem).percent;
}
