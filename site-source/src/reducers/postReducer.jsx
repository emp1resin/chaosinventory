import { emptyGolem } from '../data/golem';
import { selectElixir, elixirById } from '../data/elixirs';

var initialState = {
	typoOfThings: 'Перчатки',
	race: 'Человек',
	runesChange: 0,
	clan: 'Нет',
	charBless: 'Нет',
	lifeBless: 'Нет',
	turnireRune: false,
	fractionReputation: 0,
	clansArtSword: 0,
	clansArtSphere: 0,
	clansArtRune: 0,
	clansArtMask: 0,
	clanPosition: 100,
	clanGlory: 0,
	importMeta: null,
	golem: { ...emptyGolem },
	elixirs: [],
	religion: 'Нет',
	religionData: false,
	profession: 'Нет',
	professionLevel: 0,
	loadedPerson: 0,
	thingInFoxus: {},
	changeSkills: 0,
	changeEquip: 0,
	levelChange: 1,
	powerChange: 5,
	bodyChange: 5,
	dexChange: 5,
	intellChange: 5,
	staminaChange: 5,
	willChange: 5,
	allSkills: {
		'swordSkills': 0,
		'axeSkills': 0,
		'spearSkills': 0,
		'bowSkills': 0,
		'crossbowSkills': 0,
		'batSkills': 0,
		'elementSkills': 0,
		'mindSkills': 0,
		'lightSkills': 0,
		'darkSkills': 0,
		'shieldSkills': 0,
		'dodgySkills': 0,
		'critSkills': 0,
		'critDamageSkills': 0,
		'thugSkills': 0,
		'healthSkills': 0,
		'fireskinSkills': 0,
		'vampireSkills': 0,
		'accuracySkills': 0,
		'stoneskinSkills': 0,
		'regenerationSkills': 0,
		'doubleSkills': 0,
		'meditationSkills': 0,
		'battlegraceSkills': 0,
		'fastrefSkills': 0,
		'afflictionSkills': 0,
		'destroyerSkills': 0,
		'summonerSkills': 0,
		'casterSkills': 0,
		'resistauraSkills': 0,
		'sustainabilitySkills': 0,
		'carryingSkills': 0,
		'secretknowledgeSkills': 0,
		'alchactiveSkills': 0,
		'alchingibSkills': 0,
		'alchstabilitySkills': 0,
		'gloverSkills': 0,
		'duelistSkills': 0,
		'warSkills': 0,
		'praySkills': 0,
		'palSkills': 0,
		'monkSkills': 0,
		'defilerSkills': 0,
		'posionSkills': 0,
		'plagueDoctorSkills': 0,
		'windWaySkills': 0,
		'swordsmanSkills': 0,
		'sniperSkill': 0,
		'shooterSkills': 0,
	},
	allSkillsMaster: {
		'swordSkills': 0,
		'axeSkills': 0,
		'spearSkills': 0,
		'bowSkills': 0,
		'crossbowSkills': 0,
		'batSkills': 0,
		'elementSkills': 0,
		'mindSkills': 0,
		'lightSkills': 0,
		'darkSkills': 0,
		'shieldSkills': 0,
		'dodgySkills': 0,
		'critSkills': 0,
		'critDamageSkills': 0,
		'thugSkills': 0,
		'healthSkills': 0,
		'fireskinSkills': 0,
		'vampireSkills': 0,
		'accuracySkills': 0,
		'stoneskinSkills': 0,
		'regenerationSkills': 0,
		'doubleSkills': 0,
		'meditationSkills': 0,
		'battlegraceSkills': 0,
		'fastrefSkills': 0,
		'afflictionSkills': 0,
		'destroyerSkills': 0,
		'summonerSkills': 0,
		'casterSkills': 0,
		'resistauraSkills': 0,
		'sustainabilitySkills': 0,
		'carryingSkills': 0,
		'secretknowledgeSkills': 0,
		'alchactiveSkills': 0,
		'alchingibSkills': 0,
		'alchstabilitySkills': 0,
		'gloverSkills': 0,
		'duelistSkills': 0,
		'warSkills': 0,
		'praySkills': 0,
		'palSkills': 0,
		'monkSkills': 0,
		'defilerSkills': 0,
		'posionSkills': 0,
		'plagueDoctorSkills': 0,
		'windWaySkills': 0,
		'swordsmanSkills': 0,
		'sniperSkill': 0,
		'shooterSkills': 0,
	},
	allSkillsNeedPoints: {
		'swordSkills': 0,
		'axeSkills': 0,
		'spearSkills': 0,
		'bowSkills': 0,
		'crossbowSkills': 0,
		'batSkills': 0,
		'elementSkills': 0,
		'mindSkills': 0,
		'lightSkills': 0,
		'darkSkills': 0,
		'shieldSkills': 0,
		'dodgySkills': 0,
		'critSkills': 0,
		'critDamageSkills': 0,
		'thugSkills': 0,
		'healthSkills': 0,
		'fireskinSkills': 0,
		'vampireSkills': 0,
		'accuracySkills': 0,
		'stoneskinSkills': 0,
		'regenerationSkills': 0,
		'doubleSkills': 0,
		'meditationSkills': 0,
		'battlegraceSkills': 0,
		'fastrefSkills': 0,
		'afflictionSkills': 0,
		'destroyerSkills': 0,
		'summonerSkills': 0,
		'casterSkills': 0,
		'resistauraSkills': 0,
		'sustainabilitySkills': 0,
		'carryingSkills': 0,
		'secretknowledgeSkills': 0,
		'alchactiveSkills': 0,
		'alchingibSkills': 0,
		'alchstabilitySkills': 0,
		'gloverSkills': 0,
		'duelistSkills': 0,
		'warSkills': 0,
		'praySkills': 0,
		'palSkills': 0,
		'monkSkills': 0,
		'defilerSkills': 0,
		'posionSkills': 0,
		'plagueDoctorSkills': 0,
		'windWaySkills': 0,
		'swordsmanSkills': 0,
		'sniperSkill': 0,
		'shooterSkills': 0,
	},
	thingOnPers: {
		'Шлемы': genItemObj('https://chaosage.ru/images/empty_helm.gif'),
		'Амулеты': genItemObj('https://chaosage.ru/images/empty_amulet.gif'),
		'Наручи': genItemObj('https://chaosage.ru/images/empty_arms.gif'),
		'Перчатки': genItemObj('https://chaosage.ru/images/empty_gloves.gif'),
		'Доспехи': genItemObj('https://chaosage.ru/images/empty_armor.gif'),
		'Пояса': genItemObj('https://chaosage.ru/images/empty_belt.gif'),
		'Ботинки': genItemObj('https://chaosage.ru/images/empty_boots.gif'),
		'Кольца Справа': genItemObj('https://chaosage.ru/images/empty_ring1.gif'),
		'Кольца Слева': genItemObj('https://chaosage.ru/images/empty_ring1.gif'),
		'Оружие Справа': genItemObj('https://chaosage.ru/images/empty_weapon.gif'),
		'Оружие Слева': genItemObj('https://chaosage.ru/images/empty_shield.gif'),

	},
	modifireThings: {
		'Шлемы': genMFRNRSObj('Шлемы'),
		'Амулеты': genMFRNRSObj('Амулеты'),
		'Наручи': genMFRNRSObj('Наручи'),
		'Перчатки': genMFRNRSObj('Перчатки'),
		'Доспехи': genMFRNRSObj('Доспехи'),
		'Пояса': genMFRNRSObj('Пояса'),
		'Ботинки': genMFRNRSObj('Ботинки'),
		'Кольца Справа': genMFRNRSObj('Кольца Справа'),
		'Кольца Слева': genMFRNRSObj('Кольца Слева'),
		'Оружие Справа': genMFRNRSObj('Оружие Справа'),
		'Оружие Слева': genMFRNRSObj('Оружие Слева'),

	}

};


// Генератор объектов для модификаций и рун
function genMFRNRSObj(n) {
	
//	console.log('Получаем шотку', n)
	var x = {
		"name": "Нет",
		"typeThing": n,
		"cost": "0",
		"runes": '',
		"runeWord": '',
		"breachRune": '',
		"breachRuneApiId": '',
		"breachRuneName": '',
		"breachRuneDescription": '',
		"breachRuneImage": '',
		"breachRuneImported": false,
		"powerItem": 0,
		"bodyItem": 0,
		"dexItem": 0,
		"staminaItem": 0,
		"willItem": 0,
		"intellItem": 0,
		"weight": 0,
		"parametrs": {
			"урон": [0, 0],
			"ОД на действие": 0,
			"здоровье": 0,
			"мана": 0,
			"атака": 0,
			"защита": 0,
			"броня": 0,
			"пробой брони": 0,
			"устойчивость": 0,
			"ОД макс.": 0,
			"реакция": 0,
			"восстановление маны": 0,
			"восстановление здоровья": 0,
			"крит. удар": 0,
			"крит. урон": 0,
			"сопротивление": 0,
			"парирование": 0,
			"заклинатель": 0,
			"призыватель": 0,
			"разрушитель": 0,
			"осквернитель": 0,
			"поглощение урона": 0,
			"сопрот. врем. эффектам": 0,
			"контрудар": 0,
			"уклон. магии": 0,
			"уклон.": 0,
			"вампиризм": 0,
			"магический вампиризм": 0
		},
	}
	return x
}

