import { fetchCharacterProfile, fetchOfficialClanGlory } from './officialProfile.js';
import { fetchGameJson, gameUrl } from './gameApi.js';
import { ApiError, throwIfCancelled } from './apiTransport.js';
import { equipmentSlots, resolveEquippedItems } from './resolveEquipment.js';
import { recordDiagnostic } from './diagnostics.js';

export function validateEquipmentList(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || !/^[1-9]\d*$/.test(String(data.user_id || ''))) {
    throw new ApiError('INVALID_EQUIPMENT_LIST', 'Игра не вернула корректный список экипировки персонажа.');
  }
  for (const [label, key] of equipmentSlots) {
    if (!Object.hasOwn(data, key) || !/^\d+$/.test(String(data[key]))) {
      throw new ApiError('INVALID_EQUIPMENT_LIST', `В ответе игры отсутствует или повреждён слот «${label}».`);
    }
  }
  return data;
}
export function equipmentSignature(data) {
  return [data.user_id, ...equipmentSlots.map(([,key])=>data[key])].map(String).join(':');
}
export function clanPositionFor(data, name) {
  if (!data || typeof data !== 'object') return null;
  const rows = Object.values(data);
  if (rows.some(row => !row || typeof row[1] !== 'string')) return null;
  const normalize = value => String(value).trim().normalize('NFC').toLocaleLowerCase('ru-RU');
  const position = rows.findIndex(row => normalize(row[1]) === normalize(name));
  return position < 0 ? null : position + 1;
}
export async function mapLimited(values, limit, work, signal) {
  const results = new Array(values.length);
  let next = 0, failed = false;
  await Promise.all(Array.from({length:Math.min(limit,values.length)}, async () => {
    while (!failed) {
      throwIfCancelled(signal);
      const index = next++;
      if (index >= values.length) break;
      try { results[index] = await work(values[index], index); }
      catch (error) { failed = true; throw error; }
    }
  }));
  return results;
}

async function normalizeBreachRune(instance, readItem) {
  if (!instance) return null;
  const item = {...instance};
  const raw = String(item.breachRune || '0');
  if (raw === '0') return {...item, breachRune:'', breachRuneImported:false};
  if (!/^\d+$/.test(raw)) return {...item, breachRune:raw.toLowerCase(), breachRuneImported:true};
  const rune = await readItem(raw);
  const slug = rune.image?.match(/br_([a-z]+)\.png/i)?.[1] || rune.name?.replace(/^Руна\s+/i,'').trim().toLowerCase();
  if (!slug) throw new ApiError('INVALID_RUNE', `Игра не вернула описание руны Разлома #${raw}.`);
  return {...item, breachRuneApiId:raw, breachRune:slug, breachRuneName:rune.name,
    breachRuneDescription:rune.desc || '', breachRuneImage:rune.image ? `https://chaosage.ru/images/${rune.image}` : '', breachRuneImported:true};
}

