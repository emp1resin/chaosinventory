export const emptyGolem = Object.freeze({ type: 'Нет', mode: 'Нет', level: 1, energy: 1, overdrive: 0 });

const bounded = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));

/**
 * Provisional support model. The FAQ gives each increase relative to the base
 * effectiveness but does not specify how the increases combine or round.
 */
export function golemSupportPercent(golem = emptyGolem) {
  if (!golem || golem.type === 'Нет' || golem.mode !== 'Поддержка') return 0;
  const energy = bounded(golem.energy, 0, 1000);
  if (energy === 0) return 0;
  const level = bounded(golem.level, 1, 100);
  const overdrive = bounded(golem.overdrive, 0, 1000);
  const gold = golem.type === 'Золотой' ? 0.10 : 0;
  const increaseFromBase = gold + (level - 1) * 0.01 + Math.floor(energy / 10) * 0.01 + overdrive * 0.005;
  return Math.round(5 * (1 + increaseFromBase) * 1000) / 1000;
}
