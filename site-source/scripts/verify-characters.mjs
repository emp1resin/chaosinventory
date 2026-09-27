import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);
const names = process.env.VERIFY_NAME ? [process.env.VERIFY_NAME] : ['mellstroy', 'destinys', 'LICHonTHEbeach', 'Thrandu1l'];
const slots = ['arms', 'gloves', 'weapon', 'belt', 'boots', 'helm', 'amulet', 'shield', 'ring1', 'ring2', 'armor'];
const runeCache = new Map();

async function json(url) {
  const cacheDir = process.env.VERIFY_CACHE_DIR;
  const cacheFile = cacheDir && `${cacheDir}/${createHash('sha256').update(url).digest('hex')}.json`;
  if (cacheFile) {
    try { return JSON.parse(await readFile(cacheFile, 'utf8')); } catch { /* first fetch */ }
  }
  const { stdout } = await execFileAsync('curl', ['-fLsS', '--max-time', '30', url], { maxBuffer: 2_000_000 });
  if (cacheFile) { await mkdir(cacheDir, { recursive: true }); await writeFile(cacheFile, stdout); }
  return stdout ? JSON.parse(stdout) : null;
}

async function itemWithRune(item) {
  if (!item || !/^\d+$/.test(String(item.breachRune)) || Number(item.breachRune) === 0) return item;
  const id = String(item.breachRune);
  if (!runeCache.has(id)) runeCache.set(id, json(`https://chaosage.ru/sAPI2.php?id=${id}&request=equipment_info`));
  const rune = await runeCache.get(id);
  item.breachRuneImported = true;
  item.breachRuneApiId = id;
  item.breachRune = rune.image?.match(/br_([a-z]+)\.png/i)?.[1] || rune.name?.replace(/^Руна\s+/i, '').trim().toLowerCase();
  item.breachRuneName = rune.name;
  item.breachRuneDescription = rune.desc;
  item.breachRuneImage = rune.image ? `https://chaosage.ru/images/${rune.image}` : '';
  return item;
}