// Produces one complete Redux action. No partial state changes while fetching.
// Caches exist only for this import, so reloading an avatar re-reads its items.
export async function importCharacter(name, catalog, {signal} = {}) {
  const nick = String(name || '').trim().normalize('NFC');
  if (!nick) throw new ApiError('INVALID_NAME', 'Введите ник персонажа.');
  const options = {signal};
  const {profile} = await fetchCharacterProfile(nick, options);
  const warnings = [];
  const optional = async (key, fn) => {
    try { return {status:'loaded', value:await fn()}; }
    catch (error) {
      if (error.code === 'CANCELLED') throw error;
      warnings.push(key);
      recordDiagnostic('optional_unavailable', {field:key, code:error.code || 'INVALID_RESPONSE'});
      return {status:'unavailable',value:null};
    }
  };
  const noClan = profile.out.clan === 'Нет';
  const [equipment, clanData, members, fraction, religion] = await Promise.all([
    fetchGameJson(gameUrl('user_equipment_list',{user_name:nick}), {...options,validate:validateEquipmentList}),
    noClan ? {status:'not-applicable',value:{}} : optional('Клановая слава', () => fetchOfficialClanGlory(options)),
    noClan ? {status:'not-applicable',value:null} : optional('Позиция в клане', () => fetchGameJson(gameUrl('clan_list_by_user_name',{user_name:nick}),options)),
    optional('Фракционная репутация', () => fetchGameJson(gameUrl('user_fraction',{user_name:nick}),options)),
    optional('Бонусы религии', () => fetchGameJson(gameUrl('user_religionBonuses',{user_name:nick}),options)),
  ]);
  recordDiagnostic('equipment_list_received', {slots:equipmentSlots.filter(([,key])=>Number(equipment[key])>0).length});
  const itemPromises = new Map();
  const readItem = id => {
    const key = String(id);
    if (!itemPromises.has(key)) itemPromises.set(key, fetchGameJson(gameUrl('equipment_info',{id:key}), {...options,validate:data=>{
      if (!data || typeof data.name !== 'string' || !data.name.trim() || String(data.id)!==key) {
        throw new ApiError('INVALID_ITEM', `Игра не вернула предмет #${key}.`);
      }
    }}).catch(error=>{itemPromises.delete(key);throw error;}));
    return itemPromises.get(key);
  };
  const instances = await mapLimited(equipmentSlots, 3, async ([slot,key]) => {
    const id = String(equipment[key]);
    if (Number(id) === 0) return null;
    try { return await normalizeBreachRune(await readItem(id),readItem); }
    catch (error) {
      if (error.code === 'CANCELLED') throw error;
      throw new ApiError(error.code || 'ITEM_UNAVAILABLE', `Вещь в слоте «${slot}» (#${id}): ${error.message}`);
    }
  }, signal);
  const found = resolveEquippedItems(profile.out.things, instances, catalog);
  if (found.missing.length) throw new ApiError('CATALOG_MISSING', `Нет базовых вещей в каталоге: ${found.missing.map(x=>`${x.name} (#${x.originalId})`).join(', ')}`);
  const current = await fetchGameJson(gameUrl('user_equipment_list',{user_name:nick}), {...options,validate:validateEquipmentList});
  if (equipmentSignature(equipment) !== equipmentSignature(current)) throw new ApiError('EQUIPMENT_CHANGED', 'Персонаж переоделся во время загрузки. Загрузите его ещё раз.');
  throwIfCancelled(signal);
  const position = noClan ? 100 : clanPositionFor(members.value,nick);
  const glory = noClan ? 0 : clanData.value?.[profile.out.clan] ?? null;
  if (!noClan && glory === null && !warnings.includes('Клановая слава')) warnings.push('Клановая слава');
  if (!noClan && position === null && !warnings.includes('Позиция в клане')) warnings.push('Позиция в клане');
  const fractionLevel = fraction.value?.fractionRLevel;
  const validFraction = fractionLevel != null && /^\d+$/.test(String(fractionLevel));
  if (!validFraction && !warnings.includes('Фракционная репутация')) warnings.push('Фракционная репутация');
  // Empty is an observed response, not a documented promise of zero bonuses.
  // A non-empty schema needs verification before mapping it into stat formulas.
  const religionStatus = religion.status === 'unavailable' ? 'unavailable' :
    religion.value && typeof religion.value === 'object' && Object.keys(religion.value).length === 0 ? 'empty' : 'unrecognized';
  if (religionStatus === 'unrecognized') warnings.push('Формат бонусов религии');
  return {
    type:'Загрузка персонажа', data:{...profile,out:{...profile.out,things:found.resolved}},
    dataGlory:glory, positionOnClan:position, fractionData:validFraction ? Number(fractionLevel) : 0,
    modifireInformation:instances, religionData:[],
    importMeta:{nick, loadedAt:new Date().toISOString(), warnings, religionStatus,
      clanGloryStatus:noClan?'not-applicable':glory===null?'unavailable':'loaded',
      clanPositionStatus:noClan?'not-applicable':position===null?'unavailable':'loaded',
      fractionStatus:validFraction?'loaded':'unavailable', equipped:instances.filter(Boolean).length},
  };
}