// Генератор первоначальных объектов для вещей
function genItemObj(n) {
	var x = {
		"name": "Нет",
		"typeThing": "Нет",
		"kindOfThing": "Нет",
		"needlvl": "0",
		"durability": "0",
		"weight": "0",
		"costType": "Цена покупки (серебро)",
		"cost": "0",
		"imgUrl": n,
		"needPower": 0,
		"needBody": 0,
		"needDex": 0,
		"powerItem": 0,
		"bodyItem": 0,
		"dexItem": 0,
		"staminaItem": 0,
		"willItem": 0,
		"intellItem": 0,
		"weight": 0,
		"parametrs": {
			"урон": [0, 0],
			"ОД на действие": 0,
			"здоровье": 0,
			"мана": 0,
			"атака": 0,
			"защита": 0,
			"броня": 0,
			"пробой брони": 0,
			"устойчивость": 0,
			"ОД макс.": 0,
			"реакция": 0,
			"восстановление маны": 0,
			"восстановление здоровья": 0,
			"крит. удар": 0,
			"крит. урон": 0,
			"сопротивление": 0,
			"парирование": 0,
			"заклинатель": 0,
			"призыватель": 0,
			"разрушитель": 0,
			"осквернитель": 0,
			"поглощение урона": 0,
			"сопрот. врем. эффектам": 0,
			"контрудар": 0,
			"уклон. магии": 0,
			"уклон.": 0
		},
		"complect": "Нет"
	}
	return x
}

//postReducer.js
const postReducer = (state = initialState, action) => {

	//	console.log(state)
	// Профиль не содержит навыков и клановых артефактов. При импорте
	// другого персонажа не переносим настройки предыдущего билда.
	if (action.type === 'Загрузка персонажа') {
		state = {
			...state,
			// Иначе вложенные объекты нового персонажа меняют состояние предыдущего.
			thingOnPers: { ...state.thingOnPers },
			modifireThings: { ...state.modifireThings },
			thingInFoxus: {},
			allSkills: Object.fromEntries(Object.keys(initialState.allSkills).map(key => [key, 0])),
			allSkillsMaster: Object.fromEntries(Object.keys(initialState.allSkillsMaster).map(key => [key, 0])),
			allSkillsNeedPoints: Object.fromEntries(Object.keys(initialState.allSkillsNeedPoints).map(key => [key, 0])),
			clansArtSword: 0,
			clansArtSphere: 0,
			clansArtRune: 0,
			clansArtMask: 0,
			charBless: 'Нет',
			lifeBless: 'Нет',
			turnireRune: false,
			golem: { ...emptyGolem },
			elixirs: [],
		};
	}

	return {
		runesChange: runesChange(state.runesChange, action),
		charBless: charBless(state.charBless, action),
		lifeBless: lifeBless(state.lifeBless, action),
		professionLevel: professionLevel(state.professionLevel, action),
		fractionReputation: fractionReputation(state.fractionReputation, action),
		clan: clan(state.clan, action),
		turnireRune: turnireRune(state.turnireRune, action),
		clansArtSword: clansArtSword(state.clansArtSword, action),
		clansArtSphere: clansArtSphere(state.clansArtSphere, action),
		clansArtRune: clansArtRune(state.clansArtRune, action),
		clansArtMask: clansArtMask(state.clansArtMask, action),
		clanPosition: clanPosition(state.clanPosition, action),
		clanGlory: clanGlory(state.clanGlory, action),
		golem: golem(state.golem, action),
		elixirs: elixirsReducer(state.elixirs, action),
		importMeta: action.type === 'Загрузка персонажа' ? action.importMeta ?? null : action.type === 'Загрузить все данные игрока' ? action.data.importMeta ?? null : state.importMeta,
		religionData: religionData(state.religionData, action),
		religion: religion(state.religion, action),
		profession: profession(state.profession, action),
		race: race(state.race, action),
		loadedPerson: loadDataByName(state.loadedPerson, action),
		thingOnPers: thingOnPers(state.thingOnPers, action),
		thingInFoxus: thingInFoxus(state.thingInFoxus, action),
		typoOfThings: typoOfThings(state.typoOfThings, action),
		changeSkills: changeSkills(state.changeSkills, action),
		changeEquip: changeEquip(state.changeEquip, action),
		levelChange: levelChange(state.levelChange, action),
		powerChange: powerChange(state.powerChange, action),
		bodyChange: bodyChange(state.bodyChange, action),
		dexChange: dexChange(state.dexChange, action),
		intellChange: intellChange(state.intellChange, action),
		staminaChange: staminaChange(state.staminaChange, action),
		willChange: willChange(state.willChange, action),
		allSkills: allSkills(state.allSkills, action),
		allSkillsMaster: allSkillsMaster(state.allSkillsMaster, action),
		allSkillsNeedPoints: allSkillsNeedPoints(state.allSkillsNeedPoints, action),
		modifireThings: modifireThings(state.modifireThings, action),

		getAllState: getAllState({
			...state
		}, action),
	}


}

// Возвращает весь стейт
function getAllState(state = [], action) {
	if (action.type === 'Записываем состояние примерочной') {
		console.log('Сохранение')
		return state
	}



}



// Функция быстро создающая готовый объект на вещи
function genModOn(x, n) {

//	console.log(x)

	var y = {
		"name": "Нет",
		"typeThing": n,
		"cost": "0",
		"runes": x.runes,
		"runeWord": x.runeWord,
		"breachRune": x.breachRune && x.breachRune !== '0' ? x.breachRune : '',
		"breachRuneApiId": x.breachRuneApiId || '',
		"breachRuneName": x.breachRuneName || '',
		"breachRuneDescription": x.breachRuneDescription || '',
		"breachRuneImage": x.breachRuneImage || '',
		"breachRuneImported": Boolean(x.breachRuneImported),
		"powerItem": x.giveStrength * 1,
		"bodyItem": x.giveConstitution * 1,
		"dexItem": x.giveDexterity * 1,
		"staminaItem": x.giveEndurance * 1,
		"willItem": x.giveWill * 1,
		"intellItem": x.giveIntelligence * 1,
		"weight": x.weight * 1,
		"parametrs": {
			"урон": [x.minDamage * 1, x.maxDamage * 1],
			"ОД на действие": x.APexp * 1,
			"здоровье": x.HP * 1,
			"мана": x.MP * 1,
			"атака": x.attack * 1,
			"защита": x.defence * 1,
			"броня": x.armor * 1,
			"пробой брони": x.pierce * 1,
			"устойчивость": x.fastness * 1,
			"ОД макс.": x.AP * 1,
			"реакция": x.reaction * 1,
			"восстановление маны": x.MPreg * 1,
			"восстановление здоровья": x.HPreg * 1,
			"крит. удар": x.critical * 1,
			"крит. урон": x.criticalDamage * 1,
			"сопротивление": x.resistance * 1,
			"парирование": x.parry * 1,
			"призыватель": x.summonFactor * 1,
			"заклинатель": x.charmFactor * 1,
			"разрушитель": x.damageFactor * 1,
			"осквернитель": x.defiler * 1,
			"поглощение урона": x.absorbtion * 1,
			"сопрот. врем. эффектам": x.poisonResist * 1,
			"контрудар": x.counterstrike * 1,
			"уклон. магии": x.evasionMagic * 1 - (x.breachRuneImported && x.breachRune === 'laguz' ? 4 : 0),
			"уклон.": x.evasion * 1 - (x.breachRuneImported && x.breachRune === 'laguz' ? 4 : 0),
			// API включает эффект вставленной руны в итог вещи. Руну Разлома
			// расчёт применяет отдельно, поэтому здесь оставляем только бонус вещи.
			"вампиризм": Math.max(0, (Number(x.vamp_physical) || 0) - (x.breachRuneImported && x.breachRune === 'fehu' ? 4 : 0)),
			"магический вампиризм": Math.max(0, (Number(x.vamp_magical) || 0) - (x.breachRuneImported && x.breachRune === 'algiz' ? 4 : 0)),
		},
	}
	return y
}

