// The character profile contains display names. Names repeat across FAQ variants,
// so only the original_id of each equipped instance identifies its base item.
export const equipmentSlots = [
  ['Наручи', 'arms'], ['Перчатки', 'gloves'], ['Оружие справа', 'weapon'],
  ['Пояс', 'belt'], ['Ботинки', 'boots'], ['Шлем', 'helm'],
  ['Амулет', 'amulet'], ['Оружие слева', 'shield'],
  ['Кольцо слева', 'ring1'], ['Кольцо справа', 'ring2'], ['Доспехи', 'armor'],
];

export function resolveEquippedItems(profileThings, instances, catalog) {
  const byId = new Map(catalog.filter(item => Number(item.sourceId) > 0)
    .map(item => [String(item.sourceId), item]));
  const resolved = {...profileThings};
  const missing = [];

  equipmentSlots.forEach(([profileSlot], index) => {
    const instance = instances[index];
    if (!instance?.name) return; // The empty-slot labels from the profile remain.
    const originalId = String(instance.original_id || instance.id || '');
    const base = byId.get(originalId);
    if (base) resolved[profileSlot] = base;
    else missing.push({slot: profileSlot, name: instance.name, originalId});
  });

  return {resolved, missing};
}
