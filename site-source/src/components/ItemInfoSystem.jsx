import React from 'react';
//import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
//import Switch from '@material-ui/core/Switch';

//import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
//import Badge from '@material-ui/core/Badge';
//import FormGroup from '@material-ui/core/FormGroup';

//import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Grid } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIconModule from '@material-ui/icons/Warning';
const WarningIcon = WarningIconModule.default?.default || WarningIconModule.default || WarningIconModule;


//import ToggleButton from '@material-ui/lab/ToggleButton';
//import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import { breachRunes, findBreachRune } from '../data/breachRunes';
import { runesAll, runesWordAll, runeWordBonuses } from '../data/runes';

// Отображаем изображение Вещи, надетой на аватара
export class ItemInfoSystem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			seeItem: 'Описание',
			typeOfRune: 'Первого порядка',
			open: false,
			content: `Вы не можете установить новую Руну - в данной вещи все слоты под Руны уже заняты. Освободите один из слотов.`,
			girThing: 0
		};
	}

	getRuneLimit() {
		return this.props.thingInFoxus.runeSlots || (this.props.thingInFoxus.artifact ? 15 : 10);
	}

	changeBreachRune(value) {
		this.props.dispatch({
			type: 'Изменить руну Разлома',
			typeThing: this.props.type,
			rune: value,
		});
	}

	getRuneLimitFor(typeThing) {
		const item = this.props.thingOnPers[typeThing] || {}
		return item.runeSlots || (item.artifact ? 15 : 10)
	}

	getRuneWordTotal(word, runeWordBonuses) {
		if (!word) return {}
		// runeWordBonuses already contains the word bonus and every rune in it.
		return {...(runeWordBonuses[word] || {})}
	}

	applyRuneSetupToAll(mode, runesAll, runeWordBonuses) {
		const source = this.props.modifireThings[this.props.type]
		const sourceSingles = source.runes.replace(source.runeWord || '', '')
		const confirmed = window.confirm(
			mode === 'word'
				? 'Заменить рунное слово на всех надетых вещах? При нехватке слотов лишние одиночные руны будут убраны.'
				: 'Установить такое же количество обычных рун на всех надетых вещах? Лимит слотов каждой вещи будет соблюдён.'
		)
		if (!confirmed) return

		for (const [typeThing, target] of Object.entries(this.props.modifireThings)) {
			if (typeThing === this.props.type || this.props.thingOnPers[typeThing]?.name === 'Нет') continue
			const limit = this.getRuneLimitFor(typeThing)

			if (mode === 'word' && (source.runeWord || '').length <= limit) {
				let overflow = Math.max(0, target.runes.replace(target.runeWord || '', '').length + (source.runeWord || '').length - limit)
				if (overflow > 0) {
					for (const [rune, [parameter, bonus]] of Object.entries(runesAll)) {
						const currentCount = target.runes.replace(target.runeWord || '', '').split(rune).length - 1
						const removeCount = Math.min(currentCount, overflow)
						if (removeCount <= 0) continue
						this.props.dispatch({
							type: 'Установить количество рун',
							typeThing,
							rune,
							parameter,
							bonus,
							count: currentCount - removeCount,
							limit,
						})
						overflow -= removeCount
						if (overflow === 0) break
					}
				}
				this.props.dispatch({
					type: `Добавить РС ${source.runeWord || ''}|${typeThing}`,
					bonuses: this.getRuneWordTotal(source.runeWord, runeWordBonuses, runesAll),
					bonusesMinus: this.getRuneWordTotal(target.runeWord, runeWordBonuses, runesAll),
					oldRune: target.runeWord || '',
				})
			}

			if (mode === 'runes') {
				for (const [rune, [parameter, bonus]] of Object.entries(runesAll)) {
					this.props.dispatch({
						type: 'Установить количество рун',
						typeThing,
						rune,
						parameter,
						bonus,
						count: sourceSingles.split(rune).length - 1,
						limit,
					})
				}
			}
		}
	}

	applyBreachRuneToAll() {
		const rune = this.props.modifireThings[this.props.type].breachRune || ''
		if (!window.confirm('Применить выбранную руну Разлома ко всем надетым вещам?')) return
		for (const typeThing of Object.keys(this.props.modifireThings)) {
			if (this.props.thingOnPers[typeThing]?.name === 'Нет') continue
			this.props.dispatch({ type: 'Изменить руну Разлома', typeThing, rune })
		}
	}
	
	// Закрытие всплывающего окна
	snackbarlose(e) {
//		console.log('Окно')
		this.setState({
			open: !this.state.open
		})

	}
	
	// МОдификация вещей
	changeMode (e, mode, currentMode, typeThing) {
//		console.log(typeof(e.target.value*1))
		if (typeof(e.target.value*1) === 'number') {
			
		
			// Определяем разницу, её и отправим
			let div = e.target.value*1 - currentMode

	//		console.log(div)
			this.props.dispatch({
			  type: 'МФ',
				typeThing: typeThing,
				div: div,
				mode: mode,
			});
			// Отправляем значение в redux
			//Сначала мы должны понять, сколько прямо сейчас МФ у вещи
		}

	}
	// Имзеняем количество рун
	changeRune(e, v, w, d1, d2, oldRune, type, count, runeWord) {
		
		var action = ""
		
		if (type === 'Переключение') {
			// Вверх-вниз
		
			if (e.target.value*1 === 0) {
				// Уменьшаем на 1 РС

				// По сути мы должны отправить минус и нулевую РС
				v = ''
				action = `Добавить РС ${v}|${w}`
				this.props.dispatch({
				  type: action,
					bonuses: {},
					bonusesMinus: d2,
					oldRune: oldRune,
				});
				
				
			} else if (e.target.value*1 === 1) {
				
				
				// Добавляем 1 руну
				// Для начала проверим, не выйдет ли количество рун за предел
				if ((count.length -oldRune.length+v.length) > this.getRuneLimit()) {
					this.setState({
						open: !this.state.open,
						content: `Вы не можете установить данное Рунное слово в вещь - Вам не хватает ${type.length -oldRune.length+v.length-this.getRuneLimit()} ячейки под руны`
					})
				} else {

					action = `Добавить РС ${v}|${w}`
					this.props.dispatch({
					  type: action,
						bonuses: d1,
						bonusesMinus: d2,
						oldRune: oldRune,
					});
				}
				 
				
			} else {
				console.log('РС и так уже много')
			}
		} else if (type === 'Переключение рун') {
			const requestedCount = Number.parseInt(e.target.value || 0, 10)
			this.props.dispatch({
				type: 'Установить количество рун',
				typeThing: w,
				rune: v,
				parameter: d1,
				bonus: d2,
				count: requestedCount,
				limit: this.getRuneLimit(),
			})
		} else if (v !== 'Изменить ') {
			
			console.log('Здесь')
			// Суммирование одно из рун
			if (v.length === 1) {
				
				if (oldRune.length === this.getRuneLimit()) {
					// Места под руну нет
					this.setState({
						open: !this.state.open,
						content: `Вы не можете установить новую Руну - в данной вещи все слоты под Руны уже заняты. Освободите один из слотов.`
					})

				} else {
					// РУна
					action = `Добавить руну ${v}|${w}|${d1}|${d2}`
					this.props.dispatch({
					  type: action
					});
				}
				
			} else {
				
				// Мы должны изъять одно рунное слово и заменить его дргугим
				// Для начала проверим, не выйдет ли количество рун за предел
				if ((type.length -oldRune.length+v.length) > this.getRuneLimit()) {
					this.setState({
						open: !this.state.open,
						content: `Вы не можете установить данное Рунное слово в вещь - Вам не хватает ${type.length -oldRune.length+v.length-this.getRuneLimit()} ячейки под руны`
					})
				} else {
					action = `Добавить РС ${v}|${w}`
					this.props.dispatch({
					  type: action,
						bonuses: d1,
						bonusesMinus: d2,
						oldRune: oldRune,
					});
				}

				
			}
			
		} 
		
		
		
//		else {
//			this.props.dispatch({
//			  type: v + w,
//				data: e.target.value
//			});
//		}
		
	}
	
	
	// Тип просмотра вещи
	changeSeeItem (e) {
		this.setState({
			seeItem: e.target.value
		})
	}
	// Тип просмотра рун
	changeTypeOfRune (e) {
		this.setState({
			typeOfRune: e
		})
	}
	
	render() {

		// Сама вещь, с учетом всех модификаций. Именно выбранная вещь
		var modifireThing = this.props.modifireThings[this.props.type]
		const currentBreachRune = findBreachRune(modifireThing.breachRune || '')
		const currentBreachRuneName = currentBreachRune?.name
			|| modifireThing.breachRuneName?.replace(/^Руна\s+/i, '')
			|| (modifireThing.breachRune ? modifireThing.breachRune.toUpperCase() : '')
		
//		console.log('Вещь с учетом МФ')
//		console.log(modifireThing)
//		console.log('Вещь без учета мф (чистая)')
//		console.log(this.props.thingInFoxus)
		// Извлекаем руны
		var runes = modifireThing.runes.split('')
		var runesModifire = {
			'ОД на действие': 0, 
			'здоровье': 0,
			'мана': 0,
			'атака': 0,
			'защита': 0,
			'броня': 0,
			'пробой брони': 0,
			'устойчивость': 0,
			'ОД макс.': 0,
			'реакция': 0,
			'восстановление маны': 0,
			'восстановление здоровья': 0,
			'крит. удар': 0,
			'крит. урон': 0,
			'сопротивление': 0,
			'парирование': 0,
			'призыватель': 0,
			'заклинатель': 0,
			'разрушитель': 0,
			'осквернитель': 0,
			'Сила': 0,
			'Телосложение': 0,
			'Ловкость': 0,
			'Интеллект': 0,
			'Выносливость': 0,
			'Воля': 0,
			"поглощение урона": 0,
			"сопрот. врем. эффектам": 0,
			"контрудар": 0,
			"уклон. магии": 0,
			"уклон.": 0
		}
		var runeWord = modifireThing.runeWord
		
		// Разбираем руны
		var runesTypeState = {
			'Первого порядка':0 ,
			'Второго порядка':0 ,
			'Третьего порядка':0
		}

		for (var r = 0; r<runes.length; r++) {
			
			for (var rr in runesAll) {
				if (runes[r] === rr) {
					runesModifire[runesAll[rr][0]] += runesAll[rr][1]
					runesTypeState[runesAll[rr][2]] += 1
				}
			}
			
		}
		
		// Смотри рунное слово конкретно у данного оружия
		if (runeWord!=='') {

			for (var i in runesWordAll[runeWord]) {
				runesModifire[i] += runesWordAll[runeWord][i]
			}
		}

//		console.log(this.props.thingInFoxus.parametrs['мана'])
//		console.log(this.props.stoic.parametrs['мана'])

		const characteristics = ['powerItem', 'bodyItem', 'dexItem', 'intellItem', 'staminaItem', 'willItem']
		const characteristicsName = ['Сила', 'Телосложение', 'Ловкость', 'Интеллект', 'Выносливость', 'Воля']
		
		const parametrs = ['ОД на действие', 'здоровье', 'мана', 'атака', 'защита', 'броня', 'пробой брони', 
						   'устойчивость', 'ОД макс.', 'реакция', 'восстановление маны', 'восстановление здоровья', 'крит. удар', 'сопротивление', 'парирование', 'призыватель', 'заклинатель', 'разрушитель', 'осквернитель', "крит. урон", "поглощение урона", "сопрот. врем. эффектам", "контрудар", "уклон. магии", "уклон."];
		return(
			<>
				<Grid
				  container
				  direction="column"
				  justify="flex-start"
				  alignItems="stretch"
				  style={{backgroundColor: 'rgba(214, 214, 214, 0.26)'}}
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
									<Badge badgeContent={this.props.thingInFoxus.needlvl} color={(this.props.thingInFoxus.needlvl <= this.props.levelChange) ? 'primary' : 'secondary'}>

									  <Avatar>
										<img src={this.props.thingInFoxus.imgUrl} alt={this.props.thingInFoxus.name}/>
									  </Avatar>
										</Badge>
									</ListItemAvatar>
									<ListItemText 
										primary={this.props.thingInFoxus.name}
										secondary={

											<span>{(this.props.thingInFoxus.complect === 'Нет') ? 'Некомплектный' :
													<b>
														<span data-tooltip-id={this.props.thingInFoxus.complect}> 
															{this.props.thingInFoxus.complect}
														</span>
														<ReactTooltip wrapper='span' style={{width: 300}} id={this.props.thingInFoxus.complect} place="left" type="info" effect='solid'>
															<span>Нехватка очков характеристик</span>
															<span  style={{whiteSpace: 'pre-line', width: 300, display: 'block'}}>
																2 вещи: Атака +70, здоровье +800
																3 вещи: Сопротивляемость +110
																4 вещи: Броня +150
																5 вещей: Устойчивость + 70
																6 вещей: Атака +140, здоровье +1600
																7 вещей: Ярость +30
																8 вещей: -4 ОД на действие
																9 вещей: Урон +230
																10 вещей: Доступен крит. удар х4, крит +60
															</span>

														</ReactTooltip>
													</b>}
											</span>
										}/>
							  </ListItem>
							</Grid>
							<Grid item style={{paddingTop: 14, paddingRight: 25}}>
								<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right'}}>
									{this.props.thingInFoxus.kindOfThing}
								 </Typography>
								 <Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right'}}>
									Тип: {this.props.thingInFoxus.typeThing}
								 </Typography>
								<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right'}}>
									Вес: {this.props.thingInFoxus.weight}
								 </Typography>


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
								<Box color={(this.props.thingInFoxus.costType === 'Цена покупки (золото)') ? "error.main" : "text.secondary" }>
									<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'left', margin: 0}}>
										{this.props.thingInFoxus.costType + ': ' + this.props.thingInFoxus.cost}
									 </Typography>
								</Box>
							</Grid>
							<Grid item>
								<Typography variant="caption" display="block" gutterBottom style={{textAlign: 'right', margin: 0}}>
									(?) Прочность: {this.props.thingInFoxus.durability}
								 </Typography>
							</Grid>
						</Grid>

					</Grid>

				</Grid>
			<Divider/>
						<Grid
						  container
						  direction="row"
						  justify="space-around"
						  alignItems="flex-start"
						>
						
						<Grid 
				   			container
						  direction="row"
						  justify="space-between"
						  alignItems="flex-start">
						  	<Grid item>
						  		<p style={{marginTop: 15}}>Установлено рун: {modifireThing.runes.length}/{this.getRuneLimit()}<br></br>
						  		Рунных слов: {modifireThing.runeWord.length>0 ? 1 : 0}/1<br></br>
								Рун Разлома: {modifireThing.breachRune ? 1 : 0}/1
								{currentBreachRuneName ? ` · ${currentBreachRuneName}` : ''}</p>
						  		
						  	</Grid> 	
						  	
						  	<Grid item>
						  		<FormControl className='m-2' style={{minWidth: 120}}>
									<InputLabel htmlFor="type-complect">Режим</InputLabel>
									<Select
										onChange={(e) => this.changeSeeItem(e)}
										value={this.state.seeItem}
										inputProps={{
										  name: 'Тип',
										  id: 'type-complect',
										}}
									>
										<MenuItem value={'Описание'}>Описание</MenuItem>
										<MenuItem value={'Модификация'}>Модификация</MenuItem>
										<MenuItem value={'Установка рун'}>Установка рун</MenuItem>
										<MenuItem value={'Руна Разлома'}>Руна Разлома</MenuItem>
										<MenuItem value={'Оригинал'}>Оригинал</MenuItem>

									</Select>
							  </FormControl>
						  		
						  	</Grid>
							
						</Grid>
						{this.state.seeItem === 'Установка рун' && <>
			
							<Grid 
							  container
							  direction="row"
							  justify="space-between"
						  	alignItems="center">
							  	<Grid xs = {4} item>
									<Button 
									onClick={(e) => this.changeTypeOfRune('Первого порядка')}
									fullWidth variant={this.state.typeOfRune === 'Первого порядка' ? 'outlined' : 'text'} color="primary" aria-label="delete">
									
									<Badge badgeContent={runesTypeState['Первого порядка']> 0 ? runesTypeState['Первого порядка'] : '0'} color={'primary'}>
										<Avatar alt="Тип 1" src="https://chaosage.ru/images/runes/c.gif"/>
									</Badge>
										Тип 1
									  </Button>
								  
								</Grid>
								<Grid xs = {4} item>
									<Button 
									onClick={(e) => this.changeTypeOfRune('Второго порядка')}
									fullWidth variant={this.state.typeOfRune === 'Второго порядка' ? 'outlined' : 'text'} color="primary" aria-label="delete">
									<Badge badgeContent={runesTypeState['Второго порядка']> 0 ? runesTypeState['Второго порядка'] : '0'} color={'primary'}>
										<Avatar alt="Тип 2" src="https://chaosage.ru/images/runes/b.gif"/>
									</Badge>
										Тип 2
									  </Button>
								  
								</Grid>
								<Grid xs = {4} item>
									<Button 
									onClick={(e) => this.changeTypeOfRune('Третьего порядка')}
									fullWidth variant={this.state.typeOfRune === 'Третьего порядка' ? 'outlined' : 'text'} color="primary" aria-label="delete">
									<Badge badgeContent={runesTypeState['Третьего порядка']> 0 ? runesTypeState['Третьего порядка'] : '0'} color={'primary'}>
										<Avatar alt="Тип 3" src="https://chaosage.ru/images/runes/a.gif"/>
									</Badge>
										Тип 3
									  </Button>
								  
								</Grid>
								<Grid xs = {12}  item style={{marginTop: 15, marginBottom: 15}}>
									<Button 
									onClick={(e) => this.changeTypeOfRune('Рунные слова')}
									fullWidth variant={this.state.typeOfRune === 'Рунные слова' ? 'outlined' : 'text'} color="primary" aria-label="delete">
									<Badge badgeContent={modifireThing.runeWord.length > 0 ? 1 : '0'} color={'primary'}>
										<Avatar style={{marginRight: 10}} alt="РС" src="https://chaosage.ru/images/runeWords/STOrm.gif"/>
									</Badge>
										Рунные слова
									  </Button>
								  
								</Grid>
							</Grid>
							<Grid container spacing={1} style={{marginBottom: 10}}>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										variant="outlined"
										color="primary"
										onClick={() => this.applyRuneSetupToAll('runes', runesAll, runeWordBonuses)}
									>
										Руны → на все вещи
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										variant="outlined"
										color="primary"
										onClick={() => this.applyRuneSetupToAll('word', runesAll, runeWordBonuses)}
									>
										Рунное слово → на все
									</Button>
								</Grid>
							</Grid>
		
							<List dense={true} style={{maxHeight: 450, overflowY: 'scroll'}}>
				  				{this.state.typeOfRune === 'Рунные слова' && <>
									{Object.keys(runeWordBonuses).map((char) =>
											  <React.Fragment key={char}>
												<ListItem  
													dense={true}
													button 
													alignItems="flex-start"  
													selected={(modifireThing.runeWord.split(char).length-1) === 1}
													onClick={(e) => this.changeRune(e, char, this.props.type, this.getRuneWordTotal(char, runeWordBonuses, runesAll), this.getRuneWordTotal(modifireThing.runeWord, runeWordBonuses, runesAll), modifireThing.runeWord, modifireThing.runes)}>
													<ListItemAvatar>
													  <Avatar alt={char} src={`https://chaosage.ru/images/runeWords/${runeWordBonuses[char].url}.gif`} />
													</ListItemAvatar>
													<ListItemText
													  primary={`Рунное слово ${char.toUpperCase()}`}
													style={{marginRight: 70}}
													  secondary={
														<React.Fragment >
														  <Typography
															component="span"
															variant="body2"
															
															color="textPrimary"
														  >
															Параметры: 
														  </Typography>
														  {Object.keys(runeWordBonuses[char]).filter(r => r !== 'url').map((param) =>
															<React.Fragment key={param}>
																<> {param}: {runeWordBonuses[char][param]>0 ? ('+' +Math.round(10*runeWordBonuses[char][param])/10) : Math.round(10*runeWordBonuses[char][param])/10},</>
															</React.Fragment>
														 )}
														</React.Fragment>
													  }
													/>

														<ListItemSecondaryAction >
														  <TextField
																fullWidth={true}
																
																label={'Кол-во'}
																edge="end"
																value = {modifireThing.runeWord.split(char).length-1}
																onChange={(e) => this.changeRune(e, char, this.props.type, this.getRuneWordTotal(char, runeWordBonuses, runesAll), this.getRuneWordTotal(modifireThing.runeWord, runeWordBonuses, runesAll), modifireThing.runeWord, 'Переключение', modifireThing.runes)}
																type="number"
																inputProps={{'min': 0, 'max': this.getRuneLimit()}}
																InputLabelProps={{
																  shrink: true,
																}}
																margin="dense"
																variant="outlined"
															  />
														</ListItemSecondaryAction>
													</ListItem>
												<Divider variant="inset" component="li" />
											</React.Fragment>
													  
								  )}
									
			
								</>}
				  				{Object.keys(runesAll).filter(r => runesAll[r][2]===this.state.typeOfRune).map((char) =>
									   <React.Fragment key={char}>
												<ListItem  
													dense={true}
													button 
													alignItems="flex-start"  
													selected={(modifireThing.runes.replace(modifireThing.runeWord,"").split(char).length-1) >= 1}
													onClick={(e) => this.changeRune(e, char, this.props.type, runesAll[char][0], runesAll[char][1], modifireThing.runes)}>
													<ListItemAvatar>
													  <Avatar alt={char} src={`https://chaosage.ru/images/runes/${char}.gif`} />
													</ListItemAvatar>
													<ListItemText
													  primary={`Руна ${char.toUpperCase()}`}
													style={{marginRight: 70}}
													  secondary={
														<React.Fragment >
														  <Typography
															component="span"
															variant="body2"
															
															color="textPrimary"
														  >
															Параметры: 
														  </Typography>
														  {' ' + runesAll[char][0] + ' ' + ((runesAll[char][1] > 0) ? ('+' + runesAll[char][1]) : runesAll[char][1])}
														</React.Fragment>
													  }
													/>

														<ListItemSecondaryAction >
														  <TextField
																fullWidth={true}
																
																label={'Кол-во'}
																edge="end"
																value = {modifireThing.runes.replace(modifireThing.runeWord,"").split(char).length-1}
																onChange={(e) => this.changeRune(e, char, this.props.type, runesAll[char][0], runesAll[char][1], modifireThing.runes, 'Переключение рун', modifireThing.runes.replace(modifireThing.runeWord,"").split(char).length-1, modifireThing.runeWord)}
																type="number"
																inputProps={{'min': 0, 'max': this.getRuneLimit()}}
																InputLabelProps={{
																  shrink: true,
																}}
																margin="dense"
																variant="outlined"
															  />
														</ListItemSecondaryAction>
													</ListItem>
												<Divider variant="inset" component="li" />
											</React.Fragment>
								)}
							  
							</List>
			
						</>
						}
						{this.state.seeItem === 'Руна Разлома' && <div style={{width: '100%', padding: 16}}>
							<Typography variant="h6">Руна Разлома</Typography>
							<Typography variant="body2" style={{marginBottom: 14}}>
								В одну вещь можно установить одну руну Разлома независимо от обычных рун и рунного слова.
								После установки она действует 180 дней. Описания взяты из официального FAQ.
							</Typography>
							<FormControl fullWidth variant="outlined">
								<InputLabel>Выберите руну</InputLabel>
								<Select
									value={modifireThing.breachRune || ''}
									onChange={(event) => this.changeBreachRune(event.target.value)}
									label="Выберите руну"
								>
									{modifireThing.breachRune && !currentBreachRune && (
										<MenuItem value={modifireThing.breachRune}>{currentBreachRuneName}</MenuItem>
									)}
									{breachRunes.map((rune) => (
										<MenuItem key={rune.id || 'none'} value={rune.id}>{rune.name}</MenuItem>
									))}
								</Select>
							</FormControl>
							{modifireThing.breachRune && (
								<div style={{display: 'flex', gap: 14, alignItems: 'center', marginTop: 18}}>
									<Avatar
										alt={currentBreachRuneName}
										src={modifireThing.breachRuneImage || `https://chaosage.ru/images/runes/br_${modifireThing.breachRune}.png`}
									/>
									<div>
										<Typography><strong>Установлена: {currentBreachRuneName}</strong></Typography>
										<Typography>{currentBreachRune?.description || modifireThing.breachRuneDescription || 'Описание руны пока недоступно.'}</Typography>
										{modifireThing.breachRuneImported && <Typography variant="caption">Загружено из игрового API.</Typography>}
									</div>
								</div>
							)}
							<Button
								style={{marginTop: 16, marginRight: 12}}
								variant="outlined"
								color="primary"
								disabled={!modifireThing.breachRune}
								onClick={() => this.applyBreachRuneToAll()}
							>
								Руна Разлома → на все вещи
							</Button>
							<a
								href="https://chaosage.ru/help.php?section=22"
								target="_blank"
								rel="noreferrer"
								style={{display: 'inline-block', marginTop: 16, color: '#7ee6cc'}}
							>
								Открыть раздел «Разломы» в FAQ
							</a>
						</div>}
						{this.state.seeItem === 'Оригинал' && <>
						<Grid item>
					  	
						  <h6>
							Требования
						  </h6>
							<List dense={true} style={{minWidth: 140, padding:0,paddingBottom:15}}>
								<ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Уровень"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needlvl}
								  </ListItemSecondaryAction>
								</ListItem>
								{this.props.thingInFoxus.needPower > 0 && <ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Сила"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needPower}
								  </ListItemSecondaryAction>
								</ListItem>
								}
							  {this.props.thingInFoxus.needBody > 0 && <ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Телосложение"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needBody}
								  </ListItemSecondaryAction>
								</ListItem>
								}
							  {this.props.thingInFoxus.needDex > 0 && <ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Ловкость"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needDex}
								  </ListItemSecondaryAction>
								</ListItem>
								}
							</List>
						</Grid>
							<>
								{(this.props.thingInFoxus.powerItem !== 0 ||
								this.props.thingInFoxus.bodyItem !== 0 ||
								this.props.thingInFoxus.dexItem !== 0 ||
								this.props.thingInFoxus.intellItem !== 0 ||
								this.props.thingInFoxus.staminaItem !== 0 ||
								this.props.thingInFoxus.willItem !== 0) &&
									<Grid item>
									  <h6>
										Характеристики
									  </h6>
										<List dense={true}  style={{minWidth: 140, padding:0, paddingBottom:15}}>
										
										{characteristics.map((item, i) => {
										  return (
											  <div key={item} >
												{this.props.thingInFoxus[item] !== 0 && <ListItem  style={{margin:0, padding: 0}}>
													  <ListItemText
														primary={characteristicsName[i]}
														style={{margin:0, padding: 0}}
													  />
													  <ListItemSecondaryAction>
														{(this.props.thingInFoxus[item]*1 < 0) ? this.props.thingInFoxus[item] : '+' + this.props.thingInFoxus[item]}
													  </ListItemSecondaryAction>
													</ListItem>
													}
											  </div>
												)}
											 )}
										
										
										</List>
									</Grid>
									}
								</>
								<Grid item>
								  <h6>
									Параметры
								  </h6>
									<List dense={true}>
										{this.props.thingInFoxus.parametrs['урон'][0] > 0 && <>
											<ListItem key={'Урон'} style={{minWidth: 230, margin:0, padding: 0}}>
											  <ListItemText
												primary="Урон"
											  />
											  <ListItemSecondaryAction>
												{'+' + this.props.thingInFoxus.parametrs['урон'][0] + ' - ' + this.props.thingInFoxus.parametrs['урон'][1]}
											  </ListItemSecondaryAction>

											</ListItem>
											<Divider/>
										</>
											
										}
										{parametrs.map((item) => {
										  return (
											  <div key={item} >
												{this.props.thingInFoxus.parametrs[item] !== 0 && <ListItem style={{minWidth: 230, margin:0, padding: 0}}>
													  <ListItemText 
														primary={item}
														style={{margin:0, padding: 0}}
													  />
													  <ListItemSecondaryAction>
														{(this.props.thingInFoxus.parametrs[item]*1 < 0) ? Math.round(100*(this.props.thingInFoxus.parametrs[item]))/100 : '+' + Math.round(10*(this.props.thingInFoxus.parametrs[item]))/10}
													  </ListItemSecondaryAction>
													</ListItem>
													}
											  </div>
												)}
											  )}
									</List>
						  
									
								</Grid>
						</> }
						{this.state.seeItem === 'Описание' && <>
						<Grid item>
					  	
						  <h6>
							Требования
						  </h6>
							<List dense={true} style={{minWidth: 140, padding:0,paddingBottom:15}}>
								<ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Уровень"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needlvl}
								  </ListItemSecondaryAction>
								</ListItem>
								{this.props.thingInFoxus.needPower > 0 && <ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Сила"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needPower}
								  </ListItemSecondaryAction>
								</ListItem>
								}
							  {this.props.thingInFoxus.needBody > 0 && <ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Телосложение"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needBody}
								  </ListItemSecondaryAction>
								</ListItem>
								}
							  {this.props.thingInFoxus.needDex > 0 && <ListItem  style={{margin:0, padding: 0}}>
								  <ListItemText
									primary="Ловкость"
									 style={{margin:0, padding: 0}}
								  />
								  <ListItemSecondaryAction>
									{this.props.thingInFoxus.needDex}
								  </ListItemSecondaryAction>
								</ListItem>
								}
							</List>
						</Grid>
							<>
								{(modifireThing.powerItem !== 0 ||
								modifireThing.bodyItem !== 0 ||
								modifireThing.dexItem !== 0 ||
								modifireThing.intellItem !== 0 ||
								modifireThing.staminaItem !== 0 ||
								modifireThing.willItem !== 0) &&
									<Grid item>
									  <h6>
										Характеристики
									  </h6>
										<List dense={true}  style={{minWidth: 140, padding:0, paddingBottom:15}}>
										
										{characteristics.map((item, i) => {
										  return (
											  <div key={item} >
												{modifireThing[item] !== 0 && <ListItem  style={{margin:0, padding: 0}}>
													  <ListItemText
														primary={characteristicsName[i]}
														style={{margin:0, padding: 0}}
													  />
													  <ListItemSecondaryAction>
														{(modifireThing[item]*1 < 0) ? modifireThing[item] : '+' + modifireThing[item]}
													  </ListItemSecondaryAction>
													</ListItem>
													}
											  </div>
												)}
											 )}
										
										
										</List>
									</Grid>
									}
								</>
								<Grid item>
								  <h6>
									Параметры
								  </h6>
									<List dense={true}>
										{modifireThing.parametrs['урон'][0] > 0 && <>
											<ListItem key={'Урон'} style={{minWidth: 230, margin:0, padding: 0}}>
											  <ListItemText
												primary="Урон"
											  />
											  <ListItemSecondaryAction>
												{'+' + modifireThing.parametrs['урон'][0] + ' - ' + modifireThing.parametrs['урон'][1]}
											  </ListItemSecondaryAction>

											</ListItem>
											<Divider/>
										</>
											
										}
										{parametrs.map((item) => {
										  return (
											  <div key={item} >
												{modifireThing.parametrs[item] !== 0 && <ListItem style={{minWidth: 230, margin:0, padding: 0}}>
													  <ListItemText 
														primary={item}
														style={{margin:0, padding: 0}}
													  />
													  <ListItemSecondaryAction>
														{(modifireThing.parametrs[item]*1 < 0) ? Math.round(100*(modifireThing.parametrs[item]))/100 : '+' + Math.round(100*(modifireThing.parametrs[item]))/100}
													  </ListItemSecondaryAction>
													</ListItem>
													}
											  </div>
												)}
											  )}
									</List>
						  
									
								</Grid>
						</> }
						{this.state.seeItem === 'Модификация' && <div style={{maxHeight: 450, overflowY: 'scroll'}}>
													
							<Grid item>
							  <h6>
								Характеристики
							  </h6>
								<List dense={true}>
									
									{characteristics.map((item, i) => {
										  return (
											  <TextField
													key={item}
													fullWidth
													label={characteristicsName[i]}
													margin="dense"
													inputProps={{step: 1}}
													value={Math.round((modifireThing[item] - runesModifire[characteristicsName[i]] - this.props.thingInFoxus[item]) * 10)/10}
													type="number"
													InputLabelProps={{
													  shrink: true,
													}}
													min={-10}
													onChange={(e) => this.changeMode(e, item, Math.round((modifireThing[item] - runesModifire[characteristicsName[i]] - this.props.thingInFoxus[item]) * 10)/10, this.props.type)}
													variant="outlined"
													  />
												)}
											 )}
								</List>

							</Grid>
							<Grid item>
							  <h6>
								Параметры
							  </h6>
								<List dense={true}>
							  
									<ListItem key={'Урон'} style={{margin:0, padding: 0}}>
										  <TextField
											label={'Мин. урон'}
											margin="dense"
											value={Math.round((modifireThing.parametrs['урон'][0]- this.props.thingInFoxus.parametrs['урон'][0]) * 10)/10}
											onChange={(e) => this.changeMode(e, 'урон1', Math.round((modifireThing.parametrs['урон'][0] - this.props.thingInFoxus.parametrs['урон'][0]) * 10)/10, this.props.type)}
											type="number"
											InputLabelProps={{
											  shrink: true,
											}}
											variant="outlined"
										  />-<TextField
											label={'Макс. урон'}
											margin="dense"
											value={Math.round((modifireThing.parametrs['урон'][1]- this.props.thingInFoxus.parametrs['урон'][1]) * 10)/10}
											onChange={(e) => this.changeMode(e, 'урон2', Math.round((modifireThing.parametrs['урон'][1] - this.props.thingInFoxus.parametrs['урон'][1]) * 10)/10, this.props.type)}
											type="number"
											InputLabelProps={{
											  shrink: true,
											}}
											variant="outlined"
										  />
										</ListItem>
											<Divider/>

										
								  {parametrs.map((item) => {
											  return (
												  <ListItem key={'c'+item} style={{margin:0, padding: 0}}>
													  <TextField
													  	fullWidth
														label={item}
														margin="dense"
														inputProps={(item==='ОД на действие') ? {step: 0.1} : ((item === 'призыватель') || (item === 'заклинатель') || (item === 'разрушитель')|| (item === 'осквернитель')) ? {step: 0.01} : {step: 1}}
														value={Math.round((modifireThing.parametrs[item] - runesModifire[item] - (this.props.thingInFoxus.parametrs[item] || 0)) * 100)/100}
														type="number"
														InputLabelProps={{
														  shrink: true,
														}}
														min={-10}
														onChange={(e) => this.changeMode(e, item, Math.round((modifireThing.parametrs[item] - runesModifire[item] - (this.props.thingInFoxus.parametrs[item] || 0)) * 100)/100, this.props.type)}
														variant="outlined"
													  />
													</ListItem>
													)}
												  )}
								  
								</List>
							</Grid>
							
						</div> }
						</Grid>
						<Snackbar
							key={1}

							anchorOrigin={{
							  vertical: 'bottom',
							  horizontal: 'left',
							}}
							open={this.state.open}
							autoHideDuration={3000}
							onClose={(e) => this.snackbarlose(e)}
							ContentProps={{
							  'aria-describedby': 'message-id',
							}}>
								<SnackbarContent style={{backgroundColor: '#FFA000'}} message={
									<span style={{display: 'flex', alignItems: 'center',}}>
										{<WarningIcon style={{marginRight: 10}}/>}
										{this.state.content}
									</span>
								}/>


					</Snackbar>
			</>
		)
	};
};
//
const mapStateToProps = (state) => {
	
    return {
        levelChange: state.levelChange,
		thingOnPers: state.thingOnPers,
		modifireThings: state.modifireThings,
		loadedPerson: state.loadedPerson,
		runesChange: state.runesChange,
		
    }
}

//export default connect(mapStateToProps)(ItemsList);
//

export default connect(mapStateToProps)(ItemInfoSystem);