function applyRuneValue(item, parameter, value) {
	if (parameter === 'Телосложение') {
		item.bodyItem += value
	} else if (parameter === 'Сила') {
		item.powerItem += value
	} else if (parameter === 'Ловкость') {
		item.dexItem += value
	} else if (parameter === 'Интеллект') {
		item.intellItem += value
	} else if (parameter === 'Выносливость') {
		item.staminaItem += value
	} else if (parameter === 'Воля') {
		item.willItem += value
	} else {
		item.parametrs[parameter] = (item.parametrs[parameter] || 0) + value
	}
}

function modifireThings(state = [], action) {

	var k = action.type.split(' ')
	if (action.type === 'Загрузить все данные игрока') {


		state['Шлемы'] = action.data.modifireThings['Шлемы']
		state['Амулеты'] = action.data.modifireThings['Амулеты']
		state['Наручи'] = action.data.modifireThings['Наручи']
		state['Перчатки'] = action.data.modifireThings['Перчатки']
		state['Доспехи'] = action.data.modifireThings['Доспехи']
		state['Пояса'] = action.data.modifireThings['Пояса']
		state['Ботинки'] = action.data.modifireThings['Ботинки']
		state['Кольца Справа'] = action.data.modifireThings['Кольца Справа']
		state['Кольца Слева'] = action.data.modifireThings['Кольца Слева']
		state['Оружие Справа'] = action.data.modifireThings['Оружие Справа']
		state['Оружие Слева'] = action.data.modifireThings['Оружие Слева']

		return state
	} else if (action.type === 'Нацепить сет') {

		state['Шлемы'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Шлемы')))
		state['Амулеты'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Амулеты')))
		state['Наручи'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Наручи')))
		state['Перчатки'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Перчатки')))
		state['Доспехи'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Доспехи')))
		state['Пояса'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Пояса')))
		state['Ботинки'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Ботинки')))
		
		state['Кольца Справа'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Кольца')))
		state['Кольца Справа'].typeThing = 'Кольца Справа'
		
		
		state['Кольца Слева'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Кольца')))
		state['Кольца Слева'].typeThing = 'Кольцо Слева'
		
		state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Посохи') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Посохи'))) : undefined
		if (state['Оружие Справа'] === undefined) {
			state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Мечи') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Мечи'))) : undefined
		}
		if (state['Оружие Справа'] === undefined) {
			state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Арбалеты') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Арбалеты'))) : undefined
		}
		if (state['Оружие Справа'] === undefined) {
			state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Кловеры') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Кловеры'))) : undefined
		}
		state['Оружие Справа'].typeThing = 'Оружие Справа'
		
		state['Оружие Слева'] = genMFRNRSObj('Оружие Слева')
		
		return state
	} else if (action.type === 'Загрузка персонажа') {


		state['Шлемы'] = action.modifireInformation[5]?.name !== undefined ? genModOn(action.modifireInformation[5], 'Шлемы') : genMFRNRSObj('Шлемы')
		state['Амулеты'] = action.modifireInformation[6]?.name !== undefined ? genModOn(action.modifireInformation[6], 'Амулеты') : genMFRNRSObj('Амулеты')
		state['Наручи'] = action.modifireInformation[0]?.name !== undefined ? genModOn(action.modifireInformation[0], 'Наручи') : genMFRNRSObj('Наручи')
		state['Перчатки'] = action.modifireInformation[1]?.name !== undefined ? genModOn(action.modifireInformation[1], 'Перчатки') : genMFRNRSObj('Перчатки')
		state['Доспехи'] = action.modifireInformation[10]?.name !== undefined ? genModOn(action.modifireInformation[10], 'Доспехи') : genMFRNRSObj('Доспехи')
		state['Пояса'] = action.modifireInformation[3]?.name !== undefined ? genModOn(action.modifireInformation[3], 'Пояса') : genMFRNRSObj('Пояса')
		state['Ботинки'] = action.modifireInformation[4]?.name !== undefined ? genModOn(action.modifireInformation[4], 'Ботинки') : genMFRNRSObj('Ботинки')
		state['Кольца Справа'] = action.modifireInformation[9]?.name !== undefined ? genModOn(action.modifireInformation[9], 'Кольца Справа') : genMFRNRSObj('Кольца Справа')
		state['Кольца Слева'] = action.modifireInformation[8]?.name !== undefined ? genModOn(action.modifireInformation[8], 'Кольца Слева') : genMFRNRSObj('Кольца Слева')
		state['Оружие Справа'] = action.modifireInformation[2]?.name !== undefined ? genModOn(action.modifireInformation[2], 'Оружие Справа') : genMFRNRSObj('Оружие Справа')
		state['Оружие Слева'] = action.modifireInformation[7]?.name !== undefined ? genModOn(action.modifireInformation[7], 'Оружие Слева') : genMFRNRSObj('Оружие Слева')




		return state
	} else if (k[0] === 'Надеть') {
		console.log('Надеть')
		console.log(action.type)
		console.log(action.d)
		// Если ниже удалить, до при смене вещи произойдет и смена модов


		if (k.length === 2) {
			if (k[0] === 'Надеть') {

				// Меняем конкретную вещь
				state[k[1]] = action.d
				if (!state[k[1]].hasOwnProperty('runes')) {
					state[k[1]].runes = ''
					state[k[1]].runeWord = ''
				}
				state[k[1]].breachRune = state[k[1]].breachRune || ''

				console.log(state)
				return state
			}
		} else {

			state[k[1] + ' ' + k[2]] = action.d

			if (!state[k[1] + ' ' + k[2]].hasOwnProperty('runes')) {
				state[k[1] + ' ' + k[2]].runes = ''
				state[k[1] + ' ' + k[2]].runeWord = ''
			}
			state[k[1] + ' ' + k[2]].breachRune = state[k[1] + ' ' + k[2]].breachRune || ''
			console.log(state)
			return state

		}

		return state;

	} else if (action.type === 'Установить количество рун') {
		const item = state[action.typeThing]
		const runeWord = item.runeWord || ''
		const singleRunes = item.runes.replace(runeWord, '')
		const currentCount = singleRunes.split(action.rune).length - 1
		const otherRunes = singleRunes.split(action.rune).join('')
		const maxCount = Math.max(0, action.limit - runeWord.length - otherRunes.length)
		const requestedCount = Number.isFinite(action.count) ? Math.trunc(action.count) : 0
		const targetCount = Math.max(0, Math.min(maxCount, requestedCount))
		const difference = targetCount - currentCount

		item.runes = otherRunes + action.rune.repeat(targetCount) + runeWord
		applyRuneValue(item, action.parameter, difference * action.bonus)
		return state
	} else if ((k[0] === 'Добавить') && (k[1] === 'руну')) {
		//		console.log('Здесь')

		var labelThing = action.type.split('|')[1]
		var rune = action.type.split('|')[0][action.type.split('|')[0].length - 1]

		state[labelThing].runes += rune
		// Добавляем конкретную характеристику руны
		//		console.log(action.type.split('|')[2])
		//		console.log(action.type.split('|')[3])


		let y = action.type.split('|')[2]
		let s = action.type.split('|')[3] * 1

		applyRuneValue(state[labelThing], y, s)


		return state;
	} else if ((k[0] === 'Убрать') && (k[1] === 'руну')) {


		var labelThing = action.type.split('|')[1]
		var rune = action.type.split('|')[0][action.type.split('|')[0].length - 1]

		// Проверяем, есть ли РСв вещи и извклекаем её на время

		var alreadyHaveRuneWord = action.type.split('|')[4]

		// Убираем руну
		state[labelThing].runes = state[labelThing].runes.replace(alreadyHaveRuneWord, '')
		state[labelThing].runes = state[labelThing].runes.replace(rune, '')
		state[labelThing].runes += alreadyHaveRuneWord


		let y = action.type.split('|')[2]
		let s = action.type.split('|')[3] * 1

		applyRuneValue(state[labelThing], y, -s)


		return state;
	} else if ((k[0] === 'Добавить') && (k[1] === 'РС')) {

		var labelThing = action.type.split('|')[1]
		//		console.log(action.bonuses)
		//		console.log(action.bonusesMinus)

		// Добавляем руны
		// Мы должны зареплейсить прерыдущую РС

		state[labelThing].runes = state[labelThing].runes.replace(action.oldRune, action.type.split(' ')[2].split('|')[0])
		// Добавляем RS
		state[labelThing].runeWord = action.type.split(' ')[2].split('|')[0]
		// Добавляем все бонусы
		for (var i in action.bonuses) {
			if (i !== 'url') {
				applyRuneValue(state[labelThing], i, action.bonuses[i])
			}
		}
		// Вычитаем бонусы предыдущего РС
		for (var i in action.bonusesMinus) {
			if (i !== 'url') {
				applyRuneValue(state[labelThing], i, -action.bonusesMinus[i])
			}
		}

		return state;
	} else if (action.type === 'Изменить руну Разлома') {
		state[action.typeThing].breachRune = action.rune;
		state[action.typeThing].breachRuneApiId = '';
		state[action.typeThing].breachRuneName = '';
		state[action.typeThing].breachRuneDescription = '';
		state[action.typeThing].breachRuneImage = '';
		state[action.typeThing].breachRuneImported = false;
		return state;
	} else if (action.type === 'МФ') {
//		console.log('Был передан модификатор вещи')
//		console.log(action)

		// Для параметров
		if (!state[action.typeThing].parametrs.hasOwnProperty(action.mode)) {
			if (action.mode === 'урон1') {
				state[action.typeThing].parametrs['урон'][0] += action.div * 1
			} else if (action.mode === 'урон2') {
				state[action.typeThing].parametrs['урон'][1] += action.div * 1
			} else {
				state[action.typeThing][action.mode] += action.div * 1
			}
		} else {

			state[action.typeThing].parametrs[action.mode] += action.div * 1

		}




		return state;

	} else {
		return state;
	}


}

