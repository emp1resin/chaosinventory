export const religionsWithoutBonuses = new Set(['иллириана']);

export function hasReligionBonuses(name) {
  return !religionsWithoutBonuses.has(String(name || '').trim().toLowerCase());
}

export function sanitizeReligionData(data) {
  if (!Array.isArray(data)) return [];
  return data.filter((entry) => hasReligionBonuses(entry?.nameOfReligion));
}
