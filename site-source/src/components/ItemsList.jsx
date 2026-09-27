import React from 'react';
//import TooltipsSkillsInfo from './TooltipsSkillsInfo';

//import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Switch from '@material-ui/core/Switch';

//import Popover from '@material-ui/core/Popover';
//import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';



import FormControlLabel from '@material-ui/core/FormControlLabel';
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
//import WarningIcon from '@material-ui/icons/Warning';

import { Grid } from '@material-ui/core';

import Box from '@material-ui/core/Box';

import WarningIconModule from '@material-ui/icons/Warning';
const WarningIcon = WarningIconModule.default?.default || WarningIconModule.default || WarningIconModule;

//import Icon from '@material-ui/core/Icon';

import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

//import ReactTooltip from 'react-tooltip';

import ItemInfoSystem from './ItemInfoSystem'
import itemsAll from './ItemsAll';


//import { palette } from '@material-ui/system';
// Ввод характеристик персонажа, его уровня и т.д.
class ItemsList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			popoverWeapon: false,
			rings: false,
			weaponRight: false,
			popover2Weapon: false,
			typeThing: 'Доспехи',
			typeThingAbout: 'Все',
			runes: '',
			runeWord: '',
			typeThingForWho: 'Все',
			forMyLevel: true,
			thingInFoxus: {
				"name": "Нет",
				"typeThing": "Нет",
				"kindOfThing": "Пояса",
				"needlvl": "0",
				"durability": "0",
				"weight": "0",
				"costType": "Цена покупки (серебро)",
				"cost": "0",
				"imgUrl": "https://chaosage.ru/images/empty_belt.gif",
				"needPower": 0,
				"needBody": 0,
				"needDex": 0,
				"powerItem": 0,
				"bodyItem": 0,
				"dexItem": 0,
				"staminaItem": 0,
				"willItem": 0,
				"intellItem": 0,
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
			},
			open: false,
			seeItem: 'Описание',
		};
	}
	
	
	
	changeTypeOfThing (e) {
		this.setState({
			typeThingAbout: e.target.value
		})
	}
	
	changeForMyLevelState (e) {
		this.setState({
			forMyLevel: !this.state.forMyLevel
		})
	}
	chooseType (e, n) {

		var x = n.split(' ')
		
		var y = JSON.parse(JSON.stringify(this.props.thingOnPers[n]))
//		console.log('Это мы получили при простом клке на вещь')
//		console.log(y)
		
		if (x.length > 1) {
			
			if (x[0] === 'Кольца') {
				
				this.setState({
					typeThing: x[0],
					rings: n,
					thingInFoxus: y,
					weaponRight: false,
					weaponLeft: false
				})
				
			}

		} else {
			this.setState({
				typeThing: n,
				rings: false,
				thingInFoxus: y,
				weaponRight: false,
				weaponLeft: false
			})
//			console.log('Поменяли стейт')
//		console.log(this.state.thingInFoxus)
		}
		
		
		
		
	}
	
	// Закрытие окна оружия в правой руке
	closeWeaponPopower (e, n) {

		console.log(n)
		this.setState({
			weaponRight: true,
			weaponLeft: false,
			popoverWeapon: false,
			typeThing: n || this.props.thingOnPers['Оружие Справа'].kindOfThing,
			thingInFoxus: this.props.thingOnPers['Оружие Справа'],
		})
		
		
		// Если выбран тип оружия
		if (n) {
			this.setState({
				weaponRight: true,
				weaponLeft: false,
			})
			
		}

		
	}
	
	// Закрытие окна оружия в левой руке
	
	closeWeapon2Popower (e, n) {
//		console.log(n)
		this.setState({
			weaponLeft: true,
			weaponRight: false,
			popover2Weapon: false,
			typeThing: n || this.props.thingOnPers['Оружие Слева'].kindOfThing,
			thingInFoxus: this.props.thingOnPers['Оружие Слева'],
		})
		
		
		// Если выбран тип оружия
		if (n) {
			this.setState({
				weaponRight: false,
				weaponLeft: true,
			})
			
		}
	}
	
	openWeaponPopower () {
		this.setState({
			popoverWeapon: true
		})
	}
	openWeapon2Popower () {
		this.setState({
			popover2Weapon: true
		})
	}
	
	changeTypeOfForWho (e) {
		this.setState({
			typeThingForWho: e.target.value
		})
		
		console.log(e.target.value)
	}
	
	// Выбор вещи
	chooseThing(e, d, m) {

//		console.log('Надо проверить, не ломается ли сама основа вещи')
//		console.log(d)
		if ((d.needlvl*1) > (m*1)) {
			this.setState({
				open: !this.state.open,
				thingInFoxus: JSON.parse(JSON.stringify(d))
			})
		} else {
			this.setState({
				thingInFoxus: JSON.parse(JSON.stringify(d))
			})
		}

		
		if (this.state.weaponRight) {
			this.props.dispatch({
				type: `Надеть Оружие Справа`,
				d: JSON.parse(JSON.stringify(d))
			});
		} else if (this.state.weaponLeft) {
			this.props.dispatch({
				type: `Надеть Оружие Слева`,
				d: JSON.parse(JSON.stringify(d))
			});
		}  else {
			// Это кольцо?
			if (!this.state.rings) {
				this.props.dispatch({
					type: `Надеть ${this.state.typeThing}`,
					d: JSON.parse(JSON.stringify(d))
				});
			} else {
				this.props.dispatch({
					type: `Надеть ${this.state.rings}`,
					d: JSON.parse(JSON.stringify(d))
				});
			}
		}
		
		
	}
	
	// Закрытие всплывающего окна
	snackbarlose(e) {
		this.setState({
			open: !this.state.open
		})

	}

	render() {
	
		
//		console.log(runesWordAll)
		// Знаем тип вещи, выгружаем под данный тип модификации
		
		var type = 0;
		if (this.state.weaponRight) {
			type = 'Оружие Справа'
		} else if (this.state.weaponLeft) {
			type = 'Оружие Слева'
		} else {
			type = this.state.typeThing === 'Кольца' ? this.state.rings : this.state.typeThing
		}

		


//		

		
		var localItems = []
		
//		var choosenItem = {}
		// Добавляем или нет вещь в рендеринг
		var add = [false, false, true];
		
		// Тип вещи артефакт или нет
		var countSilverThing = 0
		
		for (var i=0;i<itemsAll.length; i++) {
			if (itemsAll[i].kindOfThing === this.state.typeThing) {
				
				
				// Фильтр по типу вещи (комплекты, артефакты, все)
				if (this.state.typeThingAbout === 'Все') {
					add[0] = true
				} else if ((this.state.typeThingAbout === 'Комплекты') && (itemsAll[i].complect !== 'Нет')) {
					add[0] = true
				} else if ((this.state.typeThingAbout === 'Артефакты') && (itemsAll[i].costType !== 'Цена покупки (серебро)')) {
					add[0] = true
				}
				
				if (this.state.typeThingForWho === 'Все') {
					add[1] = true
				} else if ((this.state.typeThingForWho === 'Для магов') && (itemsAll[i].typeThing === 'Маг')) {
					add[1] = true
				} else if ((this.state.typeThingForWho === 'Для силовиков') && (itemsAll[i].typeThing === 'Силовик')) {
					add[1] = true
				} else if ((this.state.typeThingForWho === 'Для танков') && (itemsAll[i].typeThing === 'Танк')) {
					add[1] = true
				} else if ((this.state.typeThingForWho === 'Для ловкачей') && (itemsAll[i].typeThing === 'Ловкач')) {
					add[1] = true
				}
				
			
				if ((this.props.levelChange < itemsAll[i].needlvl) && (this.state.forMyLevel)) {
					add[2] = false
				}
				
				if ((add[0] === true) && (add[1] === true) && (add[2] === true)) {
					
					if (itemsAll[i].costType === 'Цена покупки (серебро)') {
						 countSilverThing++
					}
					
					localItems.push(itemsAll[i])
					
					// Обрезаем первое, если у нас условие выборки вещей моего уровня
					if ((this.state.forMyLevel) && (countSilverThing>11)) {
						localItems.shift()
						countSilverThing--
					}
				}
				add = [false, false, true];
			}
		}
		// Сортируем
		localItems.sort((a, b) => {
			
			if ((a.costType === "Цена покупки (серебро)") && (b.costType !== "Цена покупки (серебро)")) {
				// Первыми идут серебряные
				return 1
			} if ((a.costType === "Цена покупки (серебро)") && (b.costType === "Цена покупки (серебро)")) {
				if ((a.needlvl*1) > (b.needlvl*1)) {
					return 1
				} else {
					return -1
				}
			} else if ((a.costType !== "Цена покупки (серебро)") && (b.costType !== "Цена покупки (серебро)")) {
				if ((a.needlvl*1) > (b.needlvl*1)) {
					return 1
				} else {
					return -1
				}
			} else if ((a.costType !== "Цена покупки (серебро)") && (b.costType === "Цена покупки (серебро)")) {
				// Первыми идут серебряные
				return -1
			}
		
		})
		
		
		return(
			<div className='row'>
			
				<div className='col-xl-5 col-lg-5  col-md-12'>

					<Grid
						  container
						  direction="row"
						  justify="space-around"
						  alignItems="center"
						>
							<Grid item>
								 <Typography
									  component="div"
									  variant="body1"
									  style={{ height: 270, width: 240, position: 'relative' }}
									>
									  <Box
										color="white"
										position="absolute"
										top={0}
										left={240/2-63/2}
									  >
										<img 
											onClick={(e) => this.chooseType(e, 'Шлемы')}
											className='imgVisual' width= {63} height= {56} src={this.props.thingOnPers['Шлемы'].imgUrl}  alt={this.props.thingOnPers['Шлемы'].name} />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={45}
										left={240/4*3-10}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Амулеты')}
											className='imgVisual' width= {63} height= {25} src={this.props.thingOnPers['Амулеты'].imgUrl}  alt={this.props.thingOnPers['Амулеты'].name} />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={45+29}
										left={240/4*3-10}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Наручи')}
											className='imgVisual' width= {63} height= {44} src={this.props.thingOnPers['Наручи'].imgUrl}  alt={this.props.thingOnPers['Наручи'].name}  />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={45+29}
										left={6}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Перчатки')}
											className='imgVisual' width= {63} height= {44} src={this.props.thingOnPers['Перчатки'].imgUrl}  alt={this.props.thingOnPers['Перчатки'].name}  />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60}
										left={240/2-63/2}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Доспехи')}
											className='imgVisual' width= {63} height= {81} src={this.props.thingOnPers['Доспехи'].imgUrl}  alt={this.props.thingOnPers['Доспехи'].name} />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60+84}
										left={240/2-63/2}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Пояса')}
											className='imgVisual' width= {63} height= {36} src={this.props.thingOnPers['Пояса'].imgUrl}  alt={this.props.thingOnPers['Пояса'].name}  />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60+84+40+10}
										left={240/2-63/2}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Ботинки')}
											className='imgVisual' width= {63} height= {65} src={this.props.thingOnPers['Ботинки'].imgUrl}  alt={this.props.thingOnPers['Ботинки'].name}  />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60+84+10}
										left={6}
									  >
										<img  
											onClick={(e) => this.openWeaponPopower(e)}				
											
											className='imgVisual' width= {63} height= {99} src={this.props.thingOnPers['Оружие Справа'].imgUrl}  alt={this.props.thingOnPers['Оружие Справа'].name}  />

										  <Dialog open={this.state.popoverWeapon} onClose={(e) => this.closeWeaponPopower(e)}>
											<DialogTitle style={{marginTop: 10}}>Выберите тип оружия</DialogTitle>
											<DialogContent>
										  
											  <List dense={false}>
												 {[{
													  name: 'Мечи',
													  url: 'https://chaosage.ru/images/newLordsSword.gif'
												  }, {
													  name: 'Топоры',
													  url: 'https://chaosage.ru/images/newLordsAxe.gif'
												  }, {
													  name: 'Дубины',
													  url: 'https://chaosage.ru/images/newLordsMace.gif'
												  }, {
													  name: 'Арбалеты',
													  url: 'https://chaosage.ru/images/newLordsCrossbow.gif'
												  }, {
													  name: 'Луки',
													  url: 'https://chaosage.ru/images/newLordsBow.gif'
												  }, {
													  name: 'Кловеры',
													  url: 'https://chaosage.ru/images/newLordsKlover.gif'
												  }, {
													  name: 'Посохи',
													  url: 'https://chaosage.ru/images/ancientLordsStaff.gif'
												  }, {
													  name: 'Копья',
													  url: 'https://chaosage.ru/images/newLordsSpear.gif'
												  }].map((item) => {
													  return (
														<div key={item.name}>
															
															<ListItem button onClick={(e) => this.closeWeaponPopower(e, item.name)}>
																	<ListItemAvatar>

																		  <Avatar >
																			<img width={30} src={item.url} alt={item.name}/>
																		  </Avatar>

																	</ListItemAvatar>
																	<ListItemText primary={item.name}/>
															</ListItem>
															<Divider variant="inset" component="li" />
														</div>
														)}
													  )}
													</List>
													
											</DialogContent>
											<DialogActions>
											  <Button onClick={(e) => this.closeWeaponPopower(e)} color="primary">
												Отмена
											  </Button>
											</DialogActions>
										  </Dialog>
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60+84+10}
										left={240/4*3-10}
										
									  >
										<img  
											onClick={(e) => this.openWeapon2Popower(e)}			
											className='imgVisual' width= {63} height= {99} src={this.props.thingOnPers['Оружие Слева'].imgUrl}  alt={this.props.thingOnPers['Оружие Слева'].name}  />
											
											
										<Dialog open={this.state.popover2Weapon} onClose={(e) => this.closeWeapon2Popower(e)}>
											<DialogTitle style={{marginTop: 10}}>Выберите тип оружия</DialogTitle>
											<DialogContent>
										  
											  <List dense={false}>
												 {[{
													  name: 'Мечи',
													  url: 'https://chaosage.ru/images/newLordsSword.gif'
												  }, {
													  name: 'Топоры',
													  url: 'https://chaosage.ru/images/newLordsAxe.gif'
												  }, {
													  name: 'Дубины',
													  url: 'https://chaosage.ru/images/newLordsMace.gif'
												  }, {
													  name: 'Щиты',
													  url: 'https://chaosage.ru/images/newLordsShield.gif'
												  }].map((item) => {
													  return (
														<div key={item.name}>
															
															<ListItem button onClick={(e) => this.closeWeapon2Popower(e, item.name)}>
																	<ListItemAvatar>

																		  <Avatar >
																			<img width={30} src={item.url} alt={item.name}/>
																		  </Avatar>

																	</ListItemAvatar>
																	<ListItemText primary={item.name}/>
															</ListItem>
															<Divider variant="inset" component="li" />
														</div>
														)}
													  )}
													</List>
													
											</DialogContent>
											<DialogActions>
											  <Button onClick={(e) => this.closeWeapon2Popower(e)} color="primary">
												Отмена
											  </Button>
											</DialogActions>
										  </Dialog>
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60+63}
										left={240/4*3+13/2}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Кольца Справа')}
											className='imgVisual' width= {30} height= {27} src={this.props.thingOnPers['Кольца Справа'].imgUrl}  alt={this.props.thingOnPers['Кольца Справа'].name} />
									  </Box>
									  <Box
										color="text.primary"
										position="absolute"
										top={0+60+63}
										left={6+63/2-30/2}
										
									  >
										<img  
											onClick={(e) => this.chooseType(e, 'Кольца Слева')}
											className='imgVisual' width= {30} height= {27} src={this.props.thingOnPers['Кольца Слева'].imgUrl}  alt={this.props.thingOnPers['Кольца Слева'].name} />
									  </Box>

								</Typography>


							</Grid>
						</Grid>
					
						<Grid
						  container
						  direction="row"
						  justify="space-around"
						  alignItems="center"
						>
								
								<Grid item>
									<FormControl className='m-2' style={{minWidth: 120}}>
										<InputLabel htmlFor="type-complect">Принадлежность</InputLabel>
										<Select
											onChange={(e) => this.changeTypeOfThing(e)}
											value={this.state.typeThingAbout}
											inputProps={{
											  name: 'Тип',
											  id: 'type-complect',
											}}
										>
										  <MenuItem value={'Все'}>Все</MenuItem>
										  <MenuItem value={'Комплекты'}>Комплекты</MenuItem>
										  <MenuItem value={'Артефакты'}>Артефакты</MenuItem>
										</Select>
									  </FormControl>
								</Grid>
								<Grid item>
									<FormControl className='m-2' style={{minWidth: 120}}>
										<InputLabel htmlFor="type-complect">Тип</InputLabel>
										<Select
											onChange={(e) => this.changeTypeOfForWho(e)}
											value={this.state.typeThingForWho}
											inputProps={{
											  name: 'Тип',
											  id: 'type-complect',
											}}
										>
											<MenuItem value={'Все'}>Все</MenuItem>
											<MenuItem value={'Для магов'}>Для магов</MenuItem>
											<MenuItem value={'Для силовиков'}>Для силовиков</MenuItem>
											<MenuItem value={'Для танков'}>Для танков</MenuItem>
											<MenuItem value={'Для ловкачей'}>Для ловкачей</MenuItem>
										</Select>

								  </FormControl>
								</Grid>
								<Grid item>
									<FormControl component="fieldset">
									  <FormGroup>
										<FormControlLabel

										  control={<Switch checked={this.state.forMyLevel} value="myLvl" onChange={(e) => this.changeForMyLevelState(e)}/>}
										  label="Для моего уровня"
										/>
									  </FormGroup>
									</FormControl>
								</Grid>
							</Grid>
						
					<List dense={true} style={{maxHeight: 350, overflowY: 'scroll'}}>

					 {localItems.map((item) => {
						  return (
								<div key={item.name + Math.random()}>
									<ListItem button selected={(item.name === this.state.thingInFoxus.name) ? true : false} onClick={(e) => this.chooseThing(e, item, this.props.levelChange)}>
										<ListItemAvatar>
										<Badge badgeContent={item.needlvl} color={(item.needlvl <= this.props.levelChange) ? 'primary' : 'secondary'}>
										  <Avatar>
											<img  width={30}  src={item.imgUrl} alt={item.name}/>
										  </Avatar>
											</Badge>
										</ListItemAvatar>
										<ListItemText primary={item.name}/>
									  </ListItem>
										<Divider variant="inset" component="li" />
								</div>
							)}
						  )}
						</List>
					</div>
					
					<div className='col'>
						<ItemInfoSystem type={type} thingInFoxus={this.state.thingInFoxus}/>
				
						
					</div>
					
					
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
								{`Вам не хватает ${this.state.thingInFoxus.needlvl-this.props.levelChange} уровней, чтобы надеть ${this.state.thingInFoxus.name}`}
							</span>
						}/>


					</Snackbar>
				
			</div>
		)
	};
};

const mapStateToProps = (state) => {
	
    return {
        levelChange: state.levelChange,
		thingOnPers: state.thingOnPers,
		modifireThings: state.modifireThings,
		loadedPerson: state.loadedPerson,
		
    }
}

export default connect(mapStateToProps)(ItemsList);