function charBless(state = [], action) {

	if (action.type === 'Смена Блага Характеристик') {
		return action.data
	 } else if (action.type === 'Загрузить все данные игрока') {

		return action.data.charBless;

	} 
	return state;
}

function lifeBless(state = [], action) {

	if (action.type === 'Смена Блага Жизни') {
		return action.data
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.lifeBless;

	} 
	return state;
}


function runesChange(state = [], action) {
	var k = action.type.split(' ')

	if ((k[0] === 'Добавить') || (k[0] === 'Убрать') || (action.type === 'МФ') || (action.type === 'Изменить руну Разлома') || (action.type === 'Установить количество рун')) {
		return state + 1;
	}
	if (action.type === 'Загрузить все данные игрока') {
		return action.data.runesChange || 0;
	}
	return state;
}

function thingOnPers(state = [], action) {

	var k = action.type.split(' ')
	if (action.type === 'Загрузить все данные игрока') {


		state['Шлемы'] = action.data.thingOnPers['Шлемы'] !== 'Шлемы' ? action.data.thingOnPers['Шлемы'] : genItemObj('https://chaosage.ru/images/empty_helm.gif');
		state['Амулеты'] = action.data.thingOnPers['Амулеты'] !== 'Амулет' ? action.data.thingOnPers['Амулеты'] : genItemObj('https://chaosage.ru/images/empty_amulet.gif');
		state['Наручи'] = action.data.thingOnPers['Наручи'] !== 'Наручи' ? action.data.thingOnPers['Наручи'] : genItemObj('https://chaosage.ru/images/empty_arms.gif');

		state['Перчатки'] = action.data.thingOnPers['Перчатки'] !== 'Перчатки' ? action.data.thingOnPers['Перчатки'] : genItemObj('https://chaosage.ru/images/empty_gloves.gif');
		state['Доспехи'] = action.data.thingOnPers['Доспехи'] !== 'Доспех' ? action.data.thingOnPers['Доспехи'] : genItemObj('https://chaosage.ru/images/empty_armor.gif');
		state['Пояса'] = action.data.thingOnPers['Поясы'] !== 'Пояс' ? action.data.thingOnPers['Пояса'] : genItemObj('https://chaosage.ru/images/empty_belt.gif');

		state['Ботинки'] = action.data.thingOnPers['Ботинки'] !== 'Обувь' ? action.data.thingOnPers['Ботинки'] : genItemObj('https://chaosage.ru/images/empty_boots.gif');

		state['Кольца Справа'] = action.data.thingOnPers['Кольца Справа'] !== 'Кольца Справа' ? action.data.thingOnPers['Кольца Справа'] : genItemObj('https://chaosage.ru/images/empty_ring1.gif');
		state['Кольца Слева'] = action.data.thingOnPers['Кольца Слева'] !== 'Кольца Слева' ? action.data.thingOnPers['Кольца Слева'] : genItemObj('https://chaosage.ru/images/empty_ring1.gif');

		state['Оружие Справа'] = action.data.thingOnPers['Оружие Справа'] !== 'Оружие Справа' ? action.data.thingOnPers['Оружие Справа'] : genItemObj('https://chaosage.ru/images/empty_weapon.gif');

		if ((action.data.thingOnPers['Оружие Слева'] === 0) || (action.data.thingOnPers['Оружие Слева'] === 'Щит/Оружие')) {
			state['Оружие Слева'] = genItemObj('https://chaosage.ru/images/empty_shield.gif')
		} else {
			state['Оружие Слева'] = action.data.thingOnPers['Оружие Слева']
		}



		return state
	} else if (action.type === 'Нацепить сет') {

		state['Шлемы'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Шлемы')))
		state['Амулеты'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Амулеты')))
		state['Наручи'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Наручи')))
		state['Перчатки'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Перчатки')))
		state['Доспехи'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Доспехи')));
		state['Пояса'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Пояса')));
		state['Ботинки'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Ботинки')));
		
		state['Кольца Справа'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Кольца')));
		state['Кольца Справа'].typeThing = 'Кольца Справа'
		
		state['Кольца Слева'] = JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Кольца')));
		state['Кольца Слева'].typeThing = 'Кольца Слева'
		
		state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Посохи') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Посохи'))) : undefined
		if (state['Оружие Справа'] === undefined) {
			state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Мечи') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Мечи'))) : undefined
		}
		if (state['Оружие Справа'] === undefined) {
			state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Арбалеты') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Арбалеты'))) : undefined
		}
		if (state['Оружие Справа'] === undefined) {
			state['Оружие Справа'] = action.items.find(x => x.kindOfThing === 'Кловеры') != undefined ? JSON.parse(JSON.stringify(action.items.find(x => x.kindOfThing === 'Кловеры'))) : undefined
		}
		state['Оружие Справа'].typeThing = 'Оружие Справа'
		
		state['Оружие Слева'] = genItemObj('https://chaosage.ru/images/empty_shield.gif')
		
		return state
	} else if (action.type === 'Загрузка персонажа') {
		
		state['Шлемы'] = action.data.out.things['Шлем'] !== 'Шлем' ? action.data.out.things['Шлем'] : genItemObj('https://chaosage.ru/images/empty_helm.gif');
		state['Амулеты'] = action.data.out.things['Амулет'] !== 'Амулет' ? action.data.out.things['Амулет'] : genItemObj('https://chaosage.ru/images/empty_amulet.gif');
		state['Наручи'] = action.data.out.things['Наручи'] !== 'Наручи' ? action.data.out.things['Наручи'] : genItemObj('https://chaosage.ru/images/empty_arms.gif');

		state['Перчатки'] = action.data.out.things['Перчатки'] !== 'Перчатки' ? action.data.out.things['Перчатки'] : genItemObj('https://chaosage.ru/images/empty_gloves.gif');
		state['Доспехи'] = action.data.out.things['Доспехи'] !== 'Доспех' ? action.data.out.things['Доспехи'] : genItemObj('https://chaosage.ru/images/empty_armor.gif');
		state['Пояса'] = action.data.out.things['Пояс'] !== 'Пояс' ? action.data.out.things['Пояс'] : genItemObj('https://chaosage.ru/images/empty_belt.gif');

		state['Ботинки'] = action.data.out.things['Ботинки'] !== 'Обувь' ? action.data.out.things['Ботинки'] : genItemObj('https://chaosage.ru/images/empty_boots.gif');

		state['Кольца Справа'] = action.data.out.things['Кольцо справа'] !== 'Кольцо' ? action.data.out.things['Кольцо справа'] : genItemObj('https://chaosage.ru/images/empty_ring1.gif');
		state['Кольца Слева'] = action.data.out.things['Кольцо слева'] !== 'Кольцо' ? action.data.out.things['Кольцо слева'] : genItemObj('https://chaosage.ru/images/empty_ring1.gif');

		state['Оружие Справа'] = action.data.out.things['Оружие справа'] !== 'Оружие' ? action.data.out.things['Оружие справа'] : genItemObj('https://chaosage.ru/images/empty_weapon.gif');

		if ((action.data.out.things['Оружие слева'] === 0) || (action.data.out.things['Оружие слева'] === 'Щит/Оружие')) {
			state['Оружие Слева'] = genItemObj('https://chaosage.ru/images/empty_shield.gif')
		} else {
			state['Оружие Слева'] = action.data.out.things['Оружие слева']
		}

		return state
		
	}else if (k[0] === 'Надеть') {

//		console.log('Конкретная вещь')
		if (k.length === 2) {
			if (k[0] === 'Надеть') {
				state[k[1]] = JSON.parse(JSON.stringify(action.d))
				return state
			}
		} else {

			state[k[1] + ' ' + k[2]] = JSON.parse(JSON.stringify(action.d))
			return state
		}

	}






	return state;

}

