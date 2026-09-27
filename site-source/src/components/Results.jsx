import React from 'react';

import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Avatar from '@material-ui/core/Avatar';

import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';


import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import { Grid } from '@material-ui/core';
import { findBreachRune } from '../data/breachRunes';
import { hasReligionBonuses, sanitizeReligionData } from '../data/religions';
import { golemSupportPercent } from '../data/golem';

export class Result extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			tolmin_power: 0,
			open: false,
			
		};
		
	}
	copyToClipboard(event) {
		
//		console.log(event)
		
		event.target.focus();
		event.target.select();

		document.execCommand('copy');

		this.setState({
			open: true
		});

	};

	handleClose(event) {
		this.setState({
			open: false
		})
	};

	componentDidMount() {
		if (this.props.onComputed && this.comparisonResult) {
			this.props.onComputed(this.comparisonResult);
		}
	}
	
	render() {

		
		// Тип оружия
		var typeOfWeapon = [];
		typeOfWeapon['Контактное'] = 1
		typeOfWeapon['Стрелковое'] = 0
		
	
		// Характеристики
		var power = this.props.powerChange;
		var body = this.props.bodyChange;
		var stamina = this.props.staminaChange;
		
		//console.log('Сила', power)
		
		var intell = this.props.intellChange;
		var will = this.props.willChange;
		var dex = this.props.dexChange;
		
		// Добавляем эффект от блага характеристик
		
		if (this.props.charBless !== 'Нет') {
			power += this.props.charBless*1
			body += this.props.charBless*1
			stamina += this.props.charBless*1
			intell += this.props.charBless*1
			will += this.props.charBless*1
			dex += this.props.charBless*1
		}
		var additionalDamage1 = 0;
		var additionalDamage2 = 0;
		
		
		var HP = 0;
		var MP = 0;
		
		var atack = 0;
		var defense = 0;
		
		var armor = 0;
		var pointsOfAction = 40;
		
		var armorPenetration = 0;
		var armorPenetrationShield = 0;
		
		var resists = 0;
		var parry = 0
		var reaction = 0;
		
		var regenerationHP = 0;
		var regenerationMP = 0;
		
		var criticalDamage = 0;
		var critKoeff = 1.5;
		
		
		
		// Вероятность блокировки щитом
		var shieldBlock = 0;
		
		// Вероятность отбить атаку оружием
		var weaponBlock = 0;
		
		// Пробой сопротивляемости цели
		//var penetrationOfResist = [0, 0];
		// Сила заклинаний
		var powerOfDark = 0;
		var powerOfLight = 0;
		var powerOfDestruction = 0;
		var powerOfDefiler = 0
		
		var powerOfPray = 0;
		// Сжигание стрел
		var arrowsInTheFire = 0;
		
		// Воспламененное оружие
		var fireWeapon = 0;
		
		var pointOnBite = 10+(this.props.level-1)*0.25;
		
		if (pointOnBite >= 20) {
			pointOnBite = 20
		}
		
		//console.log(pointOnBite)
		var stability = 0;
		
		// Уровень высшей формы
		var hRace = (this.props.level-50)
		
		// Массив с кольцами магистра
		var magistrRings = {
			'Темный': 0,
			'Светлый': 0,
			'Разрушитель': 0,
		}
		// Массив с кольцами Воина крови
		var bloodWarriorRings = {
			'Сила': 0,
			'Тело': 0,
			'Ловкость': 0,
		}
		
		// Комплектность
		var complects = {
			'Комплект Древних владык': 0,
			'Комплект Новых владык': 0,
			
			'Комплект Золотой зари': 0,
			
			'Комплект Белиара': 0,
			'Комплект Альматеи': 0,
			
			'Комплект Стальных небес': 0,
			'Комплект Сумеречной тени': 0,
			'Комплект Жертвенной крови': 0,
			'Комплект Несмолкающего шепота': 0,
			'Комплект Сияющего взгляда': 0,
			
			'Комплект Гир-о-сет': 0,
			
			'Комплект Магистра': 0,
			'Комплект Воина крови': 0,
			
			'Комплект Вечного пламени': 0,
			
			'Комплект Истинной магии': 0,
			'Комплект Полнолуния': 0,
			
			'Комплект Стража лесов': 0,
			'Комплект Стража зари': 0,
			'Комплект Стража Солнца': 0,
			
			'Комплект Жреца лесов': 0,
			'Комплект Жреца зари': 0,
			'Комплект Жреца Солнца': 0,
			
			'Комплект Чумного доктора': 0,
			'Комплект Трансмутации': 0,
		}
		
		// Поглощение урона
		var resistDamage = 0;
		
		// Поглощение временных эффектов
		var resistTempraryEffects = 0;
		
		
		//console.log(this.props.allSkills.shieldSkills)
		//console.log(this.props.allSkillsMaster.shieldSkills)
		
		// Коэффициент усиления щита
		var koeffOfShield = 1;
		
		
		// Навык Владение щитами (увеличение параметров и шанс отбить атаку)
		var shieldSkills = [0, 0]
		if (this.props.allSkillsMaster.shieldSkills === 0) {
			shieldSkills = [5, 0]
		} else if (this.props.allSkillsMaster.shieldSkills === 1) {
			shieldSkills = [6, 1]
		} else {
			shieldSkills = [9, 2]
		}
		var evasion = 0
		var magicEvasion = 0
		var counterattack = 0
		/*************************************************************
		
			Бонусы от вещей и абсолютных значений характеристик ON
			
		*************************************************************/
		
		
		// Экономия маны у заклинаний
		var darkSpellManaLowerCost = 0;
		var lightSpellManaLowerCost = 0;
		var destrSpellManaLowerCost = 0;
		var mindSpellManaLowerCost = 0;
		var defilerSpellManaLowerCost = 0;
		var praySpellManaLowerCost = 0;
		
		
		// Вероятность нанесения двойного удара
		var doubleChance = 0;
		
		// Веса занято предметами
		var weight_occupato = 0;
		
		// Урон магией (бонус от расы, но не мф)
		
		var magicDamage = 0;
		// Специальный расовый навык
		var specialSkillsRace = '';
		
		// Особенности ВФ
		var highFormSpecial = ''
		
		var all_runes = '';
		var all_rune_words = []
		var activeBreachRunes = []
		var breachTotals = {}
		var equipmentPhysicalVampirism = 0
		var equipmentMagicalVampirism = 0
		
		//Есть ли щит
		var shieldOn = false
		
		// Доп получаемый опыт
		var expirienceByLvl = this.props.level>70 ? this.props.level-70 : 0;
		// Добавляем вещи
		for (var name in this.props.thingOnPers) {
//			console.log(name)
			
			if (this.props.thingOnPers[name]) {
				
				all_runes += this.props.modifireThings[name].runes
				if (this.props.modifireThings[name].runeWord != '') {
					all_rune_words.push(this.props.modifireThings[name].runeWord)
				}
				const breachRune = findBreachRune(this.props.modifireThings[name].breachRune || '')
				if (breachRune && breachRune.id) {
					activeBreachRunes.push(breachRune)
					for (const [effect, value] of Object.entries(breachRune.effects || {})) {
						breachTotals[effect] = (breachTotals[effect] || 0) + value
					}
				}
				equipmentPhysicalVampirism += this.props.modifireThings[name].parametrs['вампиризм'] || 0
				equipmentMagicalVampirism += this.props.modifireThings[name].parametrs['магический вампиризм'] || 0

				if (this.props.thingOnPers[name].kindOfThing === 'Щиты') {
					
//					console.log('Есть щит')
					shieldBlock += 25
					shieldOn = true
					
					koeffOfShield = 1 + this.props.allSkills.shieldSkills*shieldSkills[0]/100
		
					shieldBlock += this.props.allSkills.shieldSkills*shieldSkills[1]
//					console.log(shieldBlock)
//					console.log(koeffOfShield)
				}
				
				power += (this.props.modifireThings[name].powerItem || 0)
				
				
				body += (this.props.modifireThings[name].bodyItem || 0)
				stamina += (this.props.modifireThings[name].staminaItem || 0)
				intell += (this.props.modifireThings[name].intellItem || 0)
				will += (this.props.modifireThings[name].willItem || 0)
				dex += (this.props.modifireThings[name].dexItem || 0)
				
				HP += (this.props.modifireThings[name].parametrs['здоровье']*koeffOfShield || 0)
				MP += (this.props.modifireThings[name].parametrs['мана']*koeffOfShield || 0)
				
				atack += (this.props.modifireThings[name].parametrs['атака']*koeffOfShield || 0)
				defense += (this.props.modifireThings[name].parametrs['защита']*koeffOfShield || 0)
				
				armor += (this.props.modifireThings[name].parametrs['броня']*koeffOfShield || 0)
				parry += (this.props.modifireThings[name].parametrs['парирование']*koeffOfShield || 0)
				reaction += (this.props.modifireThings[name].parametrs['реакция']*koeffOfShield || 0)
				
				armorPenetration += (this.props.modifireThings[name].parametrs['пробой брони']*koeffOfShield || 0)
				
				pointsOfAction += (this.props.modifireThings[name].parametrs['ОД макс.']*koeffOfShield || 0)
				
				resists += (this.props.modifireThings[name].parametrs['сопротивление']*koeffOfShield || 0)
				
				regenerationHP += (this.props.modifireThings[name].parametrs['восстановление здоровья']*koeffOfShield || 0)
				regenerationMP += (this.props.modifireThings[name].parametrs['восстановление маны']*koeffOfShield || 0)
				
				criticalDamage += (this.props.modifireThings[name].parametrs['крит. удар']*koeffOfShield || 0)
				critKoeff += (this.props.modifireThings[name].parametrs['крит. урон']*1 || 0)/100
				
				pointOnBite += (this.props.modifireThings[name].parametrs['ОД на действие'] || 0)
				stability += (this.props.modifireThings[name].parametrs['устойчивость']*koeffOfShield || 0)
				
				
				resistDamage += (this.props.modifireThings[name].parametrs['поглощение урона']*1 || 0)
				resistTempraryEffects += (this.props.modifireThings[name].parametrs['сопрот. врем. эффектам']*1 || 0)
				
				counterattack += (this.props.modifireThings[name].parametrs['контрудар']*1 || 0)
				magicEvasion += (this.props.modifireThings[name].parametrs['уклон. магии']*1 || 0)
				evasion += (this.props.modifireThings[name].parametrs['уклон.']*1 || 0)
				
//				console.log(this.props.modifireThings)
				weight_occupato += this.props.modifireThings[name].weight
				// Суммируем урон от всех вещей, кроме оружия
				if ((name !== 'Оружие Слева') && (name !== 'Оружие Справа')) {
					additionalDamage1 += (this.props.modifireThings[name].parametrs['урон'][0] || 0)
					additionalDamage2 += (this.props.modifireThings[name].parametrs['урон'][1] || 0)
				}
				
				


				// Магические штуки
				powerOfDark += (this.props.modifireThings[name].parametrs['призыватель']*100 || 0);
				powerOfLight += (this.props.modifireThings[name].parametrs['заклинатель']*100 || 0);
				powerOfDestruction += (this.props.modifireThings[name].parametrs['разрушитель']*100 || 0);
				powerOfDefiler += (this.props.modifireThings[name].parametrs['осквернитель']*100 || 0);
				// Считаем комплектность
				if (this.props.thingOnPers[name].complect in complects) {
					complects[this.props.thingOnPers[name].complect]++
				}
				
				// Кольца Магистра
				if (((name === 'Кольца Слева') || (name === 'Кольца Справа')) && (this.props.thingOnPers[name].complect === 'Комплект Магистра')) {
					// Определяем тип колец
//					console.log(this.props.thingOnPers[name].name)
					if (this.props.thingOnPers[name].name.split(' ')[2] === 'Стихия') {
						magistrRings['Разрушитель']++
					}
					if (this.props.thingOnPers[name].name.split(' ')[2] === 'Свет') {
						magistrRings['Светлый']++
					}
					if (this.props.thingOnPers[name].name.split(' ')[2] === 'Тьма') {
						magistrRings['Темный']++
					}
				}
				if (((name === 'Кольца Слева') || (name === 'Кольца Справа')) && (this.props.thingOnPers[name].complect === 'Комплект Воина крови')) {
					// Определяем тип колец

//					console.log(this.props.thingOnPers[name].name)
					if (this.props.thingOnPers[name].name.split(' ')[3] === 'Сила') {
						bloodWarriorRings['Сила']++
					}
					if (this.props.thingOnPers[name].name.split(' ')[3] === 'Тело') {
						bloodWarriorRings['Тело']++
					}
					if (this.props.thingOnPers[name].name.split(' ')[3] === 'Ловкость') {
						bloodWarriorRings['Ловкость']++
					}
				}

				// Воин крови
			}

		}
		
		evasion += breachTotals.evasion || 0
		magicEvasion += breachTotals.magicEvasion || 0
		
		var runes_list_ = {}

		all_runes = all_runes.split('')
		for (var r__ of all_runes) {

			if (!runes_list_[r__]) {
				runes_list_[r__] = 1
			} else {
				runes_list_[r__] += 1
			}
		}
		
		
		var rune_words_list_ = {}

		for (var r__ of all_rune_words) {

			if (!rune_words_list_[r__]) {
				rune_words_list_[r__] = 1
			} else {
				rune_words_list_[r__] += 1
			}
		}
		
//		console.log(complects)
//		console.log('HP', HP)
//		console.log('regenerationHP', regenerationHP)
		
		
		// Разбираем магистра
		if (complects['Комплект Магистра'] > 0) {
			//			console.log('Работаем')
			//			console.log(magistrRings)

			// Расставляем коэффициенты
			if (magistrRings['Темный'] === 2) {

				magistrRings['Темный'] = 1

			} else if (magistrRings['Светлый'] === 2) {

				magistrRings['Светлый'] = 1

			} else if (magistrRings['Разрушитель'] === 2) {

				magistrRings['Разрушитель'] = 1

			} else if ((magistrRings['Разрушитель'] === 1) && (magistrRings['Светлый'] === 1)) {

				magistrRings['Разрушитель'] = 0.5
				magistrRings['Светлый'] = 0.5

			} else if ((magistrRings['Разрушитель'] === 1) && (magistrRings['Темный'] === 1)) {

				magistrRings['Разрушитель'] = 0.5
				magistrRings['Темный'] = 0.5

			} else if ((magistrRings['Светлый'] === 1) && (magistrRings['Темный'] === 1)) {

				magistrRings['Светлый'] = 0.5
				magistrRings['Темный'] = 0.5
			} else if ((bloodWarriorRings['Светлый'] === 1) && (bloodWarriorRings['Темный'] === 0) && (bloodWarriorRings['Разрушитель'] === 0)) {
				bloodWarriorRings['Светлый'] = 0.5
			}  else if ((bloodWarriorRings['Светлый'] === 0) && (bloodWarriorRings['Темный'] === 1) && (bloodWarriorRings['Разрушитель'] === 0)) {
				bloodWarriorRings['Темный'] = 0.5
			}  else if ((bloodWarriorRings['Светлый'] === 0) && (bloodWarriorRings['Темный'] === 0) && (bloodWarriorRings['Разрушитель'] === 1)) {
				bloodWarriorRings['Разрушитель'] = 0.5
			} else {
				magistrRings['Светлый'] = 0
				magistrRings['Темный'] = 0
				magistrRings['Разрушитель'] = 0
			}


			console.log(magistrRings)
		}
		if (complects['Комплект Воина крови'] > 0) {
			//			console.log('Работаем')
			//			console.log(magistrRings)
//			console.log(bloodWarriorRings)

			// Расставляем коэффициенты
			if (bloodWarriorRings['Сила'] === 2) {

				bloodWarriorRings['Сила'] = 1

			} else if (bloodWarriorRings['Тело'] === 2) {

				bloodWarriorRings['Тело'] = 1

			} else if (bloodWarriorRings['Ловкость'] === 2) {

				bloodWarriorRings['Ловкость'] = 1

			} else if ((bloodWarriorRings['Ловкость'] === 1) && (bloodWarriorRings['Тело'] === 1)) {

				bloodWarriorRings['Ловкость'] = 0.5
				bloodWarriorRings['Тело'] = 0.5

			} else if ((bloodWarriorRings['Ловкость'] === 1) && (bloodWarriorRings['Сила'] === 1)) {

				bloodWarriorRings['Ловкость'] = 0.5
				bloodWarriorRings['Сила'] = 0.5

			} else if ((bloodWarriorRings['Тело'] === 1) && (bloodWarriorRings['Сила'] === 1)) {

				bloodWarriorRings['Тело'] = 0.5
				bloodWarriorRings['Сила'] = 0.5
			} else if ((bloodWarriorRings['Тело'] === 1) && (bloodWarriorRings['Ловкость'] === 0) && (bloodWarriorRings['Сила'] === 0)) {
				bloodWarriorRings['Тело'] = 0.5
			} else if ((bloodWarriorRings['Тело'] === 0) && (bloodWarriorRings['Ловкость'] === 1) && (bloodWarriorRings['Сила'] === 0)) {
				bloodWarriorRings['Ловкость'] = 0.5
			} else if ((bloodWarriorRings['Тело'] === 0) && (bloodWarriorRings['Ловкость'] === 0) && (bloodWarriorRings['Сила'] === 1)) {
				bloodWarriorRings['Сила'] = 0.5
			} else {
				bloodWarriorRings['Тело'] = 0
				bloodWarriorRings['Сила'] = 0
				bloodWarriorRings['Ловкость'] = 0
			}


						
		}
		//console.log(bloodWarriorRings)
		// Сила Магий от воли
		powerOfDark += will*0.3
		powerOfLight += will*0.3
		powerOfDestruction += will*0.3
		powerOfDefiler += will*0.3
		
		powerOfPray += will*0.15
		
		var blood_lose = 30;
		
		
		//Снижение ОД на действие у призываемых существ
		var summons_ap_perc = breachTotals.summonsApPercent || 0
		
		// Уклонение от ловкости складывается с экипировкой и рунами.

		if (dex >= 100) {
			evasion += Math.floor(dex/50) - 1
		}
		 
		
		
		HP += body*13 + this.props.level*10;
		MP += intell*6 + will*2 + this.props.level*3;
		
		atack += dex*3;
		defense += dex*3;
		
		armor += stamina*1;
		resists += stamina * 1 + will * 1;
		
		regenerationHP += Math.round(body*1 + stamina*1);
		regenerationMP += Math.round(will*0.5 + intell*1);
		
		var weight = 0;
		weight += 200 + 20*this.props.level + power*37+body*58+stamina*47;
		
		var rageSpeed = breachTotals.rageGain || 0;
		/*************************************************************
		
			Бонусы от вещей и абсолютных значений характеристик OFF
			
		*************************************************************/
		
		
		/*************************************************************
		
			Бонусы от пограничных значений характеристик ON
			
		*************************************************************/
		
		var powerBonus = 1
		if (power >= 50) {
			powerBonus = 1.1
		}
		if (power >= 100) {
			powerBonus = 1.2
		}
		if (power >= 150) {
			powerBonus = 1.3
		}
		if (power >= 200) {
			powerBonus = 1.40
		}
		if (power >= 250) {
			powerBonus = 1.50
		}
		if (power >= 300) {
			powerBonus = 1.60
		}
		if (power >= 350) {
			powerBonus = 1.70
		}
		if (power >= 400) {
			powerBonus = 1.80
		}
		if (power >= 450) {
			powerBonus = 1.90
		}
		if (power >= 500) {
			powerBonus = 2
		}
		
		var willBonus = [1, 1]
		if (will >= 50) {
			willBonus = [1.05, 1.05]
		}
		if (will >= 100) {
			willBonus = [1.1, 1.1]
		}
		if (will >= 150) {
			willBonus = [1.15, 1.15]
		}
		if (will >= 200) {
			willBonus = [1.2, 1.2]
		}
		if (will >= 250) {
			willBonus = [1.25, 1.25]
		}
		if (will >= 300) {
			willBonus = [1.3, 1.3]
		}
		if (will >= 350) {
			willBonus = [1.35, 1.35]
		}
		if (will >= 400) {
			willBonus = [1.4, 1.4]
		}
		if (will >= 450) {
			willBonus = [1.45, 1.45]
		}
		if (will >= 500) {
			willBonus = [1.5, 1.5]
		}
		
		MP = MP * willBonus[0];
		resists = resists * willBonus[1]
		
		var dexBonus = [1, 1, 0]
		if (dex >= 50) {
			dexBonus = [1.04, 1.04, 0]
		}
		if (dex >= 100) {
			dexBonus = [1.09, 1.09, 1]
		}
		if (dex >= 150) {
			dexBonus = [1.16, 1.16, 2]
		}
		if (dex >= 200) {
			dexBonus = [1.24, 1.24, 3]
		}
		if (dex >= 250) {
			dexBonus = [1.33, 1.33, 4]
		}
		if (dex >= 300) {
			dexBonus = [1.42, 1.42, 5]
		}		
		if (dex >= 350) {
			dexBonus = [1.51, 1.51, 6]
		}		
		if (dex >= 400) {
			dexBonus = [1.6, 1.6, 7]
		}		
		if (dex >= 450) {
			dexBonus = [1.69, 1.69, 8]
		}		
		if (dex >= 500) {
			dexBonus = [1.78, 1.78, 9]
		}		
		atack = atack * dexBonus[0]
		defense = defense * dexBonus[1]
		
//		console.log('Уклонение после ловкости', evasion)
		
		var staminaBonus = [1, 1]
		if (stamina >= 50) {
			staminaBonus = [1.05, 1.05]
		}
		if (stamina >= 100) {
			staminaBonus = [1.15, 1.15]
		}
		if (stamina >= 150) {
			staminaBonus = [1.3, 1.3]
		}
		if (stamina >= 200) {
			staminaBonus = [1.5, 1.5]
		}
		if (stamina >= 250) {
			staminaBonus = [1.7, 1.7]
		}
		if (stamina >= 300) {
			staminaBonus = [1.9, 1.9]
		}
		if (stamina >= 350) {
			staminaBonus = [2.1, 2.1]
		}
		if (stamina >= 400) {
			staminaBonus = [2.3, 2.3]
		}
		if (stamina >= 450) {
			staminaBonus = [2.5, 2.5]
		}
		if (stamina >= 500) {
			staminaBonus = [2.7, 2.7]
		}
		resists = resists * staminaBonus[1]
		armor = armor * staminaBonus[0]
		
		var bodyBonus = [1, 1]
		if (body >= 50) {
			bodyBonus = [1.1, 1]
		}
		if (body >= 100) {
			bodyBonus = [1.2, 1.1]
		}
		if (body >= 150) {
			bodyBonus = [1.4, 1.2]
		}
		if (body >= 200) {
			bodyBonus = [1.6, 1.3]
		}
		if (body >= 250) {
			bodyBonus = [1.8, 1.5]
		}
		if (body >= 300) {
			bodyBonus = [2.0, 1.7]
		}
		if (body >= 350) {
			bodyBonus = [2.2, 1.9]
		}
		if (body >= 400) {
			bodyBonus = [2.4, 2.1]
		}
		if (body >= 450) {
			bodyBonus = [2.6, 2.3]
		}
		if (body >= 500) {
			bodyBonus = [2.8, 2.5]
		}
		
		HP = HP * bodyBonus[0]
		regenerationHP = regenerationHP * bodyBonus[1]
		
		var intellBonus = [1, 1]
		if (intell >= 50) {
			intellBonus = [1.05, 1]
		}
		if (intell >= 100) {
			intellBonus = [1.05, 1.05]
		}
		if (intell >= 150) {
			intellBonus = [1.15, 1.05]
		}
		if (intell >= 200) {
			intellBonus = [1.15, 1.15]
		}
		if (intell >= 250) {
			intellBonus = [1.3, 1.15]
		}
		if (intell >= 300) {
			intellBonus = [1.3, 1.3]
		}
		if (intell >= 350) {
			intellBonus = [1.5, 1.3]
		}
		if (intell >= 400) {
			intellBonus = [1.5, 1.5]
		}
		if (intell >= 450) {
			intellBonus = [1.7, 1.5]
		}
		if (intell >= 500) {
			intellBonus = [1.7, 1.7]
		}
		
		// Бонусы характеристик
		MP = MP * intellBonus[0]
		regenerationMP = regenerationMP * intellBonus[1]
		
		
		
		/*************************************************************
		
			Бонусы от пограничных значений характеристик OFF
			
		*************************************************************/
		
		/**********************************************************
		
			Считаем урон от предметов, оружий и навыков
		
		*************************************************************/
		
		
		
		
		// Урон

		const minDamageWeapon1 = this.props.modifireThings['Оружие Справа'].parametrs['урон'][0]
		const maxDamageWeapon1 = this.props.modifireThings['Оружие Справа'].parametrs['урон'][1]
		
		const minDamageWeapon2 = this.props.modifireThings['Оружие Слева'].parametrs['урон'][0]
		const maxDamageWeapon2 = this.props.modifireThings['Оружие Слева'].parametrs['урон'][1]

		
		var kindOfWeaponInRightHand = this.props.thingOnPers['Оружие Справа'].name === 'Нет' ? 'Нет' : this.props.thingOnPers['Оружие Справа'].kindOfThing;
		var kindOfWeaponInLeftHand = this.props.thingOnPers['Оружие Слева'].name === 'Нет' ? 'Нет' : this.props.thingOnPers['Оружие Слева'].kindOfThing;
		
		const contactsWeaponArr = ['Мечи', 'Топоры', 'Копья', 'Дубины', 'Кловеры', 'Посохи']
		const distanceWeaponArr = ['Луки', 'Арбалеты']
		const defenceWeaponArr = ['Щиты']
		
		var weaponInRightHand = 'Нет';
		if (contactsWeaponArr.includes(kindOfWeaponInRightHand)) {
			weaponInRightHand = 'Контактное оружие'
		} else if (distanceWeaponArr.includes(kindOfWeaponInRightHand)) {
			weaponInRightHand = 'Стрелковое оружие'
		}
		
		
//		console.log(weaponInRightHand, weaponInRightHand)
		var minDamageH1 = 0;
		var maxDamageH1 = 0;
//		console.log('Сила', power)
		// Контактное оружие
		if (weaponInRightHand === 'Контактное оружие') {
			minDamageH1 = Math.round(Math.pow((power * 0.045 + body * 0.023) * Math.pow(minDamageWeapon1 + 5, 0.93), 0.97));
			maxDamageH1 = Math.round(Math.pow((power * 0.045 + body * 0.023) * Math.pow(maxDamageWeapon1 + 5, 0.93), 0.97));
		}
		

		// Стрелковое оружие
		else if (weaponInRightHand === 'Стрелковое оружие') {
			minDamageH1 = Math.round(Math.pow((power * 0.034 + dex * 0.017) * Math.pow(minDamageWeapon1 + 5, 0.92), 0.97));
			maxDamageH1 = Math.round(Math.pow((power * 0.034 + dex * 0.017) * Math.pow(maxDamageWeapon1 + 5, 0.92), 0.97));
		}
		var weaponInLeftHand = 'Нет';
		if (contactsWeaponArr.includes(kindOfWeaponInLeftHand)) {
			weaponInLeftHand = 'Контактное оружие'
		} else if (distanceWeaponArr.includes(kindOfWeaponInLeftHand)) {
			weaponInLeftHand = 'Стрелковое оружие'
		} else if (defenceWeaponArr.includes(kindOfWeaponInLeftHand)) {
			weaponInLeftHand = 'Щит'
		}

		// Первоначально у копья хват обычный
		var spear2handsGrip = false
		
		// Двуручный хват оружия (одного)
		var weapon2handsGrip = false
		// Проверка для двуручного хвата копья		
		// Хват копья
		if ((kindOfWeaponInRightHand === 'Копья') && (weaponInLeftHand === 'Нет')) {
//			console.log('Копье единичное')
			spear2handsGrip = true
		}
		
		var gloves_ = false
		if ((kindOfWeaponInRightHand === 'Кловеры')) {
//			console.log('Кловеры')
			gloves_ = true
		}
		
		// Проверка двуручного хвата оружия
		if ((weaponInRightHand === 'Контактное оружие') && (weaponInLeftHand === 'Нет') && (kindOfWeaponInRightHand !== 'Копья') && (kindOfWeaponInRightHand !== 'Посохи') && (kindOfWeaponInRightHand !== 'Кловеры')) {
//			console.log('Двуручный хват одноручки')
			weapon2handsGrip = true
		}
//		// Увеличиваем урон за счет экспертного владения
		// Сначала определяем само мастерство навыка 
		// Навыки владения оружием
		var masteryOfWeapon = {
			'Нет': [0, 0, 0],
			'Мечи': [0, 0, 0],
			'Топоры': [0, 0, 0],
			'Копья': [0, 0, 0],
			'Дубины': [0, 0, 0],
			'Кловеры': [0, 0, 0],
			'Посохи': [0, 0, 0],
			'Луки': [0, 0, 0],
			'Арбалеты': [0, 0, 0],
			'Щиты': [0, 0, 0],
		}
		
		// Выраженность навыка
		var powerOfSkills = {
			'Нет': 0,
			'Мечи': this.props.allSkills.swordSkills,
			'Топоры': this.props.allSkills.axeSkills,
			'Копья': this.props.allSkills.spearSkills,
			'Дубины': this.props.allSkills.batSkills,
			'Кловеры': this.props.allSkills.gloverSkills,
			'Посохи': 0,
			'Луки': this.props.allSkills.bowSkills,
			'Арбалеты': this.props.allSkills.crossbowSkills,
			'Щиты': this.props.allSkills.shieldSkills,

		} 
		
		
		
		// Владение мечами Процент и ПРибавка
		if (this.props.allSkillsMaster.swordSkills === 0) {
			masteryOfWeapon['Мечи'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.swordSkills === 1) {
			masteryOfWeapon['Мечи'] = [3, 0, 0]
		} else {
			masteryOfWeapon['Мечи'] = [4, 15, 10]
		}
		// Владение Топорами
		if (this.props.allSkillsMaster.axeSkills === 0) {
			masteryOfWeapon['Топоры'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.axeSkills === 1) {
			masteryOfWeapon['Топоры'] = [3, 0, 0]
		} else {
			masteryOfWeapon['Топоры'] = [4, 15, 10]
		}
		// Владение Копьями
		if (this.props.allSkillsMaster.spearSkills === 0) {
			masteryOfWeapon['Копья'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.spearSkills === 1) {
			masteryOfWeapon['Копья'] = [3, 0, 0]
		} else {
			masteryOfWeapon['Копья'] = [4, 20, 0]
		}
		// Владение Луками
		if (this.props.allSkillsMaster.bowSkills === 0) {
			masteryOfWeapon['Луки'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.bowSkills === 1) {
			masteryOfWeapon['Луки'] = [3, 0, 0]
		} else {
			masteryOfWeapon['Луки'] = [4, 15, 0]
		}
		// Владение Арбалетами
		if (this.props.allSkillsMaster.crossbowSkills === 0) {
			masteryOfWeapon['Арбалеты'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.crossbowSkills === 1) {
			masteryOfWeapon['Арбалеты'] = [3, 0, 0]
		} else {
			masteryOfWeapon['Арбалеты'] = [4, 15, 0]
		}
		// Владение Дубинами
		if (this.props.allSkillsMaster.batSkills === 0) {
			masteryOfWeapon['Дубины'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.batSkills === 1) {
			masteryOfWeapon['Дубины'] = [3, 0, 0]
		} else {
			masteryOfWeapon['Дубины'] = [4, 15, 10]
		}
		// Владение Щитами
		if (this.props.allSkillsMaster.shieldSkills === 0) {
			masteryOfWeapon['Щиты'] = [0, 0, 0]
		} else if (this.props.allSkillsMaster.shieldSkills === 1) {
			masteryOfWeapon['Щиты'] = [0, 0, 0]
		} else {
			masteryOfWeapon['Щиты'] = [0, 0, 0]
		}
		// Владение Кловерами
		if (this.props.allSkillsMaster.gloverSkills === 0) {
			masteryOfWeapon['Кловеры'] = [2, 0, 0]
		} else if (this.props.allSkillsMaster.gloverSkills === 1) {
			masteryOfWeapon['Кловеры'] = [3, 0, 20]
		} else {
			masteryOfWeapon['Кловеры'] = [4, 20, 50]
		}
		
		var alchemy_self = masteryOfWeapon['Кловеры'][2]


		
		
		// Вначале просто мастерство
		minDamageH1 += Math.round(minDamageH1 / 100 * (masteryOfWeapon[kindOfWeaponInRightHand][0]) * powerOfSkills[kindOfWeaponInRightHand]);
		maxDamageH1 += Math.round(maxDamageH1 / 100 * (masteryOfWeapon[kindOfWeaponInRightHand][0]) * powerOfSkills[kindOfWeaponInRightHand]);
		

		minDamageH1 += masteryOfWeapon[kindOfWeaponInRightHand][1]*powerOfSkills[kindOfWeaponInRightHand];
		maxDamageH1 += masteryOfWeapon[kindOfWeaponInRightHand][1]*powerOfSkills[kindOfWeaponInRightHand];
		

		// Вторая рука
		// Навык Двойное оружие
		
		
		var doubleCheck = false
		
		// Пеналити двойного оружия
		var twoHandsPenalty = 0.3;
		// Сначала вообще смотрим, двойное ли у нас оружие
		if ((weaponInRightHand === 'Контактное оружие') && (weaponInLeftHand === 'Контактное оружие')) {
			doubleChance += 0

			doubleCheck = true
		}
//		doubleSkills
		
		// Навык двойное оружие
		var doubleWeaponSkills = [0, 0]
		if (this.props.allSkillsMaster.doubleSkills === 0) {
			doubleWeaponSkills = [0.05, 0]
		} else if (this.props.allSkillsMaster.doubleSkills === 1) {
			doubleWeaponSkills = [0.06, 1]
		} else {
			doubleWeaponSkills = [0.09, 2]
		}
		
		if (doubleCheck) {
			// Добавляем шанс двойного удара
			doubleChance += doubleWeaponSkills[1]*this.props.allSkills.doubleSkills
		}
		
		

		// СНижаем штраф оружия в левой руке
		twoHandsPenalty += doubleWeaponSkills[0]*this.props.allSkills.doubleSkills

		// УРон от левой руки
		var minDamageH2 = 0
		var maxDamageH2 = 0
		
		// Контактное оружие
		// Только если контактное оружие
		if (weaponInLeftHand === 'Контактное оружие') {
			minDamageH2 = Math.round(Math.pow((power * 0.02 + body * 0.01) * Math.pow(minDamageWeapon2 + 5, 0.92), 0.97) * twoHandsPenalty);
			maxDamageH2 = Math.round(Math.pow((power * 0.02 + body * 0.01) * Math.pow(maxDamageWeapon2 + 5, 0.92), 0.97) * twoHandsPenalty);
			
			// Вначале просто мастерство
			minDamageH2 += Math.round(minDamageH2 / 100 * (masteryOfWeapon[kindOfWeaponInLeftHand][0]) * powerOfSkills[kindOfWeaponInLeftHand]);
			maxDamageH2 += Math.round(maxDamageH2 / 100 * (masteryOfWeapon[kindOfWeaponInLeftHand][0]) * powerOfSkills[kindOfWeaponInLeftHand]);

			// Потом выраженное мастерство (абсолютные значения то есть)
			minDamageH2 += (masteryOfWeapon[kindOfWeaponInLeftHand][2])*powerOfSkills[kindOfWeaponInLeftHand];
			maxDamageH2 += (masteryOfWeapon[kindOfWeaponInLeftHand][2])*powerOfSkills[kindOfWeaponInLeftHand];
			
		} else {
			// Иначе просто добавим урон от второго оружия (скорее всего там щит)
			minDamageH2 += minDamageWeapon2
			maxDamageH2 += maxDamageWeapon2
		}
		
		
		// Складываем урон от двух оружий  
		var minDamage = minDamageH1 + (minDamageH2 || 0)
		var maxDamage = maxDamageH1 + (maxDamageH2 || 0)
		
		// Дополнительные бонусы от двуручного хвата одноручного оружия



		if(weapon2handsGrip) {
			// Урон и атака +30%
			minDamage += Math.round(minDamage * 0.30);
			maxDamage += Math.round(maxDamage * 0.30);
			
			atack += Math.round(atack*0.3)
			
		}
		
		if (spear2handsGrip) {
			// Урон и атака +40%
			minDamage += Math.round(minDamage * 0.40);
			maxDamage += Math.round(maxDamage * 0.40);
			
			atack += Math.round(atack*0.4)
		}
		
		// Снижение ОД на действие от одного одноручног оружия
		if (weapon2handsGrip) {
			pointOnBite = pointOnBite*0.9
		}
		// Урон остальных надетых вещей участвует в бонусе пороговых значений силы.
		// Сверено с экипировкой DestinyS: 65–126 урона от вещей и 70% бонус
		// силы дают дополнительные 58–113 после навыка «Громила» (+28%).
		minDamage += additionalDamage1
		maxDamage += additionalDamage2

		minDamage += (powerBonus-1)*minDamage
		maxDamage += (powerBonus-1)*maxDamage

		/*************************************************************
		
			Бонусы от Навыков ON
			
		*************************************************************/
		
		// Навык Уворотливость
		var dodgySkills = [10, 2, 0]
		if (this.props.allSkillsMaster.dodgySkills === 0) {
			dodgySkills = [10, 2, 0]
		} else if (this.props.allSkillsMaster.dodgySkills === 1) {
			dodgySkills = [15, 3, 2]
		} else {
			dodgySkills = [25, 4, 3]
		}
		
		defense += dodgySkills[0] * this.props.allSkills.dodgySkills
		defense = Math.round(defense * (1 + dodgySkills[1] * this.props.allSkills.dodgySkills / 100))
		
		magicEvasion += dodgySkills[2] * this.props.allSkills.dodgySkills
		
		// Навык Палач (Критический удар)
		var critSkills = [10, 1, 1, 0]
		if (this.props.allSkillsMaster.critSkills === 0) {
			critSkills = [10, 1, 1, 0]
		} else if (this.props.allSkillsMaster.critSkills === 1) {
			critSkills = [10, 2, 1, 1]
		} else {
			critSkills = [10, 2, 2, 2]
		}

		criticalDamage += critSkills[0] * this.props.allSkills.critSkills
		criticalDamage = Math.round(criticalDamage * (1 + critSkills[1] * this.props.allSkills.critSkills / 100))
		
		critKoeff += critSkills[2] * this.props.allSkills.critSkills/100
		blood_lose += critSkills[3] * this.props.allSkills.critSkills
		
		// Навык Тиран (Критический урон)
		var critDamageSkills = [2, 1, 1, 0]
		if (this.props.allSkillsMaster.critDamageSkills === 0) {
			critDamageSkills = [2, 1, 1, 0]
		} else if (this.props.allSkillsMaster.critDamageSkills === 1) {
			critDamageSkills = [3, 1, 1, 1]
		} else {
			critDamageSkills = [5, 1, 2, 2]
		}

		critKoeff += critDamageSkills[0] * this.props.allSkills.critDamageSkills/100
		
//		 Навык Громила
		var thugSkills = [0, 0]
		if (this.props.allSkillsMaster.thugSkills === 0) {
			thugSkills = [10, 1]
		} else if (this.props.allSkillsMaster.thugSkills === 1) {
			thugSkills = [15, 1]
		} else {
			thugSkills = [25, 2]
		}
		
		function thugAdder(x) {
			if (kindOfWeaponInRightHand !== 'Луки') {
				minDamage += thugSkills[0]*x
				maxDamage += thugSkills[0]*x

				minDamage = Math.round(minDamage*(1+thugSkills[1]*x/100))
				maxDamage = Math.round(maxDamage*(1+thugSkills[1]*x/100))
			}
			
		}
		thugAdder(this.props.allSkills.thugSkills)
		
		// Магия Стихий
		var elementSkills = [0, 0, 0]
		if (this.props.allSkillsMaster.elementSkills === 0) {
			elementSkills = [2, 0, 0]
		} else if (this.props.allSkillsMaster.elementSkills === 1) {
			elementSkills = [2, 10, 20]
		} else {
			elementSkills = [2, 20, 40]
		}

		powerOfDestruction += this.props.allSkills.elementSkills*elementSkills[0] + elementSkills[1]
		
		
		// Магия разума
		var mindSkills = [0, 0]
		if (this.props.allSkillsMaster.mindSkills === 0) {
			mindSkills = [2, 0]
		} else if (this.props.allSkillsMaster.mindSkills === 1) {
			mindSkills = [2, 10]
		} else {
			mindSkills = [2, 20]
		}
		
		powerOfLight += this.props.allSkills.mindSkills*mindSkills[0] + mindSkills[1]
		
		// Магия света
		var lightSkills = [0, 0]
		if (this.props.allSkillsMaster.lightSkills === 0) {
			lightSkills = [2, 0]
		} else if (this.props.allSkillsMaster.lightSkills === 1) {
			lightSkills = [2, 10]
		} else {
			lightSkills = [2, 20]
		}
		
		powerOfLight += this.props.allSkills.lightSkills*lightSkills[0] + lightSkills[1]
		
		// Магия тьмы
		var darkSkills = [0, 0, 0]
		if (this.props.allSkillsMaster.darkSkills === 0) {
			darkSkills = [2, 0, 0]
		} else if (this.props.allSkillsMaster.darkSkills === 1) {
			darkSkills = [2, 10, 10]
		} else {
			darkSkills = [2, 20, 15]
		}
		
		summons_ap_perc += darkSkills[2]
		powerOfDark += this.props.allSkills.darkSkills*darkSkills[0] + darkSkills[1]
		
		// Навык Здоровяк
		
		var healthSkills = [30, 2]
		if (this.props.allSkillsMaster.healthSkills === 0) {
			healthSkills = [30, 2]
		} else if (this.props.allSkillsMaster.healthSkills === 1) {
			healthSkills = [50, 3]
		} else {
			healthSkills = [150, 4]
		}
		HP += healthSkills[0] * this.props.allSkills.healthSkills
		HP = Math.round(HP * (1 + healthSkills[1] * this.props.allSkills.healthSkills / 100))
		
		// Навык Точность
		var accuracySkills = [15, 2]
		if (this.props.allSkillsMaster.accuracySkills === 0) {
			accuracySkills = [15, 2]
		} else if (this.props.allSkillsMaster.accuracySkills === 1) {
			accuracySkills = [25, 3]
		} else {
			accuracySkills = [50, 4]
		}
		atack += accuracySkills[0] * this.props.allSkills.accuracySkills
		atack = Math.round(atack * (1 + accuracySkills[1] * this.props.allSkills.accuracySkills / 100))
		
		// Навык Каменная кожа (броня)
		var stoneskinSkills = [5, 2]
		if (this.props.allSkillsMaster.stoneskinSkills === 0) {
			stoneskinSkills = [5, 2]
		} else if (this.props.allSkillsMaster.stoneskinSkills === 1) {
			stoneskinSkills = [10, 2]
		} else {
			stoneskinSkills = [15, 3]
		}
		
		armor += stoneskinSkills[0] * this.props.allSkills.stoneskinSkills
		armor = Math.round(armor * (1 + stoneskinSkills[1] * this.props.allSkills.stoneskinSkills / 100))
		
		// Навык Регенерация
		var regenerationSkills = [0, 0, 0, 0]
		if (this.props.allSkillsMaster.regenerationSkills === 0) {
			regenerationSkills = [20, 2, 0, 0]
		} else if (this.props.allSkillsMaster.regenerationSkills === 1) {
			regenerationSkills = [30, 3, 1, 0]
		} else {
			regenerationSkills = [40, 4, 2, 1]
		}
		
		var want_life = regenerationSkills[2]
		var light_defence = regenerationSkills[3]
		
		regenerationHP += regenerationSkills[0] * this.props.allSkills.regenerationSkills
		regenerationHP = Math.round(regenerationHP * (1 + regenerationSkills[1] * this.props.allSkills.regenerationSkills / 100))
		
		// Навык Регенерация маны (Медитация)
		var meditationSkills = [4, 1]
		if (this.props.allSkillsMaster.meditationSkills === 0) {
			meditationSkills = [4, 1]
		} else if (this.props.allSkillsMaster.meditationSkills === 1) {
			meditationSkills = [10, 1]
		} else {
			meditationSkills = [20, 3]
		}
		
		if (this.props.allSkills.meditationSkills > 0) {
			regenerationMP += meditationSkills[0] * this.props.allSkills.meditationSkills
			regenerationMP = Math.round(regenerationMP * (1 + meditationSkills[1] * this.props.allSkills.meditationSkills / 100))
		}
				
		// Боевая грация (дает од от промахов)
		var battlegraceSkills = [5, 1]
		if (this.props.allSkillsMaster.battlegraceSkills === 0) {
			battlegraceSkills = [5, 1]
		} else if (this.props.allSkillsMaster.battlegraceSkills === 1) {
			battlegraceSkills = [6, 1]
		} else {
			battlegraceSkills = [10, 2]
		}
		// Возврат ОД в %
		var returnODMiss = 0 + this.props.allSkills.battlegraceSkills * battlegraceSkills[0]

		// МАКС од возврат
		var returnODMax = 0 + this.props.allSkills.battlegraceSkills * battlegraceSkills[1]

		// Навык Быстрые рефлексы (парирование и реака)
		var fastrefSkills = [2, 1, 50, 1, 1]
		if (this.props.allSkillsMaster.fastrefSkills === 0) {
			fastrefSkills = [2, 1, 50, 1, 1]
		} else if (this.props.allSkillsMaster.fastrefSkills === 1) {
			fastrefSkills = [4, 2, 60, 2, 1]
		} else {
			fastrefSkills = [6, 3, 70, 3, 2]
		}
		
		// Парир вроде бы совпадает, но это не точно, конечно
		parry += fastrefSkills[0] * this.props.allSkills.fastrefSkills
		parry = Math.round(parry * (1 + fastrefSkills[1] * this.props.allSkills.fastrefSkills / 100))

		// Реакция
		reaction += fastrefSkills[3] * this.props.allSkills.fastrefSkills
		reaction = Math.round(reaction * (1 + fastrefSkills[4] * this.props.allSkills.fastrefSkills / 100))
		var max_parry = fastrefSkills[2]
		
		// Навык Сокрушение (пробой брони)
		var afflictionSkills = [10, 1, 0]
		if (this.props.allSkillsMaster.afflictionSkills === 0) {
			afflictionSkills = [10, 1, 0]
		} else if (this.props.allSkillsMaster.afflictionSkills === 1) {
			afflictionSkills = [15, 2, 2]
		} else {
			afflictionSkills = [40, 3, 3]
		}
		
		armorPenetration += afflictionSkills[0] * this.props.allSkills.afflictionSkills
		armorPenetration = Math.round(armorPenetration * (1 + afflictionSkills[1] * this.props.allSkills.afflictionSkills / 100))
		armorPenetrationShield += afflictionSkills[2] * this.props.allSkills.afflictionSkills
		
		
		// Навык Аура сопротивления (Аура чистоты)
		var resistauraSkills = [10, 2, 1, 0, 0]
		if (this.props.allSkillsMaster.resistauraSkills === 0) {
			resistauraSkills = [10, 2, 1, 0, 0]
		} else if (this.props.allSkillsMaster.resistauraSkills === 1) {
			resistauraSkills = [30, 2, 1, 0, 1]
		} else {
			resistauraSkills = [30, 3, 2, 1.6, 1.6]
		}
		
		resists += resistauraSkills[0] * this.props.allSkills.resistauraSkills
		resists = Math.round(resists * (1 + resistauraSkills[1] * this.props.allSkills.resistauraSkills / 100))
		resistTempraryEffects += resistauraSkills[3] * this.props.allSkills.resistauraSkills

		// Снижение урона от ожогов
		var reflectResist = resistauraSkills[4] * this.props.allSkills.resistauraSkills + (breachTotals.reflectionResistance || 0)
		
		// Навык Устойчивость
		var sustainabilitySkills = [0, 0]
		if (this.props.allSkillsMaster.sustainabilitySkills === 0) {
			sustainabilitySkills = [5, 2]
		} else if (this.props.allSkillsMaster.sustainabilitySkills === 1) {
			sustainabilitySkills = [10, 2]
		} else {
			sustainabilitySkills = [20, 4]
		}
		
		stability += sustainabilitySkills[0]*this.props.allSkills.sustainabilitySkills
		stability = Math.round(stability * (1 + sustainabilitySkills[1] * this.props.allSkills.sustainabilitySkills / 100))
		
		// переносимый вес
		// Навык Грузоподъемность
		var carryingSkills = [1000, 5]
		if (this.props.allSkillsMaster.carryingSkills === 0) {
			carryingSkills = [1000, 5]
		} else if (this.props.allSkillsMaster.carryingSkills === 1) {
			carryingSkills = [2000, 10]
		} else {
			carryingSkills = [3000, 20]
		}
		
		weight += carryingSkills[0]*this.props.allSkills.carryingSkills
		weight = Math.round(weight * (1 + carryingSkills[1] * this.props.allSkills.carryingSkills / 100))
		
		
		// Навык Тайные знания
		
		var manaSkills = [0, 0]
		if (this.props.allSkillsMaster.secretknowledgeSkills === 0) {
			manaSkills = [20, 2]
		} else if (this.props.allSkillsMaster.secretknowledgeSkills === 1) {
			manaSkills = [50, 2]
		} else {
			manaSkills = [100, 3]
		}
		
		MP += manaSkills[0] * this.props.allSkills.secretknowledgeSkills
		MP = Math.round(MP * (1 + manaSkills[1] * this.props.allSkills.secretknowledgeSkills / 100))
		
		
	//		 	Навык Разрушитель (Хозяин стихий)
		var destroyerSkills = [0, 0]
		if (this.props.allSkillsMaster.destroyerSkills === 0) {
			destroyerSkills = [10, 0]
		} else if (this.props.allSkillsMaster.destroyerSkills === 1) {
			destroyerSkills = [12, 20]
		} else {
			destroyerSkills = [15, 40]
		}
		
		powerOfDestruction += this.props.allSkills.destroyerSkills*destroyerSkills[0]
		
		// Призыватель (Темный кардинал)
		var summonerSkills = [0, 0]
		if (this.props.allSkillsMaster.summonerSkills === 0) {
			summonerSkills = [10, 0]
		} else if (this.props.allSkillsMaster.summonerSkills === 1) {
			summonerSkills = [12, 10]
		} else {
			summonerSkills = [15, 15]
		}
		
		summons_ap_perc += summonerSkills[1]
		powerOfDark += this.props.allSkills.summonerSkills*summonerSkills[0]
		
		// Воля и разум (заклинатель)
		var casterSkills = [0]
		if (this.props.allSkillsMaster.casterSkills === 0) {
			casterSkills = [10]
		} else if (this.props.allSkillsMaster.casterSkills === 1) {
			casterSkills = [12]
		} else {
			casterSkills = [16]
		}
		powerOfLight += this.props.allSkills.casterSkills*casterSkills[0]
		
		// Дуэлянт
		//	Увеличивает урон оружия на 7 + 1%, парирование на 2 + 1%, реакцию на 2 + 1%, пробой брони на 6 + 1% и атаку на 9 + 1% за уровень навыка. Работает только если используется одно одноручное оружие без щита.
		var duelistSkills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		if (this.props.allSkillsMaster.duelistSkills === 0) {
			duelistSkills = [7, 1, 2, 1, 0, 0, 0, 0, 0, 1]
		} else if (this.props.allSkillsMaster.duelistSkills === 1) {
			duelistSkills = [7, 1, 2, 1, 2, 1, 0, 0, 0, 0]
		} else {
			duelistSkills = [7, 1, 2, 1, 2, 1, 6, 1, 9, 1]
		}
		
		// Дуэлянт
		duelistAdder(this.props.allSkills.duelistSkills)

		// Добавляем дуэлянта
		function duelistAdder(x) {
			if (weapon2handsGrip) {
				minDamage += duelistSkills[0] * x
				maxDamage += duelistSkills[0] * x

				minDamage = Math.round(minDamage * (1 + duelistSkills[1] * x / 100))
				maxDamage = Math.round(maxDamage * (1 + duelistSkills[1] * x / 100))

				atack += duelistSkills[8] * x
				atack = Math.round(atack * (1 + duelistSkills[9] * x / 100))

				parry += duelistSkills[2] * x
				parry = Math.round(parry * (1 + duelistSkills[3] * x / 100))

				armorPenetration += duelistSkills[6] * x
				armorPenetration = Math.round(armorPenetration * (1 + duelistSkills[7] * x / 100))
				// Реакция
				reaction += duelistSkills[4] * x
				reaction = Math.round(reaction * (1 + duelistSkills[5] * x / 100))
				
			}
		}
		
		// Магия веры
		var praySkills = [0]
		if (this.props.allSkillsMaster.praySkills === 0) {
			praySkills = [1, 0]
		} else if (this.props.allSkillsMaster.praySkills === 1) {
			praySkills = [1, 0]
		} else {
			praySkills = [1, 0]
		}
		powerOfPray += praySkills[0]*this.props.allSkills.praySkills
		
		// Паладин
		var palSkills = [0, 0, 0]
		if (this.props.allSkillsMaster.palSkills === 0) {
			palSkills = [1, 1, 0]
		} else if (this.props.allSkillsMaster.palSkills === 1) {
			palSkills = [1, 2, 0]
		} else {
			palSkills = [1, 2, 1]
		}
		powerOfPray += palSkills[0]*this.props.allSkills.palSkills
		praySpellManaLowerCost += palSkills[1]*this.props.allSkills.palSkills
		var double_cast_pray = palSkills[2]
		
		// Монах
		var monkSkills = [0]
		if (this.props.allSkillsMaster.monkSkills === 0) {
			monkSkills = [3]
		} else if (this.props.allSkillsMaster.monkSkills === 1) {
			monkSkills = [4]
		} else {
			monkSkills = [6]
		}
		
		powerOfPray += monkSkills[0]*this.props.allSkills.monkSkills
		
		// Воитель
		var warSkills = [3, 0, 0]
		if (this.props.allSkillsMaster.warSkills === 0) {
			warSkills = [3, 0, 0]
		} else if (this.props.allSkillsMaster.warSkills === 1) {
			warSkills = [3, 3, 0]
		} else {
			warSkills = [3, 3, 1]
		}
		HP = Math.round(HP * (1 + warSkills[1] * this.props.allSkills.warSkills / 100))
		resistDamage += warSkills[2]  * this.props.allSkills.warSkills
		rageSpeed += warSkills[0]  * this.props.allSkills.warSkills
		
		// Магия чумы
		var defilerSkills = [0, 0, 0]
		if (this.props.allSkillsMaster.defilerSkills === 0) {
			defilerSkills = [2, 0, 0]
		} else if (this.props.allSkillsMaster.defilerSkills === 1) {
			defilerSkills = [2, 10, 20]
		} else {
			defilerSkills = [2, 20, 40]
		}
		powerOfDefiler += this.props.allSkills.defilerSkills*defilerSkills[0] + defilerSkills[1]
		
		
		// Навык Ядомансер
		var posionSkills = [0, 0]
		if (this.props.allSkillsMaster.posionSkills === 0) {
			posionSkills = [10, 0]
		} else if (this.props.allSkillsMaster.posionSkills === 1) {
			posionSkills = [12, 20]
		} else {
			posionSkills = [15, 40]
		}
		powerOfDefiler += this.props.allSkills.posionSkills*posionSkills[0]
		
		// Навык Фехтовальщик
		var swordsmanSkills = [10, 1, 10, 1, 0]
		if (this.props.allSkillsMaster.swordsmanSkills === 0) {
			swordsmanSkills = [10, 1, 10, 1, 0]
		} else if (this.props.allSkillsMaster.swordsmanSkills === 1) {
			swordsmanSkills = [20, 1, 20, 1, 1]
		} else {
			swordsmanSkills = [20, 1, 30, 2, 2]
		}
		
		atack += swordsmanSkills[0] * this.props.allSkills.swordsmanSkills
		atack = Math.round(atack * (1 + swordsmanSkills[1] * this.props.allSkills.swordsmanSkills / 100))
		
		defense += swordsmanSkills[2] * this.props.allSkills.swordsmanSkills
		defense = Math.round(defense * (1 + swordsmanSkills[3] * this.props.allSkills.swordsmanSkills / 100))
		
		counterattack += swordsmanSkills[4] * this.props.allSkills.swordsmanSkills
		
		// Навык Путь ветра
		var windWaySkills = [1, 0, 0]
		if (this.props.allSkillsMaster.windWaySkills === 0) {
			windWaySkills = [1, 0, 0]
		} else if (this.props.allSkillsMaster.windWaySkills === 1) {
			windWaySkills = [1, 1, 1]
		} else {
			windWaySkills = [1.2, 1, 2]
		}

		evasion += windWaySkills[0] * this.props.allSkills.windWaySkills
		magicEvasion += windWaySkills[1] * this.props.allSkills.windWaySkills
		counterattack += windWaySkills[2] * this.props.allSkills.windWaySkills
		
		
		// Алхимический активатор
		var alchactiveSkills = [11, 0]
		if (this.props.allSkillsMaster.alchactiveSkills === 0) {
			alchactiveSkills = [11, 0]
		} else if (this.props.allSkillsMaster.alchactiveSkills === 1) {
			alchactiveSkills = [13, 40]
		} else {
			alchactiveSkills = [17, 50]
		}
		
		// Урон алхим зелий и пробоя сопрота
		var alch_damage = alchactiveSkills[0] * this.props.allSkills.alchactiveSkills
		var alch_damage_resist_reducer = alchactiveSkills[1]
		
		// Алхимический ингибитор
		var alchingibSkills = [12]
		if (this.props.allSkillsMaster.alchingibSkills === 0) {
			alchingibSkills = [12]
		} else if (this.props.allSkillsMaster.alchingibSkills === 1) {
			alchingibSkills = [14]
		} else {
			alchingibSkills = [20]
		}
		
		var alch_duration_power = alchingibSkills[0] * this.props.allSkills.alchingibSkills
		
		// Алхимический стабилизатор
		var alchstabilitySkills = [0, 0, 0, 0]
		if (this.props.allSkillsMaster.alchstabilitySkills === 0) {
			alchstabilitySkills = [1, 2, 2, 0]
		} else if (this.props.allSkillsMaster.alchstabilitySkills === 1) {
			alchstabilitySkills = [1, 3, 3, 1]
		} else {
			alchstabilitySkills = [1, 4, 4, 2]
		}
		
		var alchemy_tired = alchstabilitySkills[0] * this.props.allSkills.alchstabilitySkills
		var alchemy_mana_reducer = alchstabilitySkills[1] * this.props.allSkills.alchstabilitySkills
		var alchemy_reaction_power = alchstabilitySkills[2] * this.props.allSkills.alchstabilitySkills
		// Экономия появляется только от навыка, комплекта или руны.
		var save_alchemy_bottle = alchstabilitySkills[3] * this.props.allSkills.alchstabilitySkills
		
		
		
		
		// Навык Чумной доктор
		var plagueDoctorSkills = [0, 0]
		if (this.props.allSkillsMaster.plagueDoctorSkills === 0) {
			plagueDoctorSkills = [10, 0]
		} else if (this.props.allSkillsMaster.plagueDoctorSkills === 1) {
			plagueDoctorSkills = [12, 1]
		} else {
			plagueDoctorSkills = [15, 2]
		}
		
		
		// Продолжительность болезней
		var diseaseDuration = 0;
		diseaseDuration += plagueDoctorSkills[0]*this.props.allSkills.plagueDoctorSkills
		
		// Навык Вампиризм
		var vampireSkills = [0, 0, 0]
		if (this.props.allSkillsMaster.vampireSkills === 0) {
			vampireSkills = [0.4, 0, 0]
		} else if (this.props.allSkillsMaster.vampireSkills === 1) {
			vampireSkills = [0.5, 0, 1]
		} else {
			vampireSkills = [0.7, 0, 1]
		}
		
		var vampire_power_abs = vampireSkills[1]*this.props.allSkills.vampireSkills
		var vampire_power_percent = vampireSkills[0]*this.props.allSkills.vampireSkills + equipmentPhysicalVampirism + (breachTotals.physicalVampirism || 0)
		
		// Навык Огненная кожа
		var fireskinSkills = [0, 0]
		if (this.props.allSkillsMaster.fireskinSkills === 0) {
			fireskinSkills = [4, 0]
		} else if (this.props.allSkillsMaster.fireskinSkills === 1) {
			fireskinSkills = [5, 5]
		} else {
			fireskinSkills = [7, 10]
		}
		
		var fireskin_power_abs = fireskinSkills[0]*this.props.allSkills.fireskinSkills
		var fireskin_power_percent = fireskinSkills[1]*this.props.allSkills.fireskinSkills
		
		
		/*************************************************************
		
			Бонусы от Навыков OFF
			
		*************************************************************/
		

		/*************************************************************
		
			Бонусы от Рас и ВФ ON
			
		*************************************************************/
		
		// Опыт в боях
		var expirienceInBattle = intell/2;
		
		if (this.props.race === 'Человек') {
			expirienceInBattle *= 1+5/100
			let b = Math.floor(this.props.level/10)
			if (b > 5) {
				b = 5
			}
			specialSkillsRace = `ОД на действие -40% на ${30+b} сек.`
		} else if (this.props.race === 'Эльф') {
			
			atack = Math.round(atack * 1.1);
			
			let b = Math.floor(this.props.level/10)*6
			if (b > 30) {
				b = 30
			}
			specialSkillsRace = `Парирование +30 на ${60+b} сек.`
		} else if (this.props.race === 'Орк') {
			
			defense = Math.round(defense * 0.9);
			
			minDamage = Math.round(minDamage * 1.2);
			maxDamage = Math.round(maxDamage * 1.2);
			
			let b = Math.floor(this.props.level/10)*2
			if (b > 10) {
				b = 10
			}
			specialSkillsRace = `Атака и урон +30+20% на ${40+b} сек.`
		} else if (this.props.race === 'Гном') {
			
			resists = Math.round(resists * 1.05);
			armor = Math.round(armor * 1.1);
			
			let b = Math.floor(this.props.level/10)*5
			if (b > 25) {
				b = 25
			}
			specialSkillsRace = `Броня +100+30% на ${50+b} сек.`
		} else if (this.props.race === 'Тролль') {
			
			HP = HP * 1.1;
			minDamage = Math.round(minDamage * 1.1);
			maxDamage = Math.round(maxDamage * 1.1);
			
			let b = Math.floor(this.props.level/10)
			if (b > 5) {
				b = 5
			}
			specialSkillsRace = `Снятие 1${b>0 ? ' - ' + (1+1*b) : ''} временного эффекта`
		} else if (this.props.race === 'Дану') {
			darkSpellManaLowerCost += 10 
			let b = Math.floor(this.props.level/10)*2
			if (b > 10) {
				b = 10
			}
			specialSkillsRace = `Здоровье -10%, Урон +20+40% на ${40+b} сек.`
		} else if (this.props.race === 'Демон') {
			
			resists = Math.round(resists * 1.1);
			
			magicDamage = 5
			let b = Math.floor(this.props.level/10)*2
			if (b > 10) {
				b = 10
			}
			specialSkillsRace = `Поглощение 40% урона на ${40+b} сек.`
		} else if (this.props.race === 'Ангел') {	
			
//			powerOfLight += 10 + (0.8*hRace)
			powerOfPray += 7+(0.5*hRace)
			lightSpellManaLowerCost += 7+(0.4*hRace);
			
			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Полет"
									secondary={`после активации дает возможность перемещаться по глобальной карте с задержкой ${Math.round(100*(10 - Math.floor(hRace/8)))/100} в течение ${Math.round(100*(300 + 2*hRace))/100} секунд. Перезарядка: ${Math.round(100*(360 - 2*hRace))/100} минут.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Воин света"
									secondary={`Воин света сражается вместе с ангелом в каждом бою, его сила растет с уровнем ангела. Также все параметры воина света увеличиваются на 0.3%  за каждую единицу параметра Заклинатель ангела.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Знания света"
									secondary={`продолжительность, эффект лечения и урон всех заклинаний света +${Math.round(100*(10 + (0.8*hRace)))/100}%, расход маны на заклинания света уменьшается на ${Math.round(100*(7+(0.4*hRace)))/100}%, вера +${Math.round(100*(7+(0.5*hRace)))/100}`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Наделить силой"
									secondary={`Способности наделить силой, наделить скоростью, наделить стойкостью и наделить яростью имеют длительность ${Math.round(160+hRace)} секунд и общую перезарядку, равную 120 секунд.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.race === 'Лич') {	
			
			let b = 10+(0.4*hRace)
			
			darkSpellManaLowerCost += b;
			destrSpellManaLowerCost += b;
			mindSpellManaLowerCost += b;
			defilerSpellManaLowerCost += b;
			
			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Мертвая плоть"
									secondary={`каждый бой лич начинает с наложенными на него заклинаниями Оковы боли и Отражение боли, длительность их равна ${Math.round(100*((60 + 5*hRace)))/100} секундам.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Мертвые знания"
									secondary={`расход маны на заклинания стихии, разума, тьмы уменьшен на ${Math.round(b*100)/100}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Мертвая свита"
									secondary={`в начале каждого боя на стороне лича входит нежить (скелет-стражник, древний зомби, скелет лучник, рыцарь тьмы, хранитель склепа), сила и количество ее растет с уровнем лича.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" /> <ListItem>
								  <ListItemText
									primary="Не подвержен эффекту вампиризма."
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.race === 'Вампир') {	
			
			let b_ = Math.round(100*(1 + (0.06*hRace)))/100
			let c_ = 3+hRace*0.1
			vampire_power_percent += b_
			evasion += c_
			magicEvasion += c_

			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Ускоренные рефлексы"
									secondary={`${Math.round(10*c_)/10}% уклонения от атак и магии`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Истинный вампиризм"
									secondary={`базовый вампиризм ${b_}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" /><ListItem>
								  <ListItemText
									primary="Игра со смертью"
									secondary={`при убийстве вампира он тут же воскресает с ${Math.round(100*((10 + 0.5*hRace)))/100}% здоровья и получает при этом ${Math.round(100*((20 + 1*hRace)))/100} единиц ярости. Срабатывает 1 раз за бой.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" /><ListItem>
								  <ListItemText
									primary="Смена формы: вампир(базовая форма)"
									secondary={`вампир(базовая форма) - летучая мышь(параметры меняются в сторону скорости и точности) - волк(параметры меняются с сторону брони и защиты), форма меняется как в бою, так и вне боя.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" /><ListItem>
								  <ListItemText
									primary="Форма волка"
									secondary={`атака -30%, ОД +3, защита +30%, броня +20%, устойчивость +20%, сопротивляемость +20%.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" /><ListItem>
								  <ListItemText
									primary="Форма летучей мыши"
									secondary={`атака +30%, ОД -4, урон +20%, защита -40%, броня -40%.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" /><ListItem>
								  <ListItemText
									primary="Навык Вампиризм, не подвержен эффекту вампиризма."
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  
							</List>
						  </div>
				</React.Fragment>
		}
		else if (this.props.race === 'Берсерк') {	
			
			let b_1 = 15+(0.7*hRace)
			doubleChance += b_1
			
			let b_2 = (20+(1*hRace))/100
			HP += Math.round(HP*b_2)
			
			let b_3 = 1+Math.floor(hRace/10)
			pointOnBite -= b_3
			
			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Знание боя"
									secondary={`если экипировано двойное оружие, то вероятность нанесения двойного удара равна ${Math.round(100*(b_1))/100}%. Складывается с навыком Двойное оружие.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Ярость боя"
									secondary={`если здоровье берсерка ниже 30% от полного, то урон, атака и критический удар увеличены на ${Math.round(100*((25 + 0.6*hRace)))/100}%.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Скорость боя"
									secondary={`ОД на действие уменьшается на ${Math.round(100*(b_3))/100}.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Прилив боя"
									secondary={`после каждой успешной атаки с вероятностью ${Math.round(100*(15+(1*hRace)))/100}% до конца боя урон возрастает на (${this.props.level} + уровень цели)/2, максимальное значение урона не может превышать 300% от исходного (урона на начало боя).`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							  <ListItem>
								  <ListItemText
									primary="Тренировка боя"
									secondary={`здоровье +${Math.round(100*(b_2))}%.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>
		}
		else if (this.props.race === 'Торен') {	

			let b_6 = (40+(1*hRace))/100
			HP += Math.round(HP*b_6)
			
			let b_4 = (15+(0.4*hRace))/100
			critKoeff += b_4
			
			let b_5 = 10+(0.2*hRace)
			blood_lose += Math.round(b_5)
			
			let b_1 = (10+(0.5*hRace))/100
			criticalDamage += Math.round(criticalDamage*b_1)
			
			// Снижение воздействия временных эффектов
			let b_2 = (10 + (0.3*hRace))
			resistTempraryEffects += Math.round(b_2)
			
			let b_ = Math.round(100*(25 + (1.5*hRace)))/100
			rageSpeed += b_
			
			let b_3 = (30+(2*hRace))/100
			weight += Math.round(weight*b_3)
			
			let b_7 = (10+(1*hRace))/100
			armor += Math.round(armor*b_7)
			
			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Могучее тело"
									secondary={`+${Math.round(100*(b_6))}% здоровья, броня +${Math.round(100*(b_7))}%, грузоподъемность +${Math.round(100*(b_3))}%.`}
								  />
								</ListItem>
								<ListItem>
								  <ListItemText
									primary="Звериная сила"
									secondary={`критический удар +${Math.round(100*(b_1))}%, критический урон +${Math.round(100*(b_4))}%, шанс кровотечения +${Math.round(100*(b_5))/100}%.`}
								  />
								</ListItem>
								<ListItem>
								  <ListItemText
									primary="Звериное бешенство"
									secondary={`скорость накопления ярости увеличена на ${Math.round(b_)}%.`}
								  />
								</ListItem>
								<ListItem>
								  <ListItemText
									primary="Исключительная стойкость"
									secondary={`начинает каждый бой с эффектом приема ярости Последний шанс. Временные эффекты не вызывают срабатывание Исключительной стойкости.`}
								  />
								</ListItem>
								<ListItem>
								  <ListItemText
									primary="Природная стойкость"
									secondary={`эффективность всех негативных временных эффектов снижена на ${Math.round(100*(b_2))/100}%.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.race === 'Голем') {
			
			let b_1 = (20+(1*hRace))/100
			armor += Math.round(armor*b_1)
			stability += Math.round(stability*b_1)
			
			let b_2 = (30+(1*hRace))/100
			resists += Math.round(resists*b_2)
			
			let b_3 = 4+(0.4*hRace)
			resistDamage += Math.round(b_3)
			resistTempraryEffects += Math.round(b_3)
			
			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Каменное тело"
									secondary={`${Math.round(100*(b_3))/100}% поглощения физического и магического урона и сопротивляемости временным эффектам, +${Math.round(100*(b_1))}% устойчивости и брони, +${Math.round(100*(b_2))}% сопротивляемости.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Каменный щит"
									secondary={`на ${Math.round(100*(40+(2*hRace)))/100} секунд в бою дает 40% шанс блокирования атак щитом, если аватар держит в руках собственный щит, то эффект суммируется. Перезарядка: ${Math.round(100*(30-0.3*hRace))/100} минут.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Шокирующие удары"
									secondary={`каждый удар, попавший по цели, снижает ее броню и защиту на 1% от максимального значения на 3 минуты.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Полное окаменение"
									secondary={`на ${Math.round(100*(60+(5*hRace)))/100} секунд в бою получает 95% поглощение всех видов урона, в этом состоянии регенерирует 5% здоровья каждые 15 секунд, ОД на удар становится равным 9999. Перезарядка: ${Math.round(100*(140-2*hRace))/100} минут.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Не подвержен эффекту вампиризма."
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.race === 'Гигант') {
			
			let b_1 = (80+(1.5*hRace))/100
//			let b_1 = (100+(2*hRace))/100
			minDamage += (200+(10*hRace))
			maxDamage += (200+(10*hRace))
			
			HP += Math.round(HP*b_1)

			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Гигантские размеры"
									secondary={`+${Math.round(100*(b_1))}% здоровья, физический урон +${Math.round(100*(200+(10*hRace)))/100}.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Растоптать"
									secondary={`наносит цели в радиусе удара физический урон, равный ${Math.round(100*((30+0.5*hRace)))/100}% ее максимального здоровья. Действует только на цели максимальное здоровье которых меньше максимального здоровья гиганта. ОД на действие +10. Перезарядка: ${Math.round(100*(100-1*hRace))/100} минут.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Сокрушить"
									secondary={`наносит цели в радиусе удара физический урон, равный ${Math.round(100*((30+0.5*hRace)))/100}% максимального здоровья гиганта. Действует только на цели максимальное здоровье которых больше максимального здоровья гиганта. ОД на действие +10. Перезарядка: ${Math.round(100*(100-1*hRace))/100} минут.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.race === 'Призрак') {	
			
			let b_1 = 35+(0.4*hRace);
			resistDamage += Math.round(b_1)
			resistTempraryEffects += Math.round(b_1)

			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Призрачное тело"
									secondary={`${Math.round(100*(b_1))/100}% поглощения физического и магического урона и сопротивляемости временным эффектам.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Призрачная форма"
									secondary={`на ${Math.round(100*((300 + 10 * hRace)))/100} секунд вероятность нападения большинства монстров снижается на 80%, скорость перемещения по глобальной карте становится равной 15 секундам, независимо от типа поверхности. Перезарядка: ${Math.round(100*((360 - 2*hRace)))/100} минут. Не действует в некоторых локациях.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Призрачное бессмертие"
									secondary={`при использовании в бою на ${Math.round(100*((30 + 0.6*hRace)))/100} секунд получает 90% поглощения урона и сопротивления временному урону. Перезарядка: ${Math.round(100*(9-0.1*hRace))/100} минут.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Навык Вампиризм. Не подвержен эффекту вампиризма."
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>

		} 
		else if (this.props.race === 'Эфрит') {
			
			let b_1 = (20+(0.9*hRace))/100
			HP += Math.round(HP*b_1)
			
			arrowsInTheFire += 15+(0.5*hRace)
			// Учесть, что может быть лук и обычное оружие
			fireWeapon += 25+(1*hRace)
			
			let b_2 = Math.round(100*(50+(2*hRace)))/100
			fireskin_power_percent += b_2

			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Огненный щит"
									secondary={`с вероятностью ${Math.round(100*(15+(0.5*hRace)))/100}% сжигает стрелы, возвращает ${b_2}% от полученного урона с любой контактной атаки, складывается с навыком Огненная кожа.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Огненная аура"
									secondary={`в руках эфрита любое оружие вспыхивает огнем и в дополнение к обычному урону также наносит огненный урон (снижается не броней, а сопротивлением, при этом игнорирует 50% сопротивления цели) в размере ${Math.round(100*(25+(1*hRace)))/100}% от нанесенного урона.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Демоническая свита"
									secondary={`в начале каждого боя на стороне эфрита входят демоны (огонь глубин, шахтный бес, ужас глубин, око бездны), сила и количество их растет с уровнем.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Демоническое тело"
									secondary={`+${Math.round(100*(b_1))}% здоровья.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Навык Огненная кожа."
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>

		} 
		else if (this.props.race === 'Джинн') {	
			
			let b_1 = (15+(0.8*hRace))/100
			HP += Math.round(HP*b_1)
			let b_2 = (15+(0.7*hRace))/100
			MP += Math.round(MP*b_2)

			highFormSpecial = <React.Fragment >
							<Typography variant="h6">
							Особенности Высшей формы {this.props.race} ({hRace})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Энергетический щит"
									secondary={`активируемая/деактивируемая способность, 50% от получаемого урона будет поглощаться маной, расходуемой из расчета ${Math.round(100*(2-(0.025*hRace)))/100} единицы маны за 1 единицу урона.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Множественное заклинание"
									secondary={`с вероятностью ${Math.round(100*(12+(0.4*hRace)))/100}% прочитанное джинном заклинание может сработать дважды подряд.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Мгновенное заклинание"
									secondary={`с вероятностью ${Math.round(100*(12+(0.6*hRace)))/100}% прочитанное джинном заклинание может сработать без затраты ОД.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Астральное заклинание"
									secondary={`с вероятностью ${Math.round(100*(12+(0.5*hRace)))/100}% прочитанное джинном заклинание может сработать без затраты маны.`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Астральность"
									secondary={`+${Math.round(100*(b_1))}% здоровья, +${Math.round(100*(b_2))}% маны. Особые заклинания не могут срабатывать одновременно, т.е. если сработало одно, то 100% не сработают другие. Последовательность проверки особых заклинаний: мгновенное, множественное, астральное. Вероятность срабатывания хотя бы одного из особых заклинаний 
									${Math.round(100*(100-
											Math.round(100*
													   ((100-(12+(0.4*hRace)))/100)*
													   ((100-(12+(0.6*hRace)))/100)*
													   ((100-(12+(0.5*hRace)))/100))))/100}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
							</List>
						  </div>
				</React.Fragment>
		} 
		
		/*************************************************************
		
			Бонусы от Рас и ВФ OFF
			
		*************************************************************/
		
		
		

		/*************************************************************
		
			Бонусы от Профессий ON
			
		*************************************************************/
		

		// Следопыт на поверности и под землей
		var AtackAndDefenceByAragorn = [0, 0, 0, 0]
		
		
		var witcherResist = 0;
		
		// Против аватаров Охотник
		var hunterAvatarsVersus = 0;
		// Урон по призванным существам
		var damageBySummonersBeast = 0
		
		// Антибонус рейдера 
		var armorRaider = 0;
		var professionSpecial = '';
		// Профессии
		if (this.props.profession === 'Следопыт') {
			let l = this.props.professionLevel
			
			// Процент увеличения на поверхности
			AtackAndDefenceByAragorn[0] = Math.round(1.4950010*l+0.3009590)
			AtackAndDefenceByAragorn[1] = Math.round(1.4950010*l+0.3009590)
			
			// Снжаем в подземелье
			AtackAndDefenceByAragorn[2] = Math.round(0.0000175*l*l*l-0.0046751*l*l+0.7079968*l+0.3537199)
			AtackAndDefenceByAragorn[3] = Math.round(0.0000175*l*l*l-0.0046751*l*l+0.7079968*l+0.3537199)
				
			professionSpecial = <React.Fragment >
							<Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Вероятность нахождения растительных ингредиентов:"
									secondary={`+${l*2}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Скорость перемещения по глобальной карте"
									secondary={`+${Math.round(0.0000683*Math.pow(l, 3)-0.0153186*Math.pow(l, 2)+1.4976127*l+0.5627604)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Атака и защита в боях на поверхности"
									secondary={`+${AtackAndDefenceByAragorn[0]}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Атака, защита, броня, сопротивляемость в боях в подземельях"
									secondary={`-${AtackAndDefenceByAragorn[2]}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
			
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.profession === 'Убийца') {
			let l = this.props.professionLevel
			
			let time = 61 - l
			
			time = time < 1 ? 1 : time
			
			let distance = Math.round(0.1009998*l+0.9398082)
			
			let distanceSee = Math.floor(1 + l/2)
			
			let defeat = Math.floor(7*l)
				
			professionSpecial = <React.Fragment >
							<Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Опыт за победы над аватарами:"
									secondary={`+${l*2}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность нападать в любых локациях каждые:"
									secondary={`${time} минут`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность нападать на глобальной карте с расстояния:"
									secondary={`${distance} клеток`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность видеть координаты аватаров с расстояния:"
									secondary={`${distanceSee} клеток`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="При поражении теряет способность нападать на:"
									secondary={`${defeat} минут`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Подвергается нападениям в любых локациях и Не может использовать Охранные свитки"
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>

		}
		else if (this.props.profession === 'Лекарь') {
			let l = this.props.professionLevel
			
			
			//let downPowerFromHeal = Math.round(Math.pow(l, 0.7)*10)/10
			let downPowerFromHeal = Math.round(1000*(0.2*l/100))/10
			
			//HP -= Math.round(HP * (downPowerFromHeal/100))
			//armor -= Math.round(armor * (downPowerFromHeal/100))
			//defense -= Math.round(defense * (downPowerFromHeal/100))
			//parry -= Math.round(parry * (downPowerFromHeal/100))
			//stability -= Math.round(stability * (downPowerFromHeal/100))
			
			
			
			let heal = Math.round(0.1263008*l+0.7227097)
			let biteHeal = Math.round(60*(-0.1666497*l+24.0993165))
			professionSpecial = <React.Fragment >
						  <Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Вероятность нахождения ресурсов (на поверхности и в шахтах) и ингредиентов:"
									secondary={`-${downPowerFromHeal}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Лечение за единицу маны:"
									secondary={`${heal} здоровья`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Исцеление травмы каждые:"
									secondary={`${biteHeal} минут`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>
				


		} 
		else if (this.props.profession === 'Ведьмак') {
			let l = parseInt(this.props.professionLevel)
			

			witcherResist = l/130
			resists += resists * witcherResist
			
			
			var temp_ = 0
			for (var i__ = 1; i__ <= l; i__++) {
				temp_ += (1/(l+210))
			}
			resistTempraryEffects += temp_*100
			damageBySummonersBeast = Math.round(1.5*l)
			armor -= armor*temp_
			
			let healWitcher = Math.round(0.1009998*l+0.9398082)
			
			professionSpecial = <React.Fragment >
							<Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Сопротивляемость магии:"
									secondary={`+${Math.round(100*witcherResist)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Сопротивляемость временным эффектам:"
									secondary={`+${Math.round(temp_*100)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Урон по призванным существам:"
									secondary={`+${Math.round(damageBySummonersBeast)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Броня:"
									secondary={`-${Math.round(100*temp_)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Лечение за единицу маны:"
									secondary={`${healWitcher} здоровья`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.profession === 'Наемник') {
			let l = this.props.professionLevel
			
			
			// Сопротивляемость и броня
			let b = Math.pow(l, 0.72)
			armor += Math.round(armor*b/100)
			resists += Math.round(resists*b/100)
			
			let exp = Math.round(0.0000038*l-0.0020241*l*l+0.3922764*l+9.6773868)
			
			expirienceInBattle *= (1 - exp/100)
			
			let b1 = 31 - l
			b1 = b1 < 1 ? 1 : b1
			
			let distance = Math.round(0.1009998*l+0.9398082)
			let count = Math.round(0.0000117*l*l*l-0.0018114*l*l+0.1339690*l-0.1147254)
			professionSpecial = <React.Fragment >
							<Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Сопротивляемость и броня:"
									secondary={`+${Math.round(b)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Получаемый опыт:"
									secondary={`-${exp}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность вмешиваться в любые бои каждые:"
									secondary={`${b1} минут`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность вмешиваться в любые бои с расстояния:"
									secondary={`${distance} клеток`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность создавать отряд численностью:"
									secondary={`${count} игроков`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Возможность самостоятельной починки вещей бесплатно, но с потерей 3 единиц максимальной прочности вещи."
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.profession === 'Охотник') {
			let l = parseInt(this.props.professionLevel)
			
			let b = Math.round(-0.0000067*l*l*l+0.0010351*l*l+0.3520177*l+0.6369859)

			hunterAvatarsVersus = Math.round(0.0000196*l*l*l-0.0058799*l*l+0.8681184*l+0.0739896)
			
			
			var temp_ = 0
			for (var i__ = 1; i__ <= l; i__++) {
				temp_ += (1/(l+90))
			}
			weight -= weight*temp_

			
			professionSpecial = <React.Fragment >
							<Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Вероятность нахождения частей монстров:"
									secondary={`+${l*2}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Дополнительные ОД в начале обычных боев с монстрами:"
									secondary={`+${b}`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Эффективность использования зелий и эликсиров:"
									secondary={`+${l}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Броня и сопротивляемость в боях против аватаров:"
									secondary={`-${hunterAvatarsVersus}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Грузоподъемность:"
									secondary={`-${Math.round(100*temp_)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>
		} 
		else if (this.props.profession === 'Рейдер') {
			let l = this.props.professionLevel
			
			let b = Math.round(0.4039992*l-0.2407672)
			
			armorRaider = b
			
			let b3 = Math.round((0.08*l+0.5)*10)/10
			
			pointOnBite += b3
			
			weight += weight*(l*2)/100
			professionSpecial = <React.Fragment >
							<Typography variant="h6">
							Бонусы профессии {this.props.profession} ({l})
						  </Typography>
						  <div style={{maxWidth: 500}}>
							<List dense={true}>
								<ListItem>
								  <ListItemText
									primary="Вероятность нахождения ресурсов:"
									secondary={`+${Math.round(1.4*l)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Сопротивляемость, броня, устойчивость в подземельях:"
									secondary={`+${b}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="Грузоподъемность:"
									secondary={`+${Math.round(2*l)}%`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								<ListItem>
								  <ListItemText
									primary="ОД на действие:"
									secondary={`+${b3}`}
								  />
								</ListItem>
								<Divider variant="inset" component="li" />
								
							</List>
						  </div>
				</React.Fragment>
		}

		
		/*************************************************************
		
			Бонусы от Профессий OFF
			
		*************************************************************/
		
		
		
		
		
		
		
		
		
		// Количесво очков действия
		pointsOfAction += Math.round(dex * 0.2 + will * 0.4);

		// Коэффицинт от религии (выше 20 уровня + 2%)
		const religionK = 1 + ((this.props.level>20) ? (this.props.level-20)*0.02 : 0);
//		console.log(religionK)
		
		
		
		/*************************************************************
		
			Бонусы от клановых артефактов ON
			
		*************************************************************/
		
		//		Меч вечного синяия
		// Расчет мультипликатора, в зависимости от артефакта и уровня игрока
		// 0.015 сверено с текущим экраном клана: 5 мечей дают +282 атаки
		// на 60-м уровне, 6 масок дают +233/+366 урона.
		var multi_ = this.props.clansArtSword * this.props.level/10 * (1-0.015*(this.props.clansArtSword -1))
		
		atack += 10*multi_
		defense += 6*multi_
		criticalDamage += 2*multi_
		armorPenetration += 3*multi_
		
		// Сфера
		multi_ = this.props.clansArtSphere * this.props.level/10 * (1-0.015*(this.props.clansArtSphere -1))
		MP += 40*multi_
		regenerationMP += 1*multi_
		
		// Маска
		multi_ = this.props.clansArtMask * this.props.level/10 * (1-0.015*(this.props.clansArtMask -1))
		HP += 20*multi_
		regenerationHP += 1*multi_
		minDamage += 7*multi_
		maxDamage += 11*multi_
		
		// Турнирная руна добавляется к рунам из списка клановых артефактов.
		const rulersRunes = (Number(this.props.clansArtRune) || 0) + (this.props.turnireRune ? 1 : 0)
		multi_ = rulersRunes * this.props.level/10 * (1-0.015*(rulersRunes -1))
		HP += 50*multi_
		MP += 50*multi_
		armor += 4*multi_
		resists += 4*multi_
		
		multi_ = rulersRunes * (1-0.015*(rulersRunes -1))
		pointOnBite += -0.5*multi_
		
		/*************************************************************
		
			Бонусы от клановых артефактов OFF
			
		*************************************************************/
		
		
		// Воздействуем на опыт в бою
		expirienceInBattle *= expAddFraction
		
		// Учитываем уровень
		expirienceInBattle *= (1 - expirienceByLvl/100)
		
		
		
		/*************************************************************
		
			Бонусы от Религии ON
			
		*************************************************************/
		
		
		
		
		
		// Бонусы религий. Иллириана больше не имеет активных бонусов.
		const activeReligionData = hasReligionBonuses(this.props.religion)
			? sanitizeReligionData(this.props.religionData)
			: []
		for (var j = 0; j<activeReligionData.length; j++) {

			if (activeReligionData[j].nameOfReligion === this.props.religion) {

				atack += Math.round(activeReligionData[j].odA*religionK)
				armor += Math.round(activeReligionData[j].odB*religionK)
				pointOnBite += activeReligionData[j].odDe*1
				
//				console.log('Здоровье', activeReligionData[j].odHp*religionK)
				HP += Math.round(activeReligionData[j].odHp*religionK)
				
				minDamage += Math.round(activeReligionData[j].odMin*religionK)
				maxDamage += Math.round(activeReligionData[j].odMax*religionK)
				
				MP += Math.round(activeReligionData[j].odMp*religionK)
				resists += Math.round(activeReligionData[j].odS*religionK)
				stability += Math.round(activeReligionData[j].odU*religionK)
				defense += Math.round(activeReligionData[j].odZ*religionK)
				
				break;
			}
		}

		
		/*************************************************************
		
			Бонусы от Религии OFF
			
		*************************************************************/
		
		
		/*************************************************************
		
			Бонусы от Комплектов вещей ON
			
		*************************************************************/
		
		var complect_ = ''
		

		complect_ = 'Комплект Золотой зари'
		
		if (complects[complect_] >= 2) {
			HP += 800
			atack += 70
		}
		if (complects[complect_] >= 3) {
			resists += 110
		}
		if (complects[complect_] >= 4) {
			armor += 150
		}
		if (complects[complect_] >= 5) {
			stability += 70
		}
		if (complects[complect_] >= 6) {
			HP += 1600
			atack += 140
		}
		if (complects[complect_] >= 7) {
			rage100FromComplects += 30
		}
		if (complects[complect_] >= 8) {
			pointOnBite += -4
		}
		if (complects[complect_] >= 9) {
			minDamage += 230
			maxDamage += 230
			atack += 130
		}
		if (complects[complect_] >= 10) {
			criticalDamage += 70
			critKoeff += 30/100
		}
		

		//////////////////////////////////////////

		complect_ = 'Комплект Древних владык'
		if (complects[complect_] >= 2) {
			parry += 50
			MP += 1000
			let b = 9
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
		}
		
		if (complects[complect_] >= 3) {
			resists += 500
			let b = 10
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
		}
		
		
		if (complects[complect_] >= 4) {
			HP += 2000
			MP += 3000
			
			let b = 11
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
		}
		if (complects[complect_] >= 5) {
			
			armor += 500
			let b = 12
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
			save_alchemy_bottle += 5
		}
		if (complects[complect_] >= 6) {
			stability += 500
			let b = 13
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
		}
		if (complects[complect_] >= 7) {
			HP += 4000
			MP += 5000
			let b = 14
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
			alch_duration_power += 25
		}
		if (complects[complect_] >= 8) {
			regenerationHP += 200
			regenerationMP += 300
			let b = 15
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
			alchemy_reaction_power += 30
		}
		if (complects[complect_] >= 9) {
			let b = 16
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
			
			darkSpellManaLowerCost += 20;
			lightSpellManaLowerCost += 20;
			destrSpellManaLowerCost += 20;
			mindSpellManaLowerCost += 20;
			defilerSpellManaLowerCost += 20;
			
			alch_damage += 25
		}
		if (complects[complect_] >= 10) {
			let b = 17
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b

			resistDamage += 20
			resistTempraryEffects += 20
			
			rage100FromComplects += 100
			
			save_alchemy_bottle += 10
		}

		///////////////////////////////
		
		complect_ = 'Комплект Истинной магии'
		if (complects[complect_] >= 3) {
			parry += 30
			let b = 7
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
			powerOfDefiler += b
			MP += 500
		}
		if (complects[complect_] >= 4) {
			resists += 300
			let b = 8
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}
		
		if (complects[complect_] >= 5) {
			HP += 2000
			MP += 1000
			let b = 9
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}
		if (complects[complect_] >= 6) {
			regenerationHP += 100
			regenerationMP += 150
			
			let b = 10
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}
		if (complects[complect_] >= 7) {
			armor += 250
			stability += 200
			
			let b = 11
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}
		
		
		if (complects[complect_] >= 8) {
			MP += 4000
			
			let b = 12
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}

		

		if (complects[complect_] >= 9) {
			pointOnBite += -8
			
			let b = 13
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}


		if (complects[complect_] >= 10) {
			rage100FromComplects += 100
			let b = 14
			powerOfDark += b
			powerOfDefiler += b
			powerOfLight += b
			powerOfDestruction += b
		}
		
		
		//////////////////////////////


		complect_ = 'Комплект Полнолуния'
		if (complects[complect_] >= 3) {
			parry += 60
			reaction += 30
		}
		if (complects[complect_] >= 4) {
			resists += 600
		}
		
		if (complects[complect_] >= 5) {
			MP += 1000
			HP += 8000
		}
		if (complects[complect_] >= 6) {
			minDamage += 500
			maxDamage += 500
			criticalDamage += 400
			critKoeff += 10/100
		}
		
		if (complects[complect_] >= 7) {
			minDamage += 500
			maxDamage += 500
			armorPenetration += 600
		}
		if (complects[complect_] >= 8) {
			armor += 600
			stability += 400
		}
		if (complects[complect_] >= 9) {
			atack += 1400
			defense += 1400
		}
		
		if (complects[complect_] >= 10) {
			rage100FromComplects += 100
			pointOnBite += -4
		}
		
		
		
		//////////////////////////////
		
	
		complect_ = 'Комплект Чумного доктора'
		if (complects[complect_] >= 2) {
			powerOfDefiler += 6
			armor += 150
		}
		
		if (complects[complect_] >= 3) {
			powerOfDefiler += 7
			stability += 100
		}
		if (complects[complect_] >= 4) {
			powerOfDefiler += 8
			HP += 1000
		}
		
		if (complects[complect_] >= 5) {
			powerOfDefiler += 9
			MP += 2000
		}
		
		if (complects[complect_] >= 6) {
			powerOfDefiler += 10
			regenerationMP += 200
		}
		
		if (complects[complect_] >= 7) {
			powerOfDefiler += 11
			resistTempraryEffects += 25
		}
		
		if (complects[complect_] >= 8) {
			powerOfDefiler += 12
			magicEvasion += 30
		}
		if (complects[complect_] >= 9) {
			powerOfDefiler += 13
			evasion += 15
		}
		if (complects[complect_] >= 10) {
			powerOfDefiler += 14
			defilerSpellManaLowerCost += 10
		}
		
		
		//////////////////////////////
		
	
		complect_ = 'Комплект Трансмутации'
		if (complects[complect_] >= 2) {
			resists += 100
			armor += 100
		}
		if (complects[complect_] >= 3) {
			atack += 250
			defense += 150
		}
		if (complects[complect_] >= 4) {
			HP += 2000
			MP += 500
		}
		if (complects[complect_] >= 5) {
			save_alchemy_bottle += 10
			stability += 100
		}
		if (complects[complect_] >= 6) {
			regenerationHP += 200
			regenerationMP += 300
		}
		if (complects[complect_] >= 7) {
			alch_duration_power += 50
			atack += 150
		}
		if (complects[complect_] >= 8) {
			minDamage += 300
			maxDamage += 300
			alchemy_reaction_power += 60
		}
		if (complects[complect_] >= 9) {
			reaction += 70
			alch_damage += 50
		}
		if (complects[complect_] >= 10) {
			atack += 150
			save_alchemy_bottle += 20
		}

		
		/////////////////////////////
		
		
		complect_ = 'Комплект Воина крови'
		if (complects[complect_] >= 2) {
			HP += 1100*bloodWarriorRings['Сила']
			
			HP += 2000*bloodWarriorRings['Тело']
			
			HP += 900*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 3) {
			minDamage += 150*bloodWarriorRings['Сила']
			maxDamage += 150*bloodWarriorRings['Сила']
			
			regenerationHP += 200*bloodWarriorRings['Тело']
			
			minDamage += 50*bloodWarriorRings['Ловкость']
			maxDamage += 50*bloodWarriorRings['Ловкость']
			atack += 200*bloodWarriorRings['Ловкость']
			
		}
		if (complects[complect_] >= 4) {
			armorPenetration += 150*bloodWarriorRings['Сила']
			
			resists += 190*bloodWarriorRings['Тело']
			
			defense += 400*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 5) {
			atack += 150*bloodWarriorRings['Сила']
			
			armor += 190*bloodWarriorRings['Тело']
			
			reaction += 40*bloodWarriorRings['Ловкость']
			parry += 40*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 6) {
			HP += 2100*bloodWarriorRings['Сила']
			
			HP += 4000*bloodWarriorRings['Тело']
			
			HP += 1800*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 7) {
			minDamage += 300*bloodWarriorRings['Сила']
			maxDamage += 300*bloodWarriorRings['Сила']
			
			stability += 110*bloodWarriorRings['Тело']
			
			minDamage += 100*bloodWarriorRings['Ловкость']
			maxDamage += 100*bloodWarriorRings['Ловкость']
			atack += 300*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 8) {
			armorPenetration += 300*bloodWarriorRings['Сила']
			
			resists += 350*bloodWarriorRings['Тело']
			
			defense += 700*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 9) {
			atack += 300*bloodWarriorRings['Сила']
			
			armor += 350*bloodWarriorRings['Тело']
			
			reaction += 70*bloodWarriorRings['Ловкость']
			parry += 70*bloodWarriorRings['Ловкость']
		}
		if (complects[complect_] >= 10) {
			criticalDamage += 150*bloodWarriorRings['Сила']
			
			stability += 220*bloodWarriorRings['Тело']
			
			pointOnBite += -5*bloodWarriorRings['Ловкость']
			
			critKoeff += 16/100*bloodWarriorRings['Сила']
			
			resistDamage += 4*bloodWarriorRings['Тело']
			resistTempraryEffects += 4*bloodWarriorRings['Тело']
			evasion += 4*bloodWarriorRings['Ловкость']
			magicEvasion += 4*bloodWarriorRings['Ловкость']
		}
		
		/////////////////////////////////
		
		complect_ = 'Комплект Стража зари'
		if (complects[complect_] >= 2) {
			HP += 1500
		}
		if (complects[complect_] >= 3) {
			defense += 165
			stability += 45
		}
		if (complects[complect_] >= 4) {
			armor += 100
			resists += 100
		}
		if (complects[complect_] >= 5) {
			parry += 40
			atack += 140
		}
		if (complects[complect_] >= 6) {
			HP += 2500
			regenerationHP += 190
		}
		if (complects[complect_] >= 7) {
			criticalDamage += 75
			reaction += 40
		}
		if (complects[complect_] >= 8) {
			atack += 215
			stability += 75
		}
		if (complects[complect_] >= 9) {
			armorPenetration += 175
			defense += 315
		}
		if (complects[complect_] >= 10) {
			armor += 125
			HP += 3375
		}
		/////////////////////////////////
		
		complect_ = 'Комплект Стража лесов'
		if (complects[complect_] >= 2) {
			HP += 1200
		}
		if (complects[complect_] >= 3) {
			defense += 130
			stability += 35
		}
		if (complects[complect_] >= 4) {
			armor += 80
			resists += 80
		}
		if (complects[complect_] >= 5) {
			parry += 30
			atack += 110
		}
		if (complects[complect_] >= 6) {
			HP += 2000
			regenerationHP += 150
		}
		if (complects[complect_] >= 7) {
			criticalDamage += 60
			reaction += 30
		}
		if (complects[complect_] >= 8) {
			atack += 170
			stability += 60
		}
		if (complects[complect_] >= 9) {
			armorPenetration += 140
			defense += 250
		}
		if (complects[complect_] >= 10) {
			armor += 100
			HP += 2700
		}
		/////////////////////////////////
		
		complect_ = 'Комплект Стража Солнца'
		if (complects[complect_] >= 2) {
			HP += 1800
		}
		if (complects[complect_] >= 3) {
			defense += 195
			stability += 55
		}
		if (complects[complect_] >= 4) {
			armor += 120
			resists += 120
		}
		if (complects[complect_] >= 5) {
			parry += 45
			atack += 165
		}
		if (complects[complect_] >= 6) {
			HP += 3000
			regenerationHP += 225
		}
		if (complects[complect_] >= 7) {
			criticalDamage += 90
			reaction += 45
		}
		if (complects[complect_] >= 8) {
			atack += 255
			stability += 90
		}
		if (complects[complect_] >= 9) {
			armorPenetration += 210
			defense += 375
		}
		if (complects[complect_] >= 10) {
			armor += 150
			HP += 4050
		}
		
		
		///////////////////////////////////////
		

		complect_ = 'Комплект Жреца лесов'
		if (complects[complect_] >= 2) {
			HP += 700
		}
		if (complects[complect_] >= 3) {
			MP += 1000
		}
		if (complects[complect_] >= 4) {
			armor += 90
		}
		
		if (complects[complect_] >= 5) {
			resists += 100
		}
		if (complects[complect_] >= 6) {
			let b = 7
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
		}

		if (complects[complect_] >= 7) {
			regenerationMP += 130
		}
			
		if (complects[complect_] >= 8) {
			stability += 70
		}

		if (complects[complect_] >= 9) {
			let b = 11
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
		}
		if (complects[complect_] >= 10) {
			HP += 700
			MP += 1000
			darkSpellManaLowerCost += 4
			lightSpellManaLowerCost += 4
			destrSpellManaLowerCost += 4
			mindSpellManaLowerCost += 4
			defilerSpellManaLowerCost += 4
			
		}
		
		///////////////////////////////////////
		

		complect_ = 'Комплект Жреца зари'
		if (complects[complect_] >= 2) {
			HP += 875
		}
		if (complects[complect_] >= 3) {
			MP += 1250
		}
		if (complects[complect_] >= 4) {
			armor += 115
		}
		
		if (complects[complect_] >= 5) {
			resists += 125
		}
		if (complects[complect_] >= 6) {
			let b = 9
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
		}

		if (complects[complect_] >= 7) {
			regenerationMP += 165
		}
			
		if (complects[complect_] >= 8) {
			stability += 90
		}

		if (complects[complect_] >= 9) {
			let b = 14
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
		}
		if (complects[complect_] >= 10) {
			HP += 875
			MP += 1250
			darkSpellManaLowerCost += 5
			lightSpellManaLowerCost += 5
			destrSpellManaLowerCost += 5
			mindSpellManaLowerCost += 5
			defilerSpellManaLowerCost += 5
		}
		///////////////////////////////////////
		

		complect_ = 'Комплект Жреца Солнца'
		if (complects[complect_] >= 2) {
			HP += 1050
		}
		if (complects[complect_] >= 3) {
			MP += 1500
		}
		if (complects[complect_] >= 4) {
			armor += 135
		}
		
		if (complects[complect_] >= 5) {
			resists += 150
		}
		if (complects[complect_] >= 6) {
			let b = 11
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
		}

		if (complects[complect_] >= 7) {
			regenerationMP += 195
		}
			
		if (complects[complect_] >= 8) {
			stability += 105
		}

		if (complects[complect_] >= 9) {
			let b = 17
			powerOfDark += b
			powerOfLight += b
			powerOfDestruction += b
		}
		if (complects[complect_] >= 10) {
			HP += 1050
			MP += 1500
			darkSpellManaLowerCost += 6
			lightSpellManaLowerCost += 6
			destrSpellManaLowerCost += 6
			mindSpellManaLowerCost += 6
			defilerSpellManaLowerCost += 6
		}
		
		//////////////////////////////////////
		
		complect_ = 'Комплект Магистра'
		if (complects[complect_] >= 2) {
			armor += 130*magistrRings['Светлый']
			armor += 130*magistrRings['Темный']
			armor += 130*magistrRings['Разрушитель']
			
			let b = 5
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
		if (complects[complect_] >= 3) {
			stability += 90*magistrRings['Светлый']
			stability += 90*magistrRings['Темный']
			stability += 90*magistrRings['Разрушитель']
			
			let b = 6
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
		if (complects[complect_] >= 4) {
			HP += 600*magistrRings['Светлый']
			HP += 600*magistrRings['Темный']
			HP += 600*magistrRings['Разрушитель']
			
			let b = 7
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
		
		if (complects[complect_] >= 5) {
			MP += 1000*magistrRings['Светлый']
			MP += 1000*magistrRings['Темный']
			MP += 1000*magistrRings['Разрушитель']
			
			let b = 8
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
		if (complects[complect_] >= 6) {
			regenerationMP += 110*magistrRings['Светлый']
			regenerationMP += 110*magistrRings['Темный']
			regenerationMP += 110*magistrRings['Разрушитель']
			
			let b = 9
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}

		if (complects[complect_] >= 7) {
			stability += 170*magistrRings['Светлый']
			stability += 170*magistrRings['Темный']
			stability += 170*magistrRings['Разрушитель']
			
			let b = 10
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
			
		if (complects[complect_] >= 8) {
			HP += 1000*magistrRings['Светлый']
			HP += 1000*magistrRings['Темный']
			HP += 1000*magistrRings['Разрушитель']
			
			let b = 11
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}

		if (complects[complect_] >= 9) {
			MP += 2000*magistrRings['Светлый']
			MP += 2000*magistrRings['Темный']
			MP += 2000*magistrRings['Разрушитель']
			
			let b = 12
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
		if (complects[complect_] >= 10) {
			regenerationMP += 200*magistrRings['Светлый']
			regenerationMP += 200*magistrRings['Темный']
			regenerationMP += 200*magistrRings['Разрушитель']
			
			let b = 13
			powerOfLight += b*magistrRings['Светлый']
			powerOfDark += b*magistrRings['Темный']
			powerOfDestruction += b*magistrRings['Разрушитель']
		}
		
		/////////////////////////////////////////
		
		complect_ = 'Комплект Новых владык'
		if (complects[complect_] >= 2) {
			resists += 600
		}
		
		
		if (complects[complect_] >= 3) {
			HP += 8000
			MP += 1000
		}
		
		if (complects[complect_] >= 4) {
			parry += 80
			reaction += 80
		}
		
		if (complects[complect_] >= 5) {
			atack += 650
			defense += 550
		}
		if (complects[complect_] >= 6) {
			stability += 500
			critKoeff += 15/100
		}
		if (complects[complect_] >= 7) {
			armor += 600
			armorPenetration += 400
		}

		if (complects[complect_] >= 8) {
			minDamage += 500
			maxDamage += 500
			criticalDamage += 400
		}
		
		if (complects[complect_] >= 9) {
			doubleChance += 25
			shieldBlock += 20
		}
		
		if (complects[complect_] >= 10) {
			resistDamage += 25
			resistTempraryEffects += 25
			
			rage100FromComplects += 100
		}
		
		/////////////////////////////////////////
		complect_ = 'Комплект Белиара'
		if (complects[complect_] >= 4) {
			HP += 1800
		}
		if (complects[complect_] >= 6) {
			stability += 20
			armor += 20
			resists += 20
			critKoeff += 5/100
		}
		
		if (complects[complect_] >= 8) {
			HP += 1800
			regenerationHP += 50
		}
		
		if (complects[complect_] >= 9) {
			atack += 55
			armorPenetration += 40
			reaction += 15
		}
		if (complects[complect_] >= 10) {
			pointOnBite += -2
			
			resistDamage += 2
			resistTempraryEffects += 2
			evasion += 2
			magicEvasion += 2
		}
		
		/////////////////////////////
		complect_ = 'Комплект Альматеи'
		if (complects[complect_] >= 4) {
			HP += 600
			MP += 600
		}
		
		if (complects[complect_] >= 6) {
			stability += 20
			armor += 20
			resists += 20
		}
		if (complects[complect_] >= 8) {
			HP += 600
			MP += 600
			regenerationMP += 30
		}
		
		if (complects[complect_] >= 9) {
			powerOfDark += 15
			powerOfDestruction += 15
			powerOfLight += 15
			powerOfDefiler += 15
		}
		if (complects[complect_] >= 10) {
			pointOnBite += -2
		}
		
		///////////////////////////////////////////
		complect_ = 'Комплект Вечного пламени'
		if (complects[complect_] >= 3) {
			minDamage += 1000
			maxDamage += 1000
		}
		if (complects[complect_] >= 4) {
			HP += 5000
		}
		if (complects[complect_] >= 5) {
			atack += 1000
			defense += 1000
		}
		if (complects[complect_] >= 6) {
			armor += 300
			resists += 700
		}
		if (complects[complect_] >= 7) {
			stability += 600
		}
		if (complects[complect_] >= 8) {
			criticalDamage += 500
		}
		if (complects[complect_] >= 9) {
			armorPenetration += 700
		}
		if (complects[complect_] >= 10) {
			pointOnBite += -11
			critKoeff += 100/100
		}
		//////////////////////////////////
		complect_ = 'Комплект Стальных небес'
		if (complects[complect_] >= 2) {
			atack += 100
			reaction += 25
		}
		if (complects[complect_] >= 3) {
			resists += 60
			regenerationHP += 60
		}
		if (complects[complect_] >= 4) {
			armorPenetration += 140
		}
		if (complects[complect_] >= 5) {
			pointOnBite += -2
			HP += 900
		}
		if (complects[complect_] >= 6) {
			atack += 250
			reaction += 40
		}
		if (complects[complect_] >= 7) {
			resists += 120
			regenerationHP += 220
		}
		if (complects[complect_] >= 8) {
			resistTempraryEffects += 35
		}
		if (complects[complect_] >= 9) {
			pointOnBite += -5
		}
		if (complects[complect_] >= 10) {
			resistDamage += 25
		}
		
		/////////////////////////////////////
		
		complect_ = 'Комплект Сумеречной тени'
		if (complects[complect_] >= 2) {
			armor += 50
			HP += 600
		}
		if (complects[complect_] >= 3) {
			stability += 60
			resists += 80
		}
		if (complects[complect_] >= 4) {
			armorPenetration += 170
		}
		if (complects[complect_] >= 5) {
			armor += 100
			HP += 1200
		}
		if (complects[complect_] >= 6) {
			counterattack += 10
			parry += 40
		}
		if (complects[complect_] >= 7) {
			pointOnBite += -4
		}
		if (complects[complect_] >= 8) {
			defense += 600
			evasion += 10
		}
		if (complects[complect_] >= 9) {
			doubleChance += 15
			armorPenetration += 50
		}
		if (complects[complect_] >= 10) {
			doubleChance += 25
			defense += 500
		}
		/////////////////////////////////////
		
		complect_ = 'Комплект Жертвенной крови'
		if (complects[complect_] >= 2) {
			powerOfDark += 4
			HP += 500
		}
		if (complects[complect_] >= 3) {
			powerOfDark += 4
			MP += 700
		}
		if (complects[complect_] >= 4) {
			powerOfDark += 5
			resists += 100
		}
		if (complects[complect_] >= 5) {
			powerOfDark += 5
			armor += 110
		}
		if (complects[complect_] >= 6) {
			powerOfDark += 6
			regenerationMP += 70
		}
		if (complects[complect_] >= 7) {
			powerOfDark += 6
			stability += 60
		}
		if (complects[complect_] >= 8) {
			powerOfDark += 7
			HP += 1200
		}
		if (complects[complect_] >= 9) {
			powerOfDark += 7
			MP += 1800
		}
		if (complects[complect_] >= 10) {
			powerOfDark += 8
			regenerationMP += 120
		}
		/////////////////////////////////////
		
		complect_ = 'Комплект Несмолкающего шепота'
		if (complects[complect_] >= 2) {
			powerOfLight += 4
			HP += 500
		}
		if (complects[complect_] >= 3) {
			powerOfLight += 4
			MP += 700
		}
		if (complects[complect_] >= 4) {
			powerOfLight += 5
			resists += 100
		}
		if (complects[complect_] >= 5) {
			powerOfLight += 5
			armor += 110
		}
		if (complects[complect_] >= 6) {
			powerOfLight += 6
			regenerationMP += 70
		}
		if (complects[complect_] >= 7) {
			powerOfLight += 6
			stability += 60
		}
		if (complects[complect_] >= 8) {
			powerOfLight += 7
			HP += 1200
		}
		if (complects[complect_] >= 9) {
			powerOfLight += 7
			MP += 1800
		}
		if (complects[complect_] >= 10) {
			powerOfLight += 8
			regenerationMP += 120
		}
		/////////////////////////////////////
		
		complect_ = 'Комплект Сияющего взгляда'
		if (complects[complect_] >= 2) {
			powerOfDestruction += 4
			HP += 500
		}
		if (complects[complect_] >= 3) {
			powerOfDestruction += 4
			MP += 700
		}
		if (complects[complect_] >= 4) {
			powerOfDestruction += 5
			resists += 100
		}
		if (complects[complect_] >= 5) {
			powerOfDestruction += 5
			armor += 110
		}
		if (complects[complect_] >= 6) {
			powerOfDestruction += 6
			regenerationMP += 70
		}
		if (complects[complect_] >= 7) {
			powerOfDestruction += 6
			stability += 60
		}
		if (complects[complect_] >= 8) {
			powerOfDestruction += 7
			HP += 1200
		}
		if (complects[complect_] >= 9) {
			powerOfDestruction += 7
			MP += 1800
		}
		if (complects[complect_] >= 10) {
			powerOfDestruction += 8
			regenerationMP += 120
		}
		

		
		/*************************************************************
		
			Бонусы от Комплектов вещей OFF
			
		*************************************************************/
		
		
		/*************************************************************
		
			Бонусы от Фракции ON
			
		*************************************************************/
		
		// Фракционная репутация

		var expAddFraction = 1; 
		if (this.props.fractionReputation >= 1) {
			pointOnBite += -0.2
		}
		if (this.props.fractionReputation >= 2) {
			HP += 200
		}
		if (this.props.fractionReputation >= 3) {
			armor += 30
		}
		if (this.props.fractionReputation >= 4) {
			expAddFraction += 0.05
		}
		if (this.props.fractionReputation >= 5) {
			regenerationHP += 30
		}
		if (this.props.fractionReputation >= 6) {
			weight += 600
		}
		if (this.props.fractionReputation >= 7) {
			resists += 50
		}
		if (this.props.fractionReputation >= 8) {
//			Задержка при перемещении
		}
		if (this.props.fractionReputation >= 9) {
//			Очки контроля
		}
		if (this.props.fractionReputation >= 10) {
			HP += 200
		}
		if (this.props.fractionReputation >= 11) {
			stability += 15
		}
		if (this.props.fractionReputation >= 12) {
//			Задержка за городом
		}
		if (this.props.fractionReputation >= 13) {
			pointOnBite += -0.2
		}
		if (this.props.fractionReputation >= 14) {
			weight += 600
		}
		if (this.props.fractionReputation >= 15) {
			expAddFraction += 0.05
		}
		
		
		/*************************************************************
		
			Бонусы от Фракции OFF
			
		*************************************************************/
		
		
		// Клановая слава
		var positionKoeff = (100-this.props.clanPosition*1.5)/100
		if (positionKoeff < 0) {
			positionKoeff = 0
		}
		var koeffClansGlory = this.props.clanGlory == null || this.props.clanPosition == null
			? 0 : positionKoeff*this.props.clanGlory/100
		
		
		// Прибавляем базовый урон
		minDamage+=20+Math.round(power/2 + this.props.level);
		maxDamage+=25+Math.round(power/2 + this.props.level);

		var clanBonuses = {
			'Здоровье': HP * koeffClansGlory,
			'Мана': MP * koeffClansGlory,
			'Атака': atack * koeffClansGlory,
			'Защита': defense * koeffClansGlory,
			'Броня': armor * koeffClansGlory,
			'Сопротивление': resists * koeffClansGlory,
			'Крит. удар': criticalDamage * koeffClansGlory,
			'Устойчивость': stability * koeffClansGlory,
		}

		// Current character snapshots match the game without an extra clan-glory multiplier on damage.
		atack *= 1+koeffClansGlory
		
		
		HP *= 1+koeffClansGlory
		MP *= 1+koeffClansGlory
		
		// Добавляем эффект от блага жизни
		var lifeBlessHP = 0
		if (this.props.lifeBless !== 'Нет') {
			lifeBlessHP = 200+this.props.lifeBless*1*200
			HP += lifeBlessHP
			MP += 100+this.props.lifeBless*1*100
		}
		
		defense *= 1+koeffClansGlory
		armor *= 1+koeffClansGlory
		parry *= 1+koeffClansGlory
		
		reaction *= 1+koeffClansGlory
		armorPenetration *= 1+koeffClansGlory
		pointsOfAction *= 1+koeffClansGlory
		resists *= 1+koeffClansGlory
		
		regenerationHP *= 1+koeffClansGlory
		regenerationMP *= 1+koeffClansGlory
		criticalDamage *= 1+koeffClansGlory
		
		stability *= 1+koeffClansGlory

		// Provisional Support bonus. The FAQ specifies efficiency increases but not
		// their exact stacking or rounding with other character effects.
		const golemSupport = golemSupportPercent(this.props.golem);
		if (golemSupport > 0) {
			const supportMultiplier = 1 + golemSupport / 100;
			minDamage *= supportMultiplier;
			maxDamage *= supportMultiplier;
			atack *= supportMultiplier;
			defense *= supportMultiplier;
			armor *= supportMultiplier;
			HP *= supportMultiplier;
			MP *= supportMultiplier;
			pointsOfAction *= supportMultiplier;
			resists *= supportMultiplier;
			criticalDamage *= supportMultiplier;
			stability *= supportMultiplier;
			parry *= supportMultiplier;
			reaction *= supportMultiplier;
			armorPenetration *= supportMultiplier;
			regenerationHP *= supportMultiplier;
			regenerationMP *= supportMultiplier;
		}


		// Считаем бафы от меток (снайпер и застрельщик навыки)

		// Снайпер
		var sniperSkills = [0, 0]
		if (this.props.allSkillsMaster.sniperSkill === 0) {
			sniperSkills = [4, 0.3]
		} else if (this.props.allSkillsMaster.sniperSkill === 1) {
			sniperSkills = [5, 0.4]
		} else {
			sniperSkills = [6, 0.5]
		}
		// Застрельщик
		var shooterSkills = [7, 0, 0, 10]
		if (this.props.allSkillsMaster.shooterSkills === 0) {
			shooterSkills = [7, 0, 0.1, 10]
		} else if (this.props.allSkillsMaster.shooterSkills === 1) {
			shooterSkills = [10, 0, 0.15, 11]
		} else {
			shooterSkills = [10, 0.03, 0.2, 12]
		}

		// Хил и снижение урона от застрельщика
		var shooterSkillsHealAbs = shooterSkills[0] * this.props.allSkills.shooterSkills * shooterSkills[3]
		var shooterSkillsHealPerc = shooterSkills[1] * this.props.allSkills.shooterSkills * shooterSkills[3]
		var shooterSkillsDamageReduce = shooterSkills[2] * this.props.allSkills.shooterSkills * shooterSkills[3]
		// оп урон от снайпера
		//console.log(sniperSkills[0], this.props.allSkills.sniperSkills, shooterSkills[3])
		var sniperSkillsAbsDamage = sniperSkills[0] * this.props.allSkills.sniperSkill * shooterSkills[3]
		var sniperSkillsAbsOerc = sniperSkills[1] * this.props.allSkills.sniperSkill * shooterSkills[3]
		
		
		// Учитываем профу следопыта
		
		var atackOnAir = Math.round(AtackAndDefenceByAragorn[0] > 0 ? atack * (1 + AtackAndDefenceByAragorn[0]/100) : 0)
		var defenceOnAir = Math.round(AtackAndDefenceByAragorn[1] > 0 ? defense * (1 + AtackAndDefenceByAragorn[1]/100) : 0)
		
		var atackOnCrypt = Math.round(AtackAndDefenceByAragorn[2] > 0 ? atack * (1 - AtackAndDefenceByAragorn[2]/100) : 0)
		var defenceOnCrypt = Math.round(AtackAndDefenceByAragorn[3] > 0 ? defense * (1 - AtackAndDefenceByAragorn[3]/100) : 0)
		
		
		// Учитываем не только значения Брони и сопрота, но и % снижения урона
		var armorOnCrypt = Math.round(AtackAndDefenceByAragorn[3] > 0 ? armor * (1 - AtackAndDefenceByAragorn[3]/100) : 0)
		var armorEffectCrypt = Math.round(0.0000000381*armorOnCrypt*armorOnCrypt*armorOnCrypt - 0.0001372515*armorOnCrypt*armorOnCrypt+0.1798962566*armorOnCrypt+6.7063922501)
		if ((armorEffectCrypt/100) >= 0.95) {
			armorEffectCrypt = 95
		}
		
		
		var resistOnCrypt = Math.round(AtackAndDefenceByAragorn[3] > 0 ? resists * (1 - AtackAndDefenceByAragorn[3]/100) : 0)
		var resistKoeffCrypt = Math.round(0.0000000600*resistOnCrypt*resistOnCrypt*resistOnCrypt - 0.0001868360*resistOnCrypt*resistOnCrypt+0.1827033809*resistOnCrypt+2.4473607831)
		if ((resistKoeffCrypt/100) >= 0.95) {
			resistKoeffCrypt = 95
		}
		
		// Рейдер учет
		armorOnCrypt = Math.round(armorRaider > 0 ? armor * (1 + armorRaider/100) : 0)
		armorEffectCrypt = Math.round(0.0000000381*armorOnCrypt*armorOnCrypt*armorOnCrypt - 0.0001372515*armorOnCrypt*armorOnCrypt+0.1798962566*armorOnCrypt+6.7063922501)
		if ((armorEffectCrypt/100) >= 0.95) {
			armorEffectCrypt = 95
		}
		
		
		resistOnCrypt = Math.round(armorRaider > 0 ? resists * (1 + armorRaider/100) : 0)
		resistKoeffCrypt = Math.round(0.0000000600*resistOnCrypt*resistOnCrypt*resistOnCrypt - 0.0001868360*resistOnCrypt*resistOnCrypt+0.1827033809*resistOnCrypt+2.4473607831)
		if ((resistKoeffCrypt/100) >= 0.95) {
			resistKoeffCrypt = 95
		}
		
		
		var stabilityOnCrypt = Math.round(armorRaider > 0 ? stability * (1 + armorRaider/100) : 0)

		
		// Броня и сопрот у охотника против аватаров
		
		var armorOnAvatarsVersus = Math.round(hunterAvatarsVersus > 0 ? armor * (1 - hunterAvatarsVersus/100) : 0)

		var armorOnAvatarsVersusEffect = Math.round(0.0000000381*armorOnAvatarsVersus*armorOnAvatarsVersus*armorOnAvatarsVersus - 0.0001372515*armorOnAvatarsVersus*armorOnAvatarsVersus+0.1798962566*armorOnAvatarsVersus+6.7063922501)
		
		if ((armorOnAvatarsVersusEffect/100) >= 0.95) {
			armorOnAvatarsVersusEffect = 95
		}
		
		
		var resistOnAvatarsVersus = Math.round(hunterAvatarsVersus > 0 ? resists * (1 - hunterAvatarsVersus/100) : 0)
		var resistOnAvatarsVersusEffect = Math.round(0.0000000600*resistOnAvatarsVersus*resistOnAvatarsVersus*resistOnAvatarsVersus - 0.0001868360*resistOnAvatarsVersus*resistOnAvatarsVersus+0.1827033809*resistOnAvatarsVersus+2.4473607831)
		
		if ((resistOnAvatarsVersusEffect/100) >= 0.95) {
			resistOnAvatarsVersusEffect = 95
		}
		
		
		
		
		
		
		
		
		// Шанс отбить атаку оружием/ Для атак в ближнем бою и для луков
		
		var chanceByDeniedHit = [doubleChance - 10, doubleChance - 20]
		

		if (chanceByDeniedHit[0] > 50) {
			chanceByDeniedHit[0] = 50
		} else if (chanceByDeniedHit[0] < 0) {
			chanceByDeniedHit[0] = 0
		}
		if (chanceByDeniedHit[1] > 50) {
			chanceByDeniedHit[1] = 50
		} else if (chanceByDeniedHit[1] < 0) {
			chanceByDeniedHit[1] = 0
		}

		// Шанс сохрана элика
		if (save_alchemy_bottle > 75) {
			save_alchemy_bottle = 75
		}
		

		


		// Ограничиваем -ОД
		var pointOnBiteLocal = pointOnBite < 5 ? 5 : pointOnBite
		var pointOnBiteDisplay = Math.round(pointOnBite * 10) / 10

		
		
		
		
		
		// Начальная ярость от клоплектов вещей
		var rage100FromComplects = breachTotals.startRage || 0;
		
		
		
		
		
		
		

//		* Поглощение урона - 75%
//		* Сопротивляемость временным эффектам - 75%
//		* Блок щитом - 75%
		
		if (resistDamage >= 75) {
			resistDamage = 75
		}
		if (resistTempraryEffects >= 75) {
			resistTempraryEffects = 75
		}
		
		// Живучесть
		
		//Основа - хп
		var vitality = HP
		
		// Эффект от брони и сопрота
		function get_armor_resist_effect(value) {
			
			var effect = Math.round(Math.pow(value, 0.49))
			
			if ((effect/100) >= 0.90) {
				effect = 90
			}
			return effect
		}
	
		// Добавляем регенерацию хп от самого хп
		regenerationHP += (HP-lifeBlessHP)/100

		// Топор повышает шанс кровотечения только при критическом ударе.
		// Этот ситуационный бонус показан отдельно в описании оружия.
		
		var obj_power_tolmin = {
			"name": "Игрок", 
			"maxHP": Math.round(HP),
			"maxMP": Math.round(MP), 
			"baseAP": Math.round(pointOnBite*10)/10,
			"attack": Math.round(atack),
			"defence": Math.round(defense),
			"armor": Math.round(armor),
			"minDamage": Math.round(minDamage),
			"maxDamage": Math.round(maxDamage),
			"critical": Math.round(criticalDamage), 
			"criticalDamage": Math.round(critKoeff*100)/100,
			"bleedingChance": Math.round(blood_lose),
			"resistance": Math.round(resists),
			"parry": Math.round(parry),
			"pierce": Math.round(armorPenetration),
			"fastness": Math.round(stability),
			"reaction": Math.round(reaction),
			"absorbtion": Math.round(resistDamage),
			"shieldBlock": Math.round(shieldBlock),
			"dualHit": Math.round(doubleChance),
			"poisonResist": Math.round(resistTempraryEffects),
			
			"vamp_physical": Math.round(vampire_power_percent * 10) / 10,
			"fire_shield": Math.round(0),
		};

		this.comparisonResult = {
			vital: Math.round(vitality),
			dps: Math.round(((minDamage + maxDamage) / 2) / Math.max(pointOnBiteLocal, 5)),
			hp: Math.round(HP),
			mp: Math.round(MP),
			power: Math.round(power),
			body: Math.round(body),
			stamina: Math.round(stamina),
			intell: Math.round(intell),
			will: Math.round(will),
			dex: Math.round(dex),
			criticalDamage: Math.round(criticalDamage),
			stability: Math.round(stability),
			armorPenetration: Math.round(armorPenetration),
			parry: Math.round(parry),
			reaction: Math.round(reaction),
			atack: Math.round(atack),
			defense: Math.round(defense),
			expirienceInBattle: Math.round(expirienceInBattle),
			darkSpellManaLowerCost: Math.round(darkSpellManaLowerCost),
			lightSpellManaLowerCost: Math.round(lightSpellManaLowerCost),
			destrSpellManaLowerCost: Math.round(destrSpellManaLowerCost),
			mindSpellManaLowerCost: Math.round(mindSpellManaLowerCost),
			praySpellManaLowerCost: Math.round(praySpellManaLowerCost),
			magicDamage: Math.round(magicDamage),
			armor: [Math.round(armor), get_armor_resist_effect(armor)],
			resists: [Math.round(resists), get_armor_resist_effect(resists)],
			pointsOfAction: Math.round(pointsOfAction),
			regenerationHP: Math.round(regenerationHP),
			regenerationMP: Math.round(regenerationMP),
			weigth: Math.round(weight),
			doubleChance: Math.round(doubleChance),
			dodgeBySpell: Math.round(magicEvasion),
			dodge: Math.round(evasion),
			pointOnBite: [Math.round(pointOnBiteDisplay), pointOnBiteDisplay],
			damage: [Math.round(minDamage), Math.round(maxDamage)],
			penetrationOfResist: [Math.round(breachTotals.resistanceIgnore || 0), 0],
			powerOfDark: Math.round(powerOfDark * 100) / 100,
			powerOfLight: Math.round(powerOfLight * 100) / 100,
			powerOfDestruction: Math.round(powerOfDestruction * 100) / 100,
			powerOfDefiler: Math.round(powerOfDefiler * 100) / 100,
			powerOfPray: Math.round(powerOfPray),
			criticalMultiplier: Math.round(critKoeff * 100) / 100,
			bleedingChance: Math.round(blood_lose),
			counterattack: Math.round(counterattack),
			shieldBlock_1: shieldOn ? Math.min(75, Math.round(shieldBlock - 20)) : 0,
			shieldBlock_2: shieldOn ? Math.min(75, Math.round(shieldBlock - 10)) : 0,
			shieldBlock_3: shieldOn ? Math.min(75, Math.round(shieldBlock)) : 0,
			weaponBlock: Math.round(weaponBlock),
			resistDamage: Math.round(resistDamage),
			resistTempraryEffects: Math.round(resistTempraryEffects),
			reflectionResistance: Math.round(reflectResist),
			physicalVampirism: Math.round(vampire_power_percent * 10) / 10,
			magicalVampirism: Math.round((equipmentMagicalVampirism + (breachTotals.magicalVampirism || 0)) * 10) / 10,
			summonsApPercent: Math.round(summons_ap_perc * 10) / 10,
			startAp: Math.round((breachTotals.startAp || 0) * 10) / 10,
			summonsStartAp: Math.round((breachTotals.summonsStartAp || 0) * 10) / 10,
			rageGain: Math.round(rageSpeed * 10) / 10,
			alchemySaving: Math.round((save_alchemy_bottle + (breachTotals.alchemySaving || 0)) * 10) / 10,
			temporaryResistanceIgnore: Math.round((breachTotals.temporaryResistanceIgnore || 0) * 10) / 10,
			rage100FromComplects: Math.round(rage100FromComplects),
		};
		for (const [key, value] of Object.entries(this.comparisonResult)) {
			if (Array.isArray(value)) {
				this.comparisonResult[key] = value.map((entry) => Number.isFinite(entry) ? entry : 0);
			} else if (typeof value === 'number' && !Number.isFinite(value)) {
				this.comparisonResult[key] = 0;
			}
		}

		if (this.props.renderless) return null;

		var tolm = 0
//		var xhr = new XMLHttpRequest();
//		xhr.withCredentials = false;
//
//		xhr.addEventListener("readystatechange", function () {
//		  if (this.readyState === this.DONE) {
//			console.log(this.responseText);
//			  
//		  	tolm = JSON.parse(this.responseText)
//		  }
//		});
//
//		xhr.open("POST", "https://psychea.space/avatars/api/gettolminpower", false);
//		xhr.setRequestHeader("Content-Type", "application/json");
//
//		xhr.send(JSON.stringify(obj_power_tolmin));
//		
//		



		
		return(
			<div className='col'>
			
				<Grid
						  container
						  direction="column"
						  justify="flex-start"
						  alignItems="stretch"
						  style={{backgroundColor: 'rgba(191, 245, 222, 0.68)'}}
						>		
							<Grid item>
								<Grid
								  container
								  direction="row"
								  justify="space-between"
								  alignItems="flex-start"
								  style={{padding: 10}}
								>
									<Grid item>
										<ListItem >
											<ListItemAvatar>
											<Badge badgeContent={this.props.level} color={'primary'}>

											  <Avatar >
												<img src={'https://chaosage.ru/images/elf_male_avatar.jpg'} alt={'Раса'}/>
											  </Avatar>
											</Badge>
											</ListItemAvatar>
											<ListItemText 
												primary={this.props.race}
												secondary={this.props.profession === 'Нет' ? 'Профессия отсутствует' : this.props.profession + ' ' + this.props.professionLevel + ' уровня'}/>
									  </ListItem>
									</Grid>
									<Grid item style={{paddingTop: 16}}>
										{
											//<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right'}}>
											//{'Сила в толминах: ' + Math.round(100000*tolm.status)/100000}
										//</Typography>}
											}
										{
//											<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right'}}>
//											{'Урон в секунду: ' + Math.round(damagePerSecond)}
//										 </Typography>
//										 <Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right'}}>
//											{'Живучесть: '+Math.round(vitality)}
//										 </Typography>
										}
										 
										<TextField onClick={this.copyToClipboard.bind(this)} style={{marginTop: 0}}
												InputProps={{
													readOnly: true,
												  }} 
												size={'small'} 
												id={"outlined-basic-"+1} 
												label="Скопировать" variant="outlined" value={JSON.stringify(obj_power_tolmin)}/>
										
									</Grid>
								</Grid>
								
							</Grid>

							<Grid item style={{backgroundColor: 'rgba(150, 150, 150, 0.26)'}}>
								<Grid
								  container
								  direction="row"
								  justify="space-between"
								  alignItems="flex-start"
								  style={{padding: 10}}
								>
									<Grid item>
										<Box color={"text.secondary" }>
											<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'left', margin: 0}}>
												Религия: {this.props.religion}
											 </Typography>
										</Box>
									</Grid>
									<Grid item>
										<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right', margin: 0}}>
											Клан: {this.props.clan}
											
										 </Typography>
									</Grid>
								</Grid>
								
							</Grid>
							
						</Grid>
						<div style={{padding: 25, fontSize: 12}}>
							<p style={{margin: 0}}><b>Информация о надетом комплекте:</b></p>
							{Object.keys(complects).filter((keyName, i) => {
								if (complects[keyName] > 0) {
									return true
								}
								return false
							}).map((keyName, i) => (
								<p style={{margin: 0}} key={keyName}>{keyName}: {complects[keyName]}/10</p>
							))}
							{Object.keys(magistrRings).filter((keyName, i) => {
								if (magistrRings[keyName] > 0) {
									return true
								}
								return false
							}).map((keyName, i) => (
								<p style={{margin: 0}} key={keyName}>{keyName}: {magistrRings[keyName]*100}%</p>
							))}
							{Object.keys(bloodWarriorRings).filter((keyName, i) => {
								if (bloodWarriorRings[keyName] > 0) {
									return true
								}
								return false
							}).map((keyName, i) => (
								<p style={{margin: 0}} key={keyName}>{keyName}: {bloodWarriorRings[keyName]*100}%</p>
							))}
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}><b>Необходимые руны:</b></p>
							{Object.keys(runes_list_).filter((keyName, i) => {
								if (runes_list_[keyName] > 0) {
									return true
								}
								return false
							}).map((keyName, i) => (
								<em style={{margin: 0}} key={keyName}>{keyName.toUpperCase()}: {runes_list_[keyName]}, </em>
							))}
							<p style={{margin: 0}}><b>Необходимые рунные слова:</b></p>
							{Object.keys(rune_words_list_).filter((keyName, i) => {
								if (rune_words_list_[keyName] > 0) {
									return true
								}
								return false
							}).map((keyName, i) => (
								<em style={{margin: 0}} key={keyName}>{keyName.toUpperCase()}: {rune_words_list_[keyName]}, </em>
							))}
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}><b>Главное:</b></p>
							<p style={{margin: 0}}>Временные эффекты и эликсиры не включены в расчёт.</p>
							<p style={{margin: 0}}>Здоровье (макс.): {Math.round(HP)}</p>
							<p style={{margin: 0}}>Мана (макс.): {Math.round(MP)}</p>
							<p style={{margin: 0}}>ОД на действие: {Math.round(pointOnBiteDisplay)} ({pointOnBiteDisplay})</p>
							<p style={{margin: 0}}>Урон: {Math.round(minDamage)} - {Math.round(maxDamage)}</p>
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки') || (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) 
								&& <Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки') || (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) 
								&& <p style={{margin: 0}}>Максимум меток: {shooterSkills[3]}. Меток за выстрел: {Math.floor(10*(pointOnBiteLocal / 10 * ((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки') ? 1 : 1.5)))/10}</p>}
							{(sniperSkillsAbsDamage > 0 && (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки') || (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) 
								&& <p style={{margin: 0}}>Урон при стрельбе по цели с макс. меток: +{Math.round(sniperSkillsAbsDamage)} +{Math.round(sniperSkillsAbsOerc)}% ({Math.round(minDamage + minDamage*sniperSkillsAbsOerc/100 + sniperSkillsAbsDamage)} - {Math.round(maxDamage + maxDamage*sniperSkillsAbsOerc/100 + sniperSkillsAbsDamage)})</p>}
							{(shooterSkillsHealAbs > 0 && (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки') || (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) 
								&& <p style={{margin: 0}}>Восстанавливает здоровье при снятии меток (макс): {Math.round(shooterSkillsHealAbs)} +{Math.round(shooterSkillsHealPerc)}% от макс. зоровья ({Math.round(HP*shooterSkillsHealPerc/100 + shooterSkillsHealAbs)})</p>}
							{(shooterSkillsHealAbs > 0 && (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки') || (this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) 
								&& <p style={{margin: 0}}>Снижает получаемый урон от целей с метками (макс): {Math.round(shooterSkillsDamageReduce)}%</p>}
							
							
							{(counterattack > 0) && <p style={{margin: 0}}>Контрудар: шанс {Math.round(counterattack)}%, урон: {Math.round(0.6*minDamage)} - {Math.round(0.6*maxDamage)}</p>}
							{(returnODMiss > 0) && <p style={{margin: 0}}>Добавление ОД при промахе: {Math.round(returnODMiss)}% от базового, но не более {Math.round(returnODMax)} ОД</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							{(weaponInRightHand != 'Нет') && <p style={{margin: 0}}><b>Особые свойства оружия:</b></p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Мечи') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Мечи')) && <p style={{margin: 0, maxWidth: 500}}>*Не критические удары мечом наносят повышенный на 13% урон.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Мечи') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Мечи')) && <p style={{margin: 0, maxWidth: 500}}>*Базовые атаки снижают собственное од на действие на 1 на 10 секунд, не складывается.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Топоры') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Топоры')) && <p style={{margin: 0, maxWidth: 500}}>*Критические атаки наносят на 8% больше урона и имеют +7% к шансу вызвать кровотечение.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Топоры') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Топоры')) && <p style={{margin: 0, maxWidth: 500}}>*Не критические атаки снижают устойчивость цели на 15% на 20 секунд, не складывается.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Дубины') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Дубины')) && <p style={{margin: 0, maxWidth: 500}}>*Каждый удар повышает од на действие цели на 1, время действия равно од на действие ударившего, складывается.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Дубины') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Дубины')) && <p style={{margin: 0, maxWidth: 500}}>*Базовые атаки игнорируют 15% текущей брони цели.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Копья') && (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Нет')) && <p style={{margin: 0, maxWidth: 500}}>*Копьё позволяет атаковать 2 ряда противника.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) && <p style={{margin: 0, maxWidth: 500}}>*Атаки игнорируют 25% брони и устойчивости цели.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) && <p style={{margin: 0, maxWidth: 500}}>*Арбалет позволяет атаковать любую цель из ближайшего ряда</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки')) && <p style={{margin: 0, maxWidth: 500}}>*Лук позволяет атаковать любую вражескую цель на поле боя.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Посохи')) && <p style={{margin: 0, maxWidth: 500}}>*Посохом можно ударить врага по его тупой башке.</p>}



							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							{((weaponInRightHand != 'Нет') && (this.props.thingOnPers['Оружие Справа'].kindOfThing != 'Посохи')) && <p style={{margin: 0}}><b>Особые удары и приёмы:</b></p>}
							{((weaponInRightHand === 'Контактное оружие') && (this.props.thingOnPers['Оружие Справа'].kindOfThing != 'Посохи')) &&
								<p style={{margin: 0, maxWidth: 500}}>*<u>Короткий удар</u>: ОД на действие {Math.round(pointOnBite*100*0.7)/100}, Атака {Math.round(atack*0.7)}, Урон {Math.round(minDamage*0.7)} - {Math.round(maxDamage*0.7)}</p>}
							{((weaponInRightHand === 'Контактное оружие') && (this.props.thingOnPers['Оружие Справа'].kindOfThing != 'Посохи')) && 
								<p style={{margin: 0}}>*<u>Удар с замахом</u>: ОД на действие {Math.round(pointOnBite*100+300)/100}, Атака {Math.round(atack*0.6)}, Урон {Math.round(minDamage*2)} - {Math.round(maxDamage*2)}, Крит. удар 0</p>}
							{((weaponInRightHand === 'Контактное оружие') && (this.props.thingOnPers['Оружие Справа'].kindOfThing != 'Посохи')) && 
										<p style={{margin: 0, maxWidth: 500}}>*<u>Тяжелый удар</u>: ОД на действие {Math.round(pointOnBite*100+300)/100}, Атака {Math.round(atack*0.6)}, Урон {Math.round(minDamage*1.3)} - {Math.round(maxDamage*1.3)}</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Мечи') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Мечи')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Пронзающий удар</u>: ОД на действие {Math.round(pointOnBite*100+700)/100}, наносит обычный урон и снижает защиту, парирование и реакцию цели на 30% на 30 секунд, не складывается.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Мечи') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Мечи')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Нацеленный выпад</u> (изучается в гильдии воинов): ОД на действие {Math.round(pointOnBite*100+800)/100}, Атака {Math.round(atack*1.4)}</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Топоры') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Топоры')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Рассекающий удар</u>: ОД на действие {Math.round(pointOnBite*100+600)/100}, снижает устойчивость цели на 40% в момент удара.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Дубины') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Дубины')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Оглушающий удар</u>: ОД на действие {Math.round(pointOnBite*100+800)/100}, оглушает цель повышая од на действие на 3 на 40 секунд, не складывается сам с собой.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Копья') || (this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Копья')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Открытый выпад</u>: ОД на действие {Math.round(pointOnBite*100+500)/100}, , Атака {Math.round(atack*1.2)}, Урон {Math.round(minDamage*1.2)} - {Math.round(maxDamage*1.2)}</p>}
							{((this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Щиты')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Удар щитом</u>: ОД на действие {Math.round(pointOnBite*100+700)/100}, оглушает цель, повышая од на действие на 4 на 30 секунд и наносит обычный урон, не складывается сам с собой.</p>}
							{((this.props.thingOnPers['Оружие Слева'].kindOfThing === 'Щиты')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Щитовая оборона</u>: ОД на действие {Math.round(pointOnBite*100+500)/100}, повышает од на действие на 5 ({Math.round(pointOnBite*100+500)/100}), повышает броню ({Math.round(armor*1)}→{Math.round(armor*1.2)}) и защиту ({Math.round(defense*1)}→{Math.round(defense*1.2)}) на 20% и шанс блока щитом на 10 в течение 50 секунд.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Заряженный выстрел</u>: ОД на действие {Math.round(pointOnBite*100+300)/100}, Урон {Math.round(minDamage*0.8)} - {Math.round(maxDamage*0.8)}, Атака {Math.round(atack*0.7)}, Пробой брони {Math.round(armorPenetration*1.8)}</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Арбалеты')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Сквозной выстрел</u> (изучается в гильдии охотников): ОД на действие {Math.round(pointOnBite*100+700)/100}, пробив основную цель арбалетный болт также бьет в стоящих за ней врагов, первая дополнительная цель получает {Math.round(minDamage*0.75)} - {Math.round(maxDamage*0.75)} урона, вторая - {Math.round(minDamage*0.5)} - {Math.round(maxDamage*0.5)}. Для каждой цели проверяется попадание и шанс критического удара.</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Прицельный выстрел</u>: ОД на действие {Math.round(pointOnBite*100+300)/100}, Урон {Math.round(minDamage*0.7)} - {Math.round(maxDamage*0.7)}, Атака {Math.round(atack*1.5)}</p>}
							{((this.props.thingOnPers['Оружие Справа'].kindOfThing === 'Луки')) && <p style={{margin: 0, maxWidth: 500}}>*<u>Разделенный выстрел</u> (изучается в гильдии охотников): ОД на действие {Math.round(pointOnBite*100+900)/100}, Урон {Math.round(minDamage*0.7)} - {Math.round(maxDamage*0.7)}, Атака {Math.round(atack*0.7)}, магическим способом расщепляя стрелу, позволяет одним выстрелом поражать все враждебные цели на поле боя. Первая цель требует 10 маны, каждая последующая на 5 больше предыдущей.</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							{this.props.race === 'Вампир' && <>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}>ОД на действие (мышь): {(Math.round(pointOnBiteLocal*100-400)/100) < 5 ? 5 : (Math.round(pointOnBiteLocal*100-400)/100)} ({Math.round(pointOnBite*100-400)/100})</p>
							<p style={{margin: 0}}>ОД на действие (волк): {(Math.round(pointOnBiteLocal*100+300)/100) < 5 ? 5 : (Math.round(pointOnBiteLocal*100+300)/100)} ({Math.round(pointOnBite*100+300)/100})</p>
							<p style={{margin: 0}}>Урон (мышь): {Math.round(minDamage*1.2)} - {Math.round(maxDamage*1.2)}</p>
							</>}
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" m={2}/>
							<p style={{margin: 0}}><b>Характеристики:</b></p>
							<p style={{margin: 0}}>Сила: {power}</p>
							<p style={{margin: 0}}>Телосложение: {body}</p>
							<p style={{margin: 0}}>Выносливость: {stamina}</p>
							<p style={{margin: 0}}>Интеллект: {intell}</p>
							<p style={{margin: 0}}>Воля: {will}</p>
							<p style={{margin: 0}}>Ловкость: {dex}</p>
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							<p style={{margin: 0}}><b>Магическая сила:</b></p>
							{(powerOfDark > 0) && <p style={{margin: 0}}>Призыватель: {Math.round(powerOfDark)}</p>}
							{(powerOfLight > 0) && <p style={{margin: 0}}>Заклинатель: {Math.round(powerOfLight)}</p>}
							{(powerOfDestruction > 0) && <p style={{margin: 0}}>Разрушитель: {Math.round(powerOfDestruction)}</p>}
							{(darkSpellManaLowerCost > 0) && <p style={{margin: 0}}>Снижение затрат маны на Магию тьмы: {Math.round(10*darkSpellManaLowerCost)/10}%</p>}
							{(lightSpellManaLowerCost > 0) && <p style={{margin: 0}}>Снижение затрат маны на Магию света: {Math.round(10*lightSpellManaLowerCost)/10}%</p>}
							{(destrSpellManaLowerCost > 0) && <p style={{margin: 0}}>Снижение затрат маны на Магию стихии: {Math.round(10*destrSpellManaLowerCost)/10}%</p>}
							{(mindSpellManaLowerCost > 0) && <p style={{margin: 0}}>Снижение затрат маны на Магию разума: {Math.round(10*mindSpellManaLowerCost)/10}%</p>}
							{(magicDamage > 0) && <p style={{margin: 0}}>Дополнительный урон магией: {magicDamage}%</p>}
							{((destroyerSkills[1] + elementSkills[2]) > 0) && <p style={{margin: 0}}>Урон по монстрам, наносимый ударной стихийной магией: +{(destroyerSkills[1] + elementSkills[2])}%</p>}
							{(summons_ap_perc > 0) && <p style={{margin: 0}}>Снижение ОД на действие у призываемых существ на  {Math.round(summons_ap_perc)}%</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							{(powerOfDefiler > 0) && <p style={{margin: 0}}>Осквернитель: {Math.round(powerOfDefiler)}</p>}
							{(defilerSpellManaLowerCost > 0) && <p style={{margin: 0}}>Снижение затрат маны на Магию чумы: {Math.round(10*defilerSpellManaLowerCost)/10}%</p>}
							{((defilerSkills[2] + posionSkills[1]) > 0) && <p style={{margin: 0}}>Урон по монстрам, наносимый отравлениями чумной магии: +{(defilerSkills[2] + posionSkills[1])}%</p>}
							{(diseaseDuration > 0) && <p style={{margin: 0}}>Продолжительность болезней и сила призыва крыс: +{Math.round(diseaseDuration)}%</p>}
							{(plagueDoctorSkills[1] >= 1) && <p style={{margin: 0}}>Болезни, кроме основной цели, также накладываются на другого случайного врага</p>}
							{(plagueDoctorSkills[1] >= 2) && <p style={{margin: 0}}>Все крысы (кроме мелких) накладывают отравление {Math.round((100+powerOfDefiler*0.7))}/60 при успешных атаках</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							{(powerOfPray > 0) && <p style={{margin: 0}}>Вера: {Math.round(powerOfPray)}</p>}
							{(praySpellManaLowerCost > 0) && <p style={{margin: 0}}>Снижение затрат маны на Магию веры: {Math.round(10*praySpellManaLowerCost)/10}%</p>}
							{(double_cast_pray > 0) && <p style={{margin: 0}}>Можно использовать одновременно по 2 печати, благословения и молитвы в бою.</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							<p style={{margin: 0}}><b>Сила алхимии:</b></p>
							{(alch_damage > 0) && <p style={{margin: 0}}>Урон алхим. зелий: +{Math.round(alch_damage)}%</p>}
							{(alch_duration_power > 0) && <p style={{margin: 0}}>Продолжительность врем. эфф. алхим. зелий и эфф. их лечения: +{Math.round(alch_duration_power)}%</p>}
							{(alchemy_tired > 0) && <p style={{margin: 0}}>Снижение алхим. усталости: {Math.round(alchemy_tired)}</p>}
							{(alchemy_mana_reducer > 0) && <p style={{margin: 0}}>Снижение трат маны на алхимию: {Math.round(alchemy_mana_reducer)}%</p>}
							{(alchemy_reaction_power > 0) && <p style={{margin: 0}}>Усиление алхим. реакций: +{Math.round(alchemy_reaction_power)}%</p>}
							<p style={{margin: 0}}>Экономия алхим. зелий: {this.comparisonResult.alchemySaving}%</p>
							{(alchemy_self > 0) && <p style={{margin: 0}}>Эффективность алхим. зелий, накладываемых на себя: +{Math.round(alchemy_self)}%</p>}
							{(alch_damage_resist_reducer > 0) && <p style={{margin: 0}}>Алхим. зелья игнорируют {Math.round(alch_damage_resist_reducer)}% сопротивления цели</p>}
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							{(gloves_) && <p style={{margin: 0}}>Водяные зелья: +{Math.round(0.8*stamina+0.3*power)}%</p>}
							{(gloves_) && <p style={{margin: 0}}>Огненные зелья: +{Math.round(0.8*will+0.3*power)}%</p>}
							{(gloves_) && <p style={{margin: 0}}>Астральные зелья: +{Math.round(0.8*stamina+0.3*dex)}%</p>}
							{(gloves_) && <p style={{margin: 0}}>Темные зелья: +{Math.round(0.8*will+0.3*body)}%</p>}
							{(gloves_) && <p style={{margin: 0}}>Песчаные зелья: +{Math.round(0.8*intell+0.3*body)}%</p>}
							{(gloves_) && <p style={{margin: 0}}>Сияющие зелья: +{Math.round(0.8*intell+0.3*dex)}%</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							<p style={{margin: 0}}><b>Параметры:</b></p>
							<p style={{margin: 0}}>Крит. удар: {Math.round(criticalDamage)} | Крит.: x{Math.round(100*critKoeff)/100}</p>
							<p style={{margin: 0}}>Шанс вызвать кровотечение: {Math.round(blood_lose)}%</p>
							<p style={{margin: 0}}>Устойчивость: {Math.round(stability)} {stabilityOnCrypt > 0 && <span> (Подземелья: {stabilityOnCrypt})</span>}</p>
							
							{this.props.race === 'Вампир' && <>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}>Устойчивость (волк): {Math.round(stability*1.2)} {stabilityOnCrypt > 0 && <span> (Подземелья: {stabilityOnCrypt*1.2})</span>}</p>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							</>}
							
							<p style={{margin: 0}}>Пробой брони: {Math.round(armorPenetration)}. Урон по щиту брони: +{Math.round(armorPenetrationShield + armorPenetration/70)}%</p>
							<p style={{margin: 0}}>Парирование: {Math.round(parry)}. Макс. шанс: {Math.round(max_parry)}%</p>
							<p style={{margin: 0}}>Реакция: {Math.round(reaction)}</p>
							
							<p style={{margin: 0}}>Атака: {Math.round(atack)} {atackOnAir > 0 && <span>(Поверхность: {atackOnAir}, Подземелья: {atackOnCrypt})</span>}</p>
							
							{this.props.race === 'Вампир' && <>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}>Атака (мышь): {Math.round(atack*1.3)} {atackOnAir > 0 && <span>(Поверхность: {Math.round(atackOnAir*1.3)}, Подземелья: {Math.round(atackOnCrypt*1.3)})</span>}</p>
							<p style={{margin: 0}}>Атака (волк): {Math.round(atack*0.7)} {atackOnAir > 0 && <span>(Поверхность: {Math.round(atackOnAir*0.7)}, Подземелья: {Math.round(atackOnCrypt*0.7)})</span>}</p>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							</>}
							
							
							<p style={{margin: 0}}>Защита: {Math.round(defense)} {defenceOnAir > 0 && <span>(Поверхность: {defenceOnAir}, Подземелья: {defenceOnCrypt})</span>}</p>
							
							{this.props.race === 'Вампир' && <>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}>Защита (мышь): {Math.round(defense*0.6)} {defenceOnAir > 0 && <span>(Поверхность: {Math.round(defenceOnAir*0.6)}, Подземелья: {Math.round(defenceOnCrypt*0.6)})</span>}</p>
							<p style={{margin: 0}}>Защита (волк): {Math.round(defense*1.3)} {defenceOnAir > 0 && <span>(Поверхность: {Math.round(defenceOnAir*1.3)}, Подземелья: {Math.round(defenceOnCrypt*1.3)})</span>}</p>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							</>}
							
							
							<p style={{margin: 0}}>Броня: {Math.round(armor)} ({get_armor_resist_effect(armor)}% и щит: {Math.round(armor*10)}) 
							{hunterAvatarsVersus > 0 && <span> (Против аватаров: {armorOnAvatarsVersus} ({get_armor_resist_effect(armorOnAvatarsVersus)}%))</span>}
													 
							{armorOnCrypt > 0 && <span> (Подземелья: {armorOnCrypt} ({get_armor_resist_effect(armorOnCrypt)}%))</span>}</p>
														
							{this.props.race === 'Вампир' && <>
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							
							<p style={{margin: 0}}>Броня (мышь): {Math.round(armor*0.6)} ({get_armor_resist_effect(armor*0.6)}%)
														{hunterAvatarsVersus > 0 && <span> (Против аватаров: {Math.round(armorOnAvatarsVersus*0.6)} ({get_armor_resist_effect(armorOnAvatarsVersus*0.6)}%))</span>} 
														{armorOnCrypt > 0 && <span> (Подземелья: {Math.round(armorOnCrypt*0.6)} ({get_armor_resist_effect(armorOnCrypt*0.6)}%))</span>}</p>
							<p style={{margin: 0}}>Броня (волк): {Math.round(armor*1.2)} ({get_armor_resist_effect(armor*1.2)}%)
														{hunterAvatarsVersus > 0 && <span> (Против аватаров: {Math.round(armorOnAvatarsVersus*1.2)} ({get_armor_resist_effect(armorOnAvatarsVersus*1.2)}%))</span>} 
														{armorOnCrypt > 0 && <span> (Подземелья: {Math.round(armorOnCrypt*1.2)} ({get_armor_resist_effect(armorOnCrypt*1.2)}%))</span>}</p>
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							
							</>}
														
														
							<p style={{margin: 0}}>Сопротивление: {Math.round(resists)} ({get_armor_resist_effect(resists)}% и щит: {Math.round(resists*10 * (1 + resistauraSkills[2] * this.props.allSkills.resistauraSkills / 100))})  
										{hunterAvatarsVersus > 0 && <span> (Против аватаров: {resistOnAvatarsVersus} ({get_armor_resist_effect(resistOnAvatarsVersus)}%))</span>} 
										{resistOnCrypt > 0 && <span> (Подземелья: {resistOnCrypt} ({get_armor_resist_effect(resistOnCrypt)}%))</span>}</p>
							{this.props.race === 'Вампир' && <>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							<p style={{margin: 0}}>Сопротивление (волк): {Math.round(resists*1.2)} ({get_armor_resist_effect(resists*1.2)}%)
										{hunterAvatarsVersus > 0 && <span> (Против аватаров: {Math.round(resistOnAvatarsVersus*1.2)} ({get_armor_resist_effect(resistOnAvatarsVersus*1.2)}%))</span>} 
										{resistOnCrypt > 0 && <span> (Подземелья: {Math.round(resistOnCrypt*1.2)} ({get_armor_resist_effect(resistOnCrypt*1.2)}%))</span>}</p>
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle"/>
							</>}
											
							<p style={{margin: 0}}>Очки действия: {Math.round(pointsOfAction)}</p>
							
							<p style={{margin: 0}}>Восстановление Здоровья в мин: {Math.round(regenerationHP)} (полн. реген.: {Math.round(HP/regenerationHP)} мин.)</p>
							<p style={{margin: 0}}>Восстановление Маны в мин.: {Math.round(regenerationMP)} (полн. реген.: {Math.round(MP/regenerationMP)} мин.)</p>
							<p style={{margin: 0}}>Занято вещами/Переносимый вес: {Math.round(weight_occupato)}/{Math.round(weight)}</p>
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							{(expirienceInBattle > 0) && <p style={{margin: 0}}>Увеличение опыта в боях: {Math.round(expirienceInBattle)}%</p>}
							
							{this.props.clan !== 'Нет' && (this.props.clanGlory == null || this.props.clanPosition == null) &&
								<p style={{margin: 0, color: '#b45f14'}}><b>Клановая слава не рассчитана:</b> укажите славу и позицию в разделе персонажа.</p>}
							{golemSupport > 0 && <p style={{margin: 0}}><b>Голем, Поддержка:</b> +{golemSupport}% к основным параметрам (предварительный расчёт).</p>}
							{this.props.clanGlory > 0 && this.props.clanPosition != null && <>
								<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
								<p style={{margin: 0}}><b>Клановая слава:</b> {this.props.clanGlory}% · позиция {this.props.clanPosition} · применяется {(koeffClansGlory * 100).toFixed(2)}%</p>
								{Object.entries(clanBonuses).map(([label, value]) => (
									<p key={label} style={{margin: 0}}>
										{label}: {Array.isArray(value)
											? `+${Math.round(value[0])} — +${Math.round(value[1])}`
											: `+${Math.round(value)}`}
									</p>
								))}
							</>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							<p style={{margin: 0}}><b>Вторичные параметры:</b></p>
							{(evasion > 0) && <p style={{margin: 0}}>Доп. шанс уклонения: +{Math.round(evasion)}%</p>}
							{(magicEvasion > 0) && <p style={{margin: 0}}>Шанс увернуться от заклинания: {Math.round(magicEvasion)}%</p>}
							{(doubleChance > 0) && <p style={{margin: 0}}>Вероятность двойного удара: {Math.round(doubleChance)}%</p>}
							
							
							{shieldOn && <p style={{margin: 0}}>Вероятность отбить контактную атаку щитом: {Math.round(shieldBlock -20) > 75 ? 75 : Math.round(shieldBlock -20)}%</p>}
							{shieldOn && <p style={{margin: 0}}>Вероятность отбить арбалетную атаку щитом: {Math.round(shieldBlock -10) > 75 ? 75 : Math.round(shieldBlock -10)}%</p>}
							{shieldOn && <p style={{margin: 0}}>Вероятность отбить стрелковую атаку щитом: {Math.round(shieldBlock -0) > 75 ? 75 : Math.round(shieldBlock -0)}%</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							<p style={{margin: 0}}>Поглощение урона: {Math.round(resistDamage)}%</p>
							<p style={{margin: 0}}>Сопротивление временным эффектам: {Math.round(resistTempraryEffects)}%</p>
							<p style={{margin: 0}}>Снижение отраж. урона: {Math.round(reflectResist)}%</p>
							
							{(damageBySummonersBeast > 0) && <p style={{margin: 0}}>Урон по призванным монстрам: +{Math.round(damageBySummonersBeast)}%</p>}
							{(rage100FromComplects > 0) && <p style={{margin: 0}}>Ярость в начале боя: {Math.round(rage100FromComplects)}</p>}
							{(rageSpeed > 0) && <p style={{margin: 0}}>Скорость накопления ярости: +{Math.round(rageSpeed)}%</p>}
							{(want_life > 0) && <p style={{margin: 0}}>Жажда жизни: {(want_life == 1) ? 'первые 90 секунд боя' : (want_life == 2) ? 'весь бой' : ''}. Исцеляет [{this.props.level*5}, {this.props.level*10}, {this.props.level*15}, {this.props.level*20}]</p>}
							{(light_defence > 0) && <p style={{margin: 0}}>Оберег света первые 40 секунд боя</p>}
							{(this.props.race === 'Торен') && <p style={{margin: 0}}>Активный эффект Последний шанс в каждом бою.</p>}
							{(vampire_power_percent > 0) && <p style={{margin: 0}}>Вампиризм: {Math.round(10*vampire_power_percent)/10}%+{vampire_power_abs}</p>}
							{(equipmentMagicalVampirism + (breachTotals.magicalVampirism || 0) > 0) && <p style={{margin: 0}}>Магический вампиризм: {Math.round(10*(equipmentMagicalVampirism + (breachTotals.magicalVampirism || 0)))/10}%</p>}
							{(breachTotals.startAp > 0) && <p style={{margin: 0}}>Накопленные ОД в начале боя: +{breachTotals.startAp}</p>}
							{(breachTotals.summonsStartAp > 0) && <p style={{margin: 0}}>Начальные ОД призванных существ: +{breachTotals.summonsStartAp}</p>}
							{(breachTotals.resistanceIgnore > 0) && <p style={{margin: 0}}>Игнорирование сопротивления целей: +{breachTotals.resistanceIgnore}%</p>}
							{(breachTotals.temporaryResistanceIgnore > 0) && <p style={{margin: 0}}>Игнорирование сопротивления временному урону: +{breachTotals.temporaryResistanceIgnore}%</p>}
							{(breachTotals.alchemySaving > 0) && <p style={{margin: 0}}>Экономия алхимических зелий: +{breachTotals.alchemySaving}%</p>}
							{(fireskin_power_percent > 0) && <p style={{margin: 0}}>Огненная кожа возвращает {Math.round(fireskin_power_percent)}%+{fireskin_power_abs} урона</p>}
							{(false && ((vampireSkills[2] > 0) || (this.props.race === 'Вампир'))) && <p style={{margin: 0}}>Вамп. работает и на невоспр. к вамп. целях со штрафом.</p>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							{(specialSkillsRace !== '') && <p style={{margin: 0}}>Особый навык: {specialSkillsRace}</p>}
							{(highFormSpecial !== '') && highFormSpecial}
							{activeBreachRunes.length > 0 && <>
								<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
								<p style={{margin: 0}}><b>Руны Разлома:</b></p>
								{activeBreachRunes.map((rune, index) => <p key={`${rune.id}-${index}`} style={{margin: 0}}>
									{rune.name}: {rune.description}
								</p>)}
							</>}
							
							<Divider style={{marginTop: 5, marginBottom: 5}} variant="middle" />
							
							{this.props.profession !== 'Нет' && <p style={{margin: 0}}>{this.props.profession}</p>}
							{(professionSpecial !== '') && professionSpecial}


							
						</div>
				<Snackbar
					open={this.state.open}
					onClose={this.handleClose.bind(this)}
					autoHideDuration={700}
					message="Успешно скопировано"
				  />
			</div>
		)
	};
};


const mapStateToProps = (state) => {
	
    return {
		level: state.levelChange,
		powerChange: state.powerChange,
		bodyChange: state.bodyChange,
		dexChange: state.dexChange,
		intellChange: state.intellChange,
		staminaChange: state.staminaChange,
		willChange: state.willChange,
		allSkills: state.allSkills,
		allSkillsMaster: state.allSkillsMaster,
		changeSkills: state.changeSkills,
		changeEquip: state.changeEquip,
		race: state.race,
		thingOnPers: state.thingOnPers,
		religion: state.religion,
		religionData: state.religionData,
		clanPosition: state.clanPosition,
		clanGlory: state.clanGlory,
		clansArtSword: state.clansArtSword,
		clansArtSphere: state.clansArtSphere,
		clansArtRune: state.clansArtRune,
		clansArtMask: state.clansArtMask,
		turnireRune: state.turnireRune,
		profession: state.profession,
		professionLevel: state.professionLevel,
		clan: state.clan,
		fractionReputation: state.fractionReputation,
		modifireThings: state.modifireThings,
		runesChange: state.runesChange,
		charBless: state.charBless,
		lifeBless: state.lifeBless,
		golem: state.golem,

    }
}

export default connect(mapStateToProps)(Result);