const cases = {
  mellstroy: {
    skills: [['Алхимический ингибитор', 20, 2], ['Грузоподъемность', 8, 1], ['Алхимический стабилизатор', 9, 1], ['Алхимический активатор', 5, 0]],
  },
  destinys: {
    skills: [['Тиран', 12, 1], ['Двойное оружие', 14, 2], ['Громила', 14, 2]],
    arts: [5, 3, 1, 6], tournamentRune: true,
  },
  LICHonTHEbeach: {
    skills: [['Фехтовальщик', 14, 2], ['Тиран', 14, 2], ['Точность', 14, 2], ['Владение мечами', 14, 2]],
    arts: [5, 3, 1, 6],
    charBless: '15', lifeBless: '3', clanGlory: 44.582,
  },
  Thrandu1l: {
    skills: [['Громила', 14, 0], ['Регенерация', 4, 0], ['Уворотливость', 6, 0]],
  },
};
const destinysSnapshotIds = ['1360923', '1358788', '1360184', '1360784', '1346920', '1362469', '1339582', '1360262', '1379860', '1340406', '1334124'];
const destinysExpected = {
  damage: [3813, 5601], atack: 4333, defense: 3221,
  pointsOfAction: 317, pointOnBite: [7, 6.7],
  criticalDamage: 879, criticalMultiplier: 2.51, bleedingChance: 30,
  stability: 402, parry: 67, reaction: 145, armorPenetration: 812,
  regenerationHP: 1322, regenerationMP: 71, doubleChance: 50,
  dodge: 5, dodgeBySpell: 11, physicalVampirism: 5,
};
const thrandu1lExpected = {
  damage: [287, 304], atack: 950, defense: 760, armor: [88, 9],
  pointsOfAction: 162, pointOnBite: [9, 9.3], resists: [69, 8],
  criticalDamage: 0, criticalMultiplier: 1.5, bleedingChance: 30,
  stability: 15, parry: 48, reaction: 20, armorPenetration: 0,
  regenerationHP: 132, regenerationMP: 14,
  resistDamage: 0, doubleChance: 0, dodge: 0, dodgeBySpell: 0,
  counterattack: 0, resistTempraryEffects: 0, reflectionResistance: 0,
  physicalVampirism: 0, magicalVampirism: 0, alchemySaving: 0,
};

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ default: reducer }, { Result }, { default: allItems }] = await Promise.all([
    server.ssrLoadModule('/src/reducers/postReducer.jsx'),
    server.ssrLoadModule('/src/components/Results.jsx'),
    server.ssrLoadModule('/src/components/ItemsAll.jsx'),
  ]);
  const common = await json('https://chaosage.space/religionAndClansData');
  let state = reducer(undefined, { type: '@@INIT' });
  for (const name of names) {
    const [profile, equipment, fraction, clanList] = await Promise.all([
      json(`https://chaosage.space/getAvatarsDataByName?name=${encodeURIComponent(name)}`),
      json(`https://chaosage.ru/sAPI2.php?user_name=${name}&request=user_equipment_list`),
      json(`https://chaosage.ru/sAPI2.php?user_name=${name}&request=user_fraction`),
      json(`https://chaosage.ru/sAPI2.php?user_name=${name}&request=clan_list_by_user_name`),
    ]);
    if (!profile?.out || !equipment) throw new Error(`Missing profile or equipment: ${name}`);
    for (const [slot, label] of Object.entries(profile.out.things)) {
      profile.out.things[slot] = allItems.find((item) => item.name === label) || label;
    }
    const items = await Promise.all(slots.map((slot) => json(`https://chaosage.ru/sAPI2.php?id=${equipment[slot]}&request=equipment_info`).then(itemWithRune)));
    const members = clanList ? Object.values(clanList) : [];
    const position = members.findIndex((member) => String(member[1]).toLowerCase() === name.toLowerCase()) + 1 || 100;
    const previous = state;
    const previousEquipment = JSON.stringify(previous.thingOnPers);
    const previousModifiers = JSON.stringify(previous.modifireThings);
    state = reducer(state, {
      type: 'Загрузка персонажа', data: profile, modifireInformation: items,
      dataGlory: common.clansArr?.[profile.out.clan] || 0,
      fractionData: fraction?.fractionRLevel || 0, positionOnClan: position,
    });
    assert.equal(JSON.stringify(previous.thingOnPers), previousEquipment, 'old equipment mutated');
    assert.equal(JSON.stringify(previous.modifireThings), previousModifiers, 'old modifiers mutated');
    assert.ok(Object.values(state.allSkills).every((value) => value === 0), 'skills leaked between avatars');
    assert.equal(state.clansArtRune, 0, 'clan artifact leaked between avatars');
    assert.equal(state.turnireRune, false, 'tournament rune leaked between avatars');
    assert.equal(state.charBless, 'Нет');
    assert.equal(state.lifeBless, 'Нет');
    const c = cases[name] || { skills: [] };
    for (const [skill, level, mastery] of c.skills) {
      state = reducer(state, { type: `Изменить навык ${skill}`, data: level });
      state = reducer(state, { type: `Изменить мастерство навыка ${skill}`, data: mastery });
    }
    for (const [index, art] of (c.arts || []).entries()) {
      const labels = ['Меч вечного сияния', 'Сфера небесной энергии', 'Руна правителей', 'Маска огненного демона'];
      state = reducer(state, { type: `Изменить ${labels[index]}`, data: index === 2 && process.env.VERIFY_RUNES !== undefined ? Number(process.env.VERIFY_RUNES) : art });
    }
    if (c.charBless) state = reducer(state, { type: 'Смена Блага Характеристик', data: c.charBless });
    if (c.lifeBless) state = reducer(state, { type: 'Смена Блага Жизни', data: c.lifeBless });
    if (c.tournamentRune) state = reducer(state, { type: 'Изменить Турнирная руна' });
    if (c.clanGlory) state = { ...state, clanGlory: c.clanGlory };
    const component = new Result({
      level: state.levelChange, powerChange: state.powerChange, bodyChange: state.bodyChange,
      dexChange: state.dexChange, intellChange: state.intellChange, staminaChange: state.staminaChange,
      willChange: state.willChange, allSkills: state.allSkills, allSkillsMaster: state.allSkillsMaster,
      changeSkills: state.changeSkills, changeEquip: state.changeEquip, race: state.race,
      thingOnPers: state.thingOnPers, religion: state.religion, religionData: state.religionData,
      clanPosition: state.clanPosition, clanGlory: state.clanGlory,
      clansArtSword: state.clansArtSword, clansArtSphere: state.clansArtSphere,
      clansArtRune: state.clansArtRune, clansArtMask: state.clansArtMask,
      turnireRune: state.turnireRune, profession: state.profession, professionLevel: state.professionLevel,
      clan: state.clan, fractionReputation: state.fractionReputation,
      modifireThings: state.modifireThings, runesChange: state.runesChange,
      charBless: state.charBless, lifeBless: state.lifeBless, renderless: true,
    });
    component.render();
    if (name === 'Thrandu1l') {
      assert.equal(state.allSkills.alchstabilitySkills, 0, 'Thrandu1l: alchemy skill did not reset');
      for (const [key, expected] of Object.entries(thrandu1lExpected)) {
        assert.deepEqual(component.comparisonResult[key], expected, `Thrandu1l: ${key}`);
      }
      console.log('Thrandu1l: все контрольные параметры совпали с игровым снимком.');
    }
    if (name === 'destinys' && slots.every((slot, index) => String(equipment[slot]) === destinysSnapshotIds[index])) {
      for (const [key, expected] of Object.entries(destinysExpected)) {
        assert.deepEqual(component.comparisonResult[key], expected, `destinys: ${key}`);
      }
      assert.equal(component.comparisonResult.armor[0], 2863);
      assert.equal(component.comparisonResult.resists[0], 1678);
      console.log('destinys: все доступные контрольные параметры совпали с игровым снимком.');
    }
    console.log(JSON.stringify({ name, position, clanGlory: state.clanGlory,
      arts: [state.clansArtSword, state.clansArtSphere, state.clansArtRune, state.clansArtMask],
      blessings: [state.charBless, state.lifeBless], tournamentRune: state.turnireRune, stats: component.comparisonResult,
      equipped: Object.entries(state.thingOnPers).map(([slot, item]) => [slot, item?.name, state.modifireThings[slot]?.breachRune]),
      itemStats: items.map((item, index) => [slots[index], item?.name, item?.armor, item?.resistance, item?.APexp, item?.HPreg, item?.minDamage, item?.maxDamage, item?.vamp_physical]) }, null, 2));
  }
} finally {
  await server.close();
}