function loadDataByName(state = [], action) {

	switch (action.type) {

		case 'Загрузка персонажа':
			//			console.log(action.data)

			state += 1
			return state
		case 'Загрузить все данные игрока':
			state += 1
			return state

		case 'Нацепить сет':
			state += 1
			return state

		default:
			return state;
	}
}

function turnireRune(state = [], action) {

	if (action.type === 'Изменить Турнирная руна') {
		return !state;
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.turnireRune;

	} else {
		return state
	}
}

function clansArtSword(state = [], action) {

	if (action.type === 'Меч вечного сияния') {
		return state * 1 + 1;
	} else if (action.type === 'Изменить Меч вечного сияния') {
		return action.data
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.clansArtSword;

	} else {
		return state
	}
}

function clansArtSphere(state = [], action) {

	if (action.type === 'Сфера небесной энергии') {
		return state * 1 + 1;
	} else if (action.type === 'Изменить Сфера небесной энергии') {
		return action.data
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.clansArtSphere;

	} else {
		return state
	}
}

function clansArtRune(state = [], action) {

	if (action.type === 'Руна правителей') {
		return state * 1 + 1;
	} else if (action.type === 'Изменить Руна правителей') {
		return action.data
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.clansArtRune;

	} else {
		return state
	}
}

function clansArtMask(state = [], action) {
	if (action.type === 'Маска огненного демона') {
		return state * 1 + 1;
	} else if (action.type === 'Изменить Маска огненного демона') {
		return action.data
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.clansArtMask;

	} else {
		return state
	}
}

function religionData(state = [], action) {
	if (action.type === 'Загрузка персонажа') return action.religionData || [];
	if (action.type === 'Смена Религии') return [];
	if (action.type === 'Загрузить все данные игрока') return action.data.religionData || [];

	if (action.type === 'Получили бонусы религий') {
		return action.data;
	} else {
		return state
	}
}

function religion(state = [], action) {

	if (action.type === 'Смена Религии') {
		return action.data;
	} else if (action.type === 'Загрузка персонажа') {
		return action.data.out.religion === 'нет' ? 'Нет' : action.data.out.religion;
	} else if (action.type === 'Загрузить все данные игрока') {
		return action.data.religion === 'нет' ? 'Нет' : action.data.religion;
	} else {
		return state
	}
}

function race(state = [], action) {

	if (action.type === 'Смена Расы') {
		return action.data;
	} else if (action.type === 'Загрузка персонажа') {
		return action.data.out.race;
	} else if (action.type === 'Загрузить все данные игрока') {
		return action.data.race;
	} else {
		return state
	}
}

function fractionReputation(state = [], action) {

	if (action.type === 'Смена Фракционной репутации') {

		console.log(action.data)
		return action.data * 1;
	} else if (action.type === 'Загрузка персонажа') {
		return action.fractionData;
	} else if (action.type === 'Загрузить все данные игрока') {
		return action.data.fractionReputation;
	} else {
		return state
	}
}

function professionLevel(state = [], action) {

	if (action.type === 'Смена уровня Профессии') {
		return action.data;
	} else if (action.type === 'Загрузка персонажа') {
		return action.data.out.professionLvl;
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.professionLevel * 1;

	} else {
		return state
	}
}

function clan(state = [], action) {

	if (action.type === 'Смена Клана') {
		return action.data;
	} else if (action.type === 'Загрузка персонажа') {
		return action.data.out.clan;
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.clan;

	}else {
		return state
	}
}

function golem(state = emptyGolem, action) {
	if (action.type === 'Смена голема') return { ...state, ...action.data };
	if (action.type === 'Загрузка персонажа') return { ...emptyGolem };
	if (action.type === 'Загрузить все данные игрока') return { ...emptyGolem, ...action.data.golem };
	return state;
}

function elixirsReducer(state = [], action) {
  if (action.type === 'Переключить эликсир') return selectElixir(state, action.data);
  if (action.type === 'Смена Блага Характеристик' && action.data !== 'Нет') return state.filter(id => id !== 'crystal');
  if (action.type === 'Загрузка персонажа') return [];
  if (action.type === 'Загрузить все данные игрока') {
    const selected = Array.isArray(action.data.elixirs) ? action.data.elixirs : [];
    return selected.filter(id => elixirById[id] && !elixirById[id].unknown &&
      (id !== 'crystal' || action.data.charBless === 'Нет')).reduce(selectElixir, []);
  }
  return state;
}

function clanGlory(state = [], action) {

	//	console.log(action)
	if (action.type === 'Смена Клановой славы') {
		return action.data === '' ? null : action.data;
	} else if (action.type === 'Смена Клана') {
		if (action.data === 'Нет') return 0;
		const value = action.clan?.[action.data];
		return value == null ? null : Number(value);
	} else if (action.type === 'Загрузка персонажа') {
		return action.dataGlory ?? null;
	}  else if (action.type === 'Загрузить все данные игрока') {
		return action.data.clanGlory ?? null;
	} else {
		return state
	}
}

function clanPosition(state = [], action) {

	//	console.log(action.positionOnClan)
	if (action.type === 'Смена Позиции в Клане') {
		return action.data === '' || !Number.isInteger(Number(action.data)) || Number(action.data) < 1 ? null : Number(action.data);
	} else if (action.type === 'Загрузка персонажа') {
		return action.positionOnClan
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.clanPosition;

	}else {
		return state
	}
}

function profession(state = [], action) {

	if (action.type === 'Смена Профессии') {
		return action.data;
	} else if (action.type === 'Загрузка персонажа') {
		return action.data.out.profession;
	} else if (action.type === 'Загрузить все данные игрока') {

		return action.data.profession;

	} else {
		return state
	}
}

function thingInFoxus(state = [], action) {

	switch (action.type) {

		case 'Взять вещь в фокус':
			return action.data

		default:
			return state;
	}
}

function typoOfThings(state = [], action) {
	//	console.log(action)
	switch (action.type) {

		case "Изменить выбранный тип вещи на Перчатки":
			return action.data * 1

		default:
			return state;
	}
}

function powerChange(state = [], action) {

	switch (action.type) {

		case "Изменить параметр Сила":
			return action.data * 1

		case "Загрузка персонажа":
			return action.data.out.power
		case "Загрузить все данные игрока":
			return action.data.powerChange
		default:
			return state;
	}
}
//function loadedPerson(state = [], action) {
//	
//	switch (action.type) {
//
//		case "Загрузка персонажа":
//			console.log(state)
//			return state + 1
//			
//		default:
//			return state;
//	 }
//}

function levelChange(state = [], action) {

	switch (action.type) {

		case "Загрузка персонажа":
			//			console.log(action.data.out.power)
			return action.data.out.level

		case "Изменить параметр Уровень персонажа":
			return action.data * 1
		case "Загрузить все данные игрока":
			return action.data.levelChange
		default:
			return state;
	}
}

function bodyChange(state = [], action) {

	switch (action.type) {

		case "Изменить параметр Телосложение":
			return action.data * 1

		case "Загрузка персонажа":
			return action.data.out.body
		case "Загрузить все данные игрока":
			return action.data.bodyChange
		default:
			return state;
	}
}

function dexChange(state = [], action) {

	switch (action.type) {

		case "Изменить параметр Ловкость":
			return action.data * 1
		case "Загрузка персонажа":
			return action.data.out.dex
		case "Загрузить все данные игрока":
			return action.data.dexChange
		default:
			return state;
	}
}

function intellChange(state = [], action) {

	switch (action.type) {

		case "Изменить параметр Интеллект":
			return action.data * 1
		case "Загрузка персонажа":
			return action.data.out.intell
		case "Загрузить все данные игрока":
			return action.data.intellChange
		default:
			return state;
	}
}

function staminaChange(state = [], action) {

	switch (action.type) {

		case "Изменить параметр Выносливость":
			return action.data * 1
		case "Загрузка персонажа":
			return action.data.out.stamina
		case "Загрузить все данные игрока":
			return action.data.staminaChange
		default:
			return state;
	}
}

function willChange(state = [], action) {

	switch (action.type) {

		case "Изменить параметр Воля":
			return action.data * 1
		case "Загрузка персонажа":
			return action.data.out.will
		case "Загрузить все данные игрока":
			return action.data.willChange
		default:
			return state;
	}
}

function allSkills(state = [], action) {


	//	console.log(action.type)
	switch (action.type) {

		case "Загрузить все данные игрока":
			state.swordSkills = action.data.allSkills.swordSkills
			state.axeSkills = action.data.allSkills.axeSkills
			state.spearSkills = action.data.allSkills.spearSkills
			state.bowSkills = action.data.allSkills.bowSkills
			state.crossbowSkills = action.data.allSkills.crossbowSkills
			state.batSkills = action.data.allSkills.batSkills
			state.elementSkills = action.data.allSkills.elementSkills
			state.mindSkills = action.data.allSkills.mindSkills
			state.lightSkills = action.data.allSkills.lightSkills
			state.darkSkills = action.data.allSkills.darkSkills
			state.shieldSkills = action.data.allSkills.shieldSkills
			state.dodgySkills = action.data.allSkills.dodgySkills
			state.critSkills = action.data.allSkills.critSkills
			state.critDamageSkills = action.data.allSkills.critDamageSkills
			state.thugSkills = action.data.allSkills.thugSkills
			state.healthSkills = action.data.allSkills.healthSkills
			state.fireskinSkills = action.data.allSkills.fireskinSkills
			state.vampireSkills = action.data.allSkills.vampireSkills
			state.accuracySkills = action.data.allSkills.accuracySkills
			state.stoneskinSkills = action.data.allSkills.stoneskinSkills
			state.regenerationSkills = action.data.allSkills.regenerationSkills
			state.doubleSkills = action.data.allSkills.doubleSkills
			state.meditationSkills = action.data.allSkills.meditationSkills
			state.battlegraceSkills = action.data.allSkills.battlegraceSkills
			state.fastrefSkills = action.data.allSkills.fastrefSkills || 0
			state.afflictionSkills = action.data.allSkills.afflictionSkills
			state.destroyerSkills = action.data.allSkills.destroyerSkills
			state.summonerSkills = action.data.allSkills.summonerSkills
			state.casterSkills = action.data.allSkills.casterSkills
			state.resistauraSkills = action.data.allSkills.resistauraSkills
			state.sustainabilitySkills = action.data.allSkills.sustainabilitySkills
			state.carryingSkills = action.data.allSkills.carryingSkills
			state.secretknowledgeSkills = action.data.allSkills.secretknowledgeSkills
			state.alchactiveSkills = action.data.allSkills.alchactiveSkills
			state.alchingibSkills = action.data.allSkills.alchingibSkills
			state.alchstabilitySkills = action.data.allSkills.alchstabilitySkills
			state.gloverSkills = action.data.allSkills.gloverSkills
			state.duelistSkills = action.data.allSkills.duelistSkills
			
			state.warSkills = action.data.allSkills.warSkills || 0
			state.praySkills = action.data.allSkills.praySkills || 0
			state.palSkills = action.data.allSkills.palSkills || 0
			state.monkSkills = action.data.allSkills.monkSkills || 0
			
			state.defilerSkills = action.data.allSkills.defilerSkills || 0
			state.posionSkills = action.data.allSkills.posionSkills || 0
			state.plagueDoctorSkills = action.data.allSkills.plagueDoctorSkills || 0
			state.windWaySkills = action.data.allSkills.windWaySkills || 0
			state.swordsmanSkills = action.data.allSkills.swordsmanSkills || 0

			state.sniperSkill = action.data.allSkills.sniperSkill || 0
			state.shooterSkills = action.data.allSkills.shooterSkills || 0
			
			return {...state}
		case "Изменить навык Владение мечами":

			state.swordSkills = action.data * 1
			//			console.log(state.swordSkills)
			return state

		case "Изменить навык Владение топорами":

			state.axeSkills = action.data * 1
			return state
		case "Изменить навык Владение копьями":

			state.spearSkills = action.data * 1
			return state

		case "Изменить навык Владение луками":

			state.bowSkills = action.data * 1
			return state

		case "Изменить навык Владение арбалетами":

			state.crossbowSkills = action.data * 1
			return state

		case "Изменить навык Владение дубинами":

			state.batSkills = action.data * 1
			return state

		case "Изменить навык Магия стихий":

			state.elementSkills = action.data * 1
			return state

		case "Изменить навык Магия разума":

			state.mindSkills = action.data * 1
			return state

		case "Изменить навык Магия света":

			state.lightSkills = action.data * 1
			return state

		case "Изменить навык Магия тьмы":

			state.darkSkills = action.data * 1
			return state

		case "Изменить навык Владение щитами":

			state.shieldSkills = action.data * 1
			return state

		case "Изменить навык Уворотливость":

			state.dodgySkills = action.data * 1
			return state

		case "Изменить навык Критический удар":

			state.critSkills = action.data * 1
			return state

		case "Изменить навык Тиран":

			state.critDamageSkills = action.data * 1
			return state

		case "Изменить навык Громила":

			state.thugSkills = action.data * 1
			return state

		case "Изменить навык Здоровяк":

			state.healthSkills = action.data * 1
			return state

		case "Изменить навык Огненная кожа":

			state.fireskinSkills = action.data * 1
			return state

		case "Изменить навык Вампиризм":

			state.vampireSkills = action.data * 1
			return state

		case "Изменить навык Точность":

			state.accuracySkills = action.data * 1
			return state

		case "Изменить навык Каменная кожа":

			state.stoneskinSkills = action.data * 1
			return state

		case "Изменить навык Регенерация":

			state.regenerationSkills = action.data * 1
			return state

		case "Изменить навык Двойное оружие":

			state.doubleSkills = action.data * 1
			return state

		case "Изменить навык Медитация":

			state.meditationSkills = action.data * 1
			return state

		case "Изменить навык Боевая грация":

			state.battlegraceSkills = action.data * 1
			return state
		case "Изменить навык Быстрые рефлексы":

			state.fastrefSkills = action.data * 1
			return state

		case "Изменить навык Сокрушение":

			state.afflictionSkills = action.data * 1
			return state

		case "Изменить навык Разрушитель":

			state.destroyerSkills = action.data * 1
			return state

		case "Изменить навык Призыватель":

			state.summonerSkills = action.data * 1
			return state

		case "Изменить навык Заклинатель":

			state.casterSkills = action.data * 1
			return state

		case "Изменить навык Аура сопротивления":

			state.resistauraSkills = action.data * 1
			return state

		case "Изменить навык Устойчивость":

			state.sustainabilitySkills = action.data * 1
			return state

		case "Изменить навык Грузоподъемность":

			state.carryingSkills = action.data * 1
			return state

		case "Изменить навык Тайные знания":

			state.secretknowledgeSkills = action.data * 1
			return state

		case "Изменить навык Алхимический активатор":

			state.alchactiveSkills = action.data * 1
			return state

		case "Изменить навык Алхимический ингибитор":

			state.alchingibSkills = action.data * 1
			return state

		case "Изменить навык Алхимический стабилизатор":

			state.alchstabilitySkills = action.data * 1
			return state

		case "Изменить навык Владение кловерами":

			state.gloverSkills = action.data * 1
			return state

		case "Изменить навык Дуэлянт":

			state.duelistSkills = action.data * 1
			return state
		case "Изменить навык Воитель":

			state.warSkills = action.data * 1
			return state	
		case "Изменить навык Магия веры":

			state.praySkills = action.data * 1
			return state	
		case "Изменить навык Паладин":

			state.palSkills = action.data * 1
			return state	
		case "Изменить навык Монах":

			state.monkSkills = action.data * 1
			return state
			
		case "Изменить навык Магия чумы":
			state.defilerSkills = action.data * 1
			return state

		case "Изменить навык Ядомансер":
			state.posionSkills = action.data * 1
			return state

		case "Изменить навык Чумной доктор":
			state.plagueDoctorSkills = action.data * 1
			return state

		case "Изменить навык Путь ветра":
			state.windWaySkills = action.data * 1
			return state

		case "Изменить навык Фехтовальщик":
			state.swordsmanSkills = action.data * 1
			return state

		case "Изменить навык Снайпер":
			state.sniperSkill = action.data * 1
			return state

		case "Изменить навык Застрельщик":
			state.shooterSkills = action.data * 1
			return state

		default:
			return state;
	}
}

function changeSkills(state = [], action) {


	//	console.log(state)
	return state + 1
}

function changeEquip(state = [], action) {


	//	console.log(state)
	return state + 1
}

function allSkillsMaster(state = [], action) {

	switch (action.type) {

		case "Загрузить все данные игрока":
			state.swordSkills = action.data.allSkillsMaster.swordSkills
			state.axeSkills = action.data.allSkillsMaster.axeSkills
			state.spearSkills = action.data.allSkillsMaster.spearSkills
			state.bowSkills = action.data.allSkillsMaster.bowSkills
			state.crossbowSkills = action.data.allSkillsMaster.crossbowSkills
			state.batSkills = action.data.allSkillsMaster.batSkills
			state.elementSkills = action.data.allSkillsMaster.elementSkills
			state.mindSkills = action.data.allSkillsMaster.mindSkills
			state.lightSkills = action.data.allSkillsMaster.lightSkills
			state.darkSkills = action.data.allSkillsMaster.darkSkills
			state.shieldSkills = action.data.allSkillsMaster.shieldSkills
			state.dodgySkills = action.data.allSkillsMaster.dodgySkills
			state.critSkills = action.data.allSkillsMaster.critSkills
			state.critDamageSkills = action.data.allSkillsMaster.critDamageSkills || 0
			state.thugSkills = action.data.allSkillsMaster.thugSkills
			state.healthSkills = action.data.allSkillsMaster.healthSkills
			state.fireskinSkills = action.data.allSkillsMaster.fireskinSkills
			state.vampireSkills = action.data.allSkillsMaster.vampireSkills
			state.accuracySkills = action.data.allSkillsMaster.accuracySkills
			state.stoneskinSkills = action.data.allSkillsMaster.stoneskinSkills
			state.regenerationSkills = action.data.allSkillsMaster.regenerationSkills
			state.doubleSkills = action.data.allSkillsMaster.doubleSkills
			state.meditationSkills = action.data.allSkillsMaster.meditationSkills
			state.battlegraceSkills = action.data.allSkillsMaster.battlegraceSkills
			state.fastrefSkills = action.data.allSkillsMaster.fastrefSkills || 0
			state.afflictionSkills = action.data.allSkillsMaster.afflictionSkills
			state.destroyerSkills = action.data.allSkillsMaster.destroyerSkills
			state.summonerSkills = action.data.allSkillsMaster.summonerSkills
			state.casterSkills = action.data.allSkillsMaster.casterSkills
			state.resistauraSkills = action.data.allSkillsMaster.resistauraSkills
			state.sustainabilitySkills = action.data.allSkillsMaster.sustainabilitySkills
			state.carryingSkills = action.data.allSkillsMaster.carryingSkills
			state.secretknowledgeSkills = action.data.allSkillsMaster.secretknowledgeSkills
			state.alchactiveSkills = action.data.allSkillsMaster.alchactiveSkills
			state.alchingibSkills = action.data.allSkillsMaster.alchingibSkills
			state.alchstabilitySkills = action.data.allSkillsMaster.alchstabilitySkills
			state.gloverSkills = action.data.allSkillsMaster.gloverSkills
			state.duelistSkills = action.data.allSkillsMaster.duelistSkills
			
			state.warSkills = action.data.allSkillsMaster.warSkills || 0
			state.praySkills = action.data.allSkillsMaster.praySkills || 0
			state.palSkills = action.data.allSkillsMaster.palSkills || 0
			state.monkSkills = action.data.allSkillsMaster.monkSkills || 0
			
			state.defilerSkills = action.data.allSkillsMaster.defilerSkills || 0
			state.posionSkills = action.data.allSkillsMaster.posionSkills || 0
			state.plagueDoctorSkills = action.data.allSkillsMaster.plagueDoctorSkills || 0
			state.windWaySkills = action.data.allSkillsMaster.windWaySkills || 0
			state.swordsmanSkills = action.data.allSkillsMaster.swordsmanSkills || 0

			state.sniperSkill = action.data.allSkillsMaster.sniperSkill || 0
			state.shooterSkills = action.data.allSkillsMaster.shooterSkills || 0
			
			return {...state}
		case "Изменить мастерство навыка Владение мечами":

			state.swordSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Владение топорами":

			state.axeSkills = action.data * 1
			return state
		case "Изменить мастерство навыка Владение копьями":

			state.spearSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Владение луками":

			state.bowSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Владение арбалетами":

			state.crossbowSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Владение дубинами":

			state.batSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Магия стихий":

			state.elementSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Магия разума":

			state.mindSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Магия света":

			state.lightSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Магия тьмы":

			state.darkSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Владение щитами":

			state.shieldSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Уворотливость":

			state.dodgySkills = action.data * 1
			return state

		case "Изменить мастерство навыка Критический удар":

			state.critSkills = action.data * 1
			return state

		
		case "Изменить мастерство навыка Тиран":

			state.critDamageSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Громила":

			state.thugSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Здоровяк":

			state.healthSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Огненная кожа":

			state.fireskinSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Вампиризм":

			state.vampireSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Точность":

			state.accuracySkills = action.data * 1
			return state

		case "Изменить мастерство навыка Каменная кожа":

			state.stoneskinSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Регенерация":

			state.regenerationSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Двойное оружие":

			state.doubleSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Медитация":

			state.meditationSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Боевая грация":

			state.battlegraceSkills = action.data * 1
			return state
		case "Изменить мастерство навыка Быстрые рефлексы":

			state.fastrefSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Сокрушение":

			state.afflictionSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Разрушитель":

			state.destroyerSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Призыватель":

			state.summonerSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Заклинатель":

			state.casterSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Аура сопротивления":

			state.resistauraSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Устойчивость":

			state.sustainabilitySkills = action.data * 1
			return state

		case "Изменить мастерство навыка Грузоподъемность":

			state.carryingSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Тайные знания":

			state.secretknowledgeSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Алхимический активатор":

			state.alchactiveSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Алхимический ингибитор":

			state.alchingibSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Алхимический стабилизатор":

			state.alchstabilitySkills = action.data * 1
			return state

		case "Изменить мастерство навыка Владение кловерами":

			state.gloverSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Дуэлянт":

			state.duelistSkills = action.data * 1
			return state
			
		case "Изменить мастерство навыка Воитель":

			state.warSkills = action.data * 1
			return state	
		case "Изменить мастерство навыка Магия веры":

			state.praySkills = action.data * 1
			return state	
		case "Изменить мастерство навыка Паладин":

			state.palSkills = action.data * 1
			return state	
		case "Изменить мастерство навыка Монах":

			state.monkSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Магия чумы":

			state.defilerSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Ядомансер":

			state.posionSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Чумной доктор":

			state.plagueDoctorSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Путь ветра":

			state.windWaySkills = action.data * 1
			return state

		case "Изменить мастерство навыка Фехтовальщик":

			state.swordsmanSkills = action.data * 1
			return state

		case "Изменить мастерство навыка Снайпер":

			state.sniperSkill = action.data * 1
			return state

		case "Изменить мастерство навыка Застрельщик":

			state.shooterSkills = action.data * 1
			return state

		
		default:
			return state;
	}
}

// Получить количество очков, нужны для прокачки навыка
function get_n_points(p) {
	
	var p = p*1;
	var points = 0;
	
	// Определяем выбранное мастерство
	if (p === 0) {
		points = 0
	} else if (p === 1) {
		points = 3
	} else if (p === 2 || p === 3) {
		// FAQ describes Grandmaster effects but does not publish an extra point cost.
		points = 3 + 7
	}
	
	return points
}

function allSkillsNeedPoints(state = [], action) {


	var points = 0;
	// Определяем выбранное мастерство
	if (action.data === '0') {
		points = 0
	} else if (action.data === '1') {
		points = 3
	} else if (action.data === '2' || action.data === '3') {
		points = 3 + 7
	}

	//	console.log(points)

	switch (action.type) {
		
		case "Загрузить все данные игрока":
			console.log(action.data.allSkillsMaster.spearSkills)
			state.swordSkills = get_n_points(action.data.allSkillsMaster.swordSkills)
			state.axeSkills = get_n_points(action.data.allSkillsMaster.axeSkills)
			state.spearSkills = get_n_points(action.data.allSkillsMaster.spearSkills)
			state.bowSkills = get_n_points(action.data.allSkillsMaster.bowSkills)
			state.crossbowSkills = get_n_points(action.data.allSkillsMaster.crossbowSkills)
			state.batSkills = get_n_points(action.data.allSkillsMaster.batSkills)
			state.elementSkills = get_n_points(action.data.allSkillsMaster.elementSkills)
			state.mindSkills = get_n_points(action.data.allSkillsMaster.mindSkills)
			state.lightSkills = get_n_points(action.data.allSkillsMaster.lightSkills)
			state.darkSkills = get_n_points(action.data.allSkillsMaster.darkSkills)
			state.shieldSkills = get_n_points(action.data.allSkillsMaster.shieldSkills)
			state.dodgySkills = get_n_points(action.data.allSkillsMaster.dodgySkills)
			state.critSkills = get_n_points(action.data.allSkillsMaster.critSkills)
			state.critDamageSkills = get_n_points(action.data.allSkillsMaster.critDamageSkills || 0)
			state.thugSkills = get_n_points(action.data.allSkillsMaster.thugSkills)
			state.healthSkills = get_n_points(action.data.allSkillsMaster.healthSkills)
			state.fireskinSkills = get_n_points(action.data.allSkillsMaster.fireskinSkills)
			state.vampireSkills = get_n_points(action.data.allSkillsMaster.vampireSkills)
			state.accuracySkills = get_n_points(action.data.allSkillsMaster.accuracySkills)
			state.stoneskinSkills = get_n_points(action.data.allSkillsMaster.stoneskinSkills)
			state.regenerationSkills = get_n_points(action.data.allSkillsMaster.regenerationSkills)
			state.doubleSkills = get_n_points(action.data.allSkillsMaster.doubleSkills)
			state.meditationSkills = get_n_points(action.data.allSkillsMaster.meditationSkills)
			state.battlegraceSkills = get_n_points(action.data.allSkillsMaster.battlegraceSkills)
			state.fastrefSkills = get_n_points(action.data.allSkillsMaster.fastrefSkills || 0)
			state.afflictionSkills = get_n_points(action.data.allSkillsMaster.afflictionSkills)
			state.destroyerSkills = get_n_points(action.data.allSkillsMaster.destroyerSkills)
			state.summonerSkills = get_n_points(action.data.allSkillsMaster.summonerSkills)
			state.casterSkills = get_n_points(action.data.allSkillsMaster.casterSkills)
			state.resistauraSkills = get_n_points(action.data.allSkillsMaster.resistauraSkills)
			state.sustainabilitySkills = get_n_points(action.data.allSkillsMaster.sustainabilitySkills)
			state.carryingSkills = get_n_points(action.data.allSkillsMaster.carryingSkills)
			state.secretknowledgeSkills = get_n_points(action.data.allSkillsMaster.secretknowledgeSkills)
			state.alchactiveSkills = get_n_points(action.data.allSkillsMaster.alchactiveSkills)
			state.alchingibSkills = get_n_points(action.data.allSkillsMaster.alchingibSkills)
			state.alchstabilitySkills = get_n_points(action.data.allSkillsMaster.alchstabilitySkills)
			state.gloverSkills = get_n_points(action.data.allSkillsMaster.gloverSkills)
			state.duelistSkills = get_n_points(action.data.allSkillsMaster.duelistSkills)
			
			state.warSkills = get_n_points(action.data.allSkillsMaster.warSkills || 0)
			state.praySkills = get_n_points(action.data.allSkillsMaster.praySkills || 0)
			state.palSkills = get_n_points(action.data.allSkillsMaster.palSkills || 0)
			state.monkSkills = get_n_points(action.data.allSkillsMaster.monkSkills || 0)
			
			state.defilerSkills = get_n_points(action.data.allSkillsMaster.defilerSkills || 0)
			state.posionSkills = get_n_points(action.data.allSkillsMaster.posionSkills || 0)
			state.plagueDoctorSkills = get_n_points(action.data.allSkillsMaster.plagueDoctorSkills || 0)
			state.windWaySkills = get_n_points(action.data.allSkillsMaster.windWaySkills || 0)
			state.swordsmanSkills = get_n_points(action.data.allSkillsMaster.swordsmanSkills || 0)

			state.sniperSkill = get_n_points(action.data.allSkillsMaster.sniperSkill || 0)
			state.shooterSkills = get_n_points(action.data.allSkillsMaster.shooterSkills || 0)
			
			return {...state}
			
		case "Изменить мастерство навыка Владение мечами":

			state.swordSkills = points
			return state

		case "Изменить мастерство навыка Владение топорами":

			state.axeSkills = points
			return state
		case "Изменить мастерство навыка Владение копьями":

			state.spearSkills = points
			return state

		case "Изменить мастерство навыка Владение луками":

			state.bowSkills = points
			return state

		case "Изменить мастерство навыка Владение арбалетами":

			state.crossbowSkills = points
			return state

		case "Изменить мастерство навыка Владение дубинами":

			state.batSkills = points
			return state

		case "Изменить мастерство навыка Магия стихий":

			state.elementSkills = points
			return state

		case "Изменить мастерство навыка Магия разума":

			state.mindSkills = points
			return state

		case "Изменить мастерство навыка Магия света":

			state.lightSkills = points
			return state

		case "Изменить мастерство навыка Магия тьмы":

			state.darkSkills = points
			return state

		case "Изменить мастерство навыка Владение щитами":

			state.shieldSkills = points
			return state

		case "Изменить мастерство навыка Уворотливость":

			state.dodgySkills = points
			return state

		case "Изменить мастерство навыка Критический удар":

			state.critSkills = points
			return state

		
		case "Изменить мастерство навыка Тиран":

			state.critDamageSkills = points
			return state

		case "Изменить мастерство навыка Громила":

			state.thugSkills = points
			return state

		case "Изменить мастерство навыка Здоровяк":

			state.healthSkills = points
			return state

		case "Изменить мастерство навыка Огненная кожа":

			state.fireskinSkills = points
			return state

		case "Изменить мастерство навыка Вампиризм":

			state.vampireSkills = points
			return state

		case "Изменить мастерство навыка Точность":

			state.accuracySkills = points
			return state

		case "Изменить мастерство навыка Каменная кожа":

			state.stoneskinSkills = points
			return state

		case "Изменить мастерство навыка Регенерация":

			state.regenerationSkills = points
			return state

		case "Изменить мастерство навыка Двойное оружие":

			state.doubleSkills = points
			return state

		case "Изменить мастерство навыка Медитация":

			state.meditationSkills = points
			return state

		case "Изменить мастерство навыка Боевая грация":

			state.battlegraceSkills = points
			return state
		case "Изменить мастерство навыка Быстрые рефлексы":

			state.fastrefSkills = points
			return state

		case "Изменить мастерство навыка Сокрушение":

			state.afflictionSkills = points
			return state

		case "Изменить мастерство навыка Разрушитель":

			state.destroyerSkills = points
			return state

		case "Изменить мастерство навыка Призыватель":

			state.summonerSkills = points
			return state

		case "Изменить мастерство навыка Заклинатель":

			state.casterSkills = points
			return state

		case "Изменить мастерство навыка Аура сопротивления":

			state.resistauraSkills = points
			return state

		case "Изменить мастерство навыка Устойчивость":

			state.sustainabilitySkills = points
			return state

		case "Изменить мастерство навыка Грузоподъемность":

			state.carryingSkills = points
			return state

		case "Изменить мастерство навыка Тайные знания":

			state.secretknowledgeSkills = points
			return state

		case "Изменить мастерство навыка Алхимический активатор":

			state.alchactiveSkills = points
			return state

		case "Изменить мастерство навыка Алхимический ингибитор":

			state.alchingibSkills = points
			return state

		case "Изменить мастерство навыка Алхимический стабилизатор":

			state.alchstabilitySkills = points
			return state

		case "Изменить мастерство навыка Владение кловерами":

			state.gloverSkills = points
			return state

		case "Изменить мастерство навыка Дуэлянт":

			state.duelistSkills = points
			return state
			
		case "Изменить мастерство навыка Воитель":

			state.warSkills = points
			return state	
		case "Изменить мастерство навыка Магия веры":

			state.praySkills = points
			return state	
		case "Изменить мастерство навыка Паладин":

			state.palSkills = points
			return state	
		case "Изменить мастерство навыка Монах":

			state.monkSkills = points
			return state
		case "Изменить мастерство навыка Магия чумы":

			state.defilerSkills = points
			return state

		case "Изменить мастерство навыка Ядомансер":

			state.posionSkills = points
			return state

		case "Изменить мастерство навыка Чумной доктор":

			state.plagueDoctorSkills = points
			return state

		case "Изменить мастерство навыка Путь ветра":

			state.windWaySkills = points
			return state

		case "Изменить мастерство навыка Фехтовальщик":

			state.swordsmanSkills = points
			return state

		case "Изменить мастерство навыка Снайпер":

			state.sniperSkill = points
			return state

		case "Изменить мастерство навыка Застрельщик":

			state.shooterSkills = points
			return state

		default:
			return state;
	}
}



export default postReducer;



