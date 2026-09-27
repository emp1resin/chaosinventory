import React from 'react';
import CharSingle from './CharSingle';
import FreePointsChar from './FreePointsChar';
import ClansArt from './ClansArt';

import { connect } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { hasReligionBonuses, sanitizeReligionData } from '../data/religions';
import { emptyGolem, golemSupportPercent } from '../data/golem';


import { Tooltip as ReactTooltip } from 'react-tooltip';
//import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import HelpIconModule from '@material-ui/icons/Help';
const HelpIcon = HelpIconModule.default?.default || HelpIconModule.default || HelpIconModule;


import TextField from '@material-ui/core/TextField';
//import InputAdornment from '@material-ui/core/InputAdornment';
//import Fade from '@material-ui/core/Fade';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid } from '@material-ui/core';

//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
//import ListItemText from '@material-ui/core/ListItemText';
//import ListItemAvatar from '@material-ui/core/ListItemAvatar';
//import Avatar from '@material-ui/core/Avatar';
//import Badge from '@material-ui/core/Badge';
//import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

// Ввод характеристик персонажа, его уровня и т.д.
class CharInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			religionsList: ['Нет'],
			clansList: ['Нет'],
			clans: {},
			drawerClanArtsOpen: false
		};
	}
	
	componentDidMount() {
		var religionData = [];
		var religionsList = ['Нет'];
		var clansList = ['Нет'];
		
		fetch('https://chaosage.space/religionAndClansData')
			.then(response => response.json())
			.then((jsonData) => {
				religionsList = [...new Set([...(jsonData.religionArr || []), 'Нет'])]

				const serialized = jsonData.rowA?.[0]?.religionInformation
				if (serialized) {
					const serializedReligionData = serialized
						.replace(new RegExp("<br />", 'g'), "")
						.replace(/'/g, '"');
					religionData = sanitizeReligionData(JSON.parse(serializedReligionData));
				}

//				console.log(jsonData.clansArr)
				
				for (var i in jsonData.clansArr) {
					clansList.push(i)
				}
			
				this.setState({
					religionsList: religionsList,
					clansList: clansList,
					clans: jsonData.clansArr
				})
				
				this.props.dispatch({
					type: `Получили бонусы религий`,
					data: religionData
					
				});
//				console.log(religionData)
			})
			.catch((error) => {
				console.log(error)
				this.props.dispatch({
					type: `Получили бонусы религий`,
					data: []
				});
			})
	}
	changeReligion(e) {

		this.props.dispatch({
			type: `Смена Религии`,
			data: e.target.value
		});

	}
	changeCharBless(e) {

		this.props.dispatch({
			type: `Смена Блага Характеристик`,
			data: e.target.value
		});

	}
	changeLifeBless(e) {

		this.props.dispatch({
			type: `Смена Блага Жизни`,
			data: e.target.value
		});

	}
	changeRace(e) {

		this.props.dispatch({
			type: `Смена Расы`,
			data: e.target.value
		});

	}
	openDrawersClanArts() {
		this.setState({
			drawerClanArtsOpen: !this.state.drawerClanArtsOpen
		})
	}
	changeClan(e) {



		this.props.dispatch({
			type: `Смена Клана`,
			data: e.target.value,
			clan: this.state.clans
		});
		

	}
	changeProfession(e) {

		this.props.dispatch({
			type: `Смена Профессии`,
			data: e.target.value
		});

	}
	changeFractionReputation(e) {

		this.props.dispatch({
			type: `Смена Фракционной репутации`,
			data: e.target.value
		});

	}
	changeClanPosition(e) {

		this.props.dispatch({
			type: `Смена Позиции в Клане`,
			data: e.target.value
		});

	}
	changeProfessionLevel(e) {

		this.props.dispatch({
			type: `Смена уровня Профессии`,
			data: e.target.value
		});

	}
	changeClanGlory(e) {

		
		this.props.dispatch({
			type: `Смена Клановой славы`,
			data: e.target.value
		});

	}
	changeGolem(field, value) {
		this.props.dispatch({type: 'Смена голема', data: {[field]: value}});
	}
	render() {
		
//		console.log(this.state.religionsList)
		
		const epicRace = [{
			name: 'Ангел'
		},{
			name: 'Лич'
		},{
			name: 'Вампир'
		},{
			name: 'Берсерк'
		},{
			name: 'Торен'
		},{
			name: 'Голем'
		},{
			name: 'Гигант'
		},{
			name: 'Призрак'
		},{
			name: 'Эфрит'
		},{
			name: 'Джинн'
		}]
		const charSummary = [
			{	
				name: 'Уровень персонажа',
				id: 'charLevel',
				iconUrl: 'тут',
				description: '',
				val: this.props.level,
			}, {	
				name: 'Сила',
				id: 'charPower',
				iconUrl: 'тут',
				description: '',
				val: this.props.power,
			}, {	
				name: 'Телосложение',
				id: 'charBody',
				iconUrl: 'тут',
				description: '',
				val: this.props.body,
			}, {	
				name: 'Ловкость',
				id: 'charDex',
				iconUrl: 'тут',
				description: '',
				val: this.props.dex,
			}, {	
				name: 'Интеллект',
				id: 'charIntellect',
				iconUrl: 'тут',
				description: '',
				val: this.props.intell,
			}, {	
				name: 'Выносливость',
				id: 'charStamina',
				iconUrl: 'тут',
				description: '',
				val: this.props.stamina,
			}, {	
				name: 'Воля',
				id: 'charWill',
				iconUrl: 'тут',
				description: '',
				val: this.props.will,
			}
		];
	
		// Выбрана ли профессия
		var professionEnable = this.props.profession !== 'Нет';
		var clanEnable = this.props.clan !== 'Нет';
		const golem = this.props.golem || emptyGolem;
		const supportBonus = golemSupportPercent(golem);
		
//		console.log(this.state.clansList)

		return(
			<div>
				<h3>Основные характеристики</h3>
			 	<FreePointsChar/>
				<div className='row'>
					{charSummary.map((char) =>
						<CharSingle key={char.id} charName={char.name} charId={char.id} data={char.val}/>
					  )}
				</div>
			 	<div className='row mt-4'>
			 		<Grid
						  container
						  direction="row"
						  justify="space-around"
						  alignItems="center"
						>
								<Grid item>
									<FormControl className='m-2' style={{minWidth: 120}}>
										<InputLabel htmlFor="race">{
													['Человек', 'Эльф', 'Орк', 'Гном', 'Демон', 'Дану', 'Тролль'].includes(this.props.race) ? 'Раса' : 'ВФ'
											}</InputLabel>
										<Select
											onChange={(e) => this.changeRace(e)}
											value={this.props.race}
											inputProps={{
											  name: 'Тип',
											  id: 'race',
											}}
										>
									  		{this.props.level>50 &&
												epicRace.map((char) =>
													<MenuItem key={char.name} value={char.name}>{char.name}</MenuItem>
												  )
												
											
											}
										  <MenuItem value={'Человек'}>Человек</MenuItem>
										  <MenuItem value={'Эльф'}>Эльф</MenuItem>
										  <MenuItem value={'Орк'}>Орк</MenuItem>
										  <MenuItem value={'Гном'}>Гном</MenuItem>
										  <MenuItem value={'Тролль'}>Тролль</MenuItem>
										  <MenuItem value={'Дану'}>Дану</MenuItem>
										  <MenuItem value={'Демон'}>Демон</MenuItem>
										  
										  
										</Select>
									  </FormControl>
								</Grid>
								<Grid item>
									<FormControl className='m-2' style={{minWidth: 120}}>
										<InputLabel htmlFor="religion">Религия</InputLabel>
										<Select
											onChange={(e) => this.changeReligion(e)}
											value={this.props.religion}
											inputProps={{
											  name: 'Тип',
											  id: 'religion',
											}}
										>
											{this.state.religionsList.map((char) =>
													<MenuItem key={char} value={char}>{char}</MenuItem>
												  )
											}
											
										</Select>
										{!hasReligionBonuses(this.props.religion) && (
											<FormHelperText>У этой религии сейчас нет бонусов.</FormHelperText>
										)}

								  </FormControl>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										label={'Фракционная репутация'}
										style={{minWidth: 220}}
										value = {this.props.fractionReputation}
										onChange={(e) => this.changeFractionReputation(e)}
										type="number"
										inputProps={{'min': 0, 'max': 15}}
										InputLabelProps={{
										  shrink: true,
										}}
										margin="dense"
										variant="outlined"
										InputProps={{
										  endAdornment: (
												 
													  <span data-tooltip-id={'Фракционная репутация'}> 
														
													</span>
												  

										  ),
										}}
									  />
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
										<InputLabel htmlFor="profession">Профессия</InputLabel>
										<Select
											onChange={(e) => this.changeProfession(e)}
											value={this.props.profession}
											inputProps={{
											  name: 'Тип',
											  id: 'profession',
											}}
										>
											<MenuItem value={'Нет'}>Нет</MenuItem>
											<MenuItem value={'Наемник'}>Наемник</MenuItem>
											<MenuItem value={'Следопыт'}>Следопыт</MenuItem>
											<MenuItem value={'Лекарь'}>Лекарь</MenuItem>
											<MenuItem value={'Ведьмак'}>Ведьмак</MenuItem>
											<MenuItem value={'Рейдер'}>Рейдер</MenuItem>
											<MenuItem value={'Охотник'}>Охотник</MenuItem>
										</Select>

								  </FormControl>
								</Grid>
									<Grid item>
										<TextField 
											style={{minWidth: 160}}
											fullWidth={true}
											label={'Уровень профессии'}
											onChange={(e) => this.changeProfessionLevel(e)}
											value = {this.props.professionLevel}
											disabled={!professionEnable}

											type="number"
											inputProps={{'min': 0, 'max': 150}}
											InputLabelProps={{
											  shrink: true,
											}}
											margin="dense"
											variant="outlined"

										  />
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
										<InputLabel htmlFor="clan">Клан</InputLabel>
										<Select
											onChange={(e) => this.changeClan(e)}
											value={this.props.clan}
											inputProps={{
											  name: 'Тип',
											  id: 'clan',
											}}
										>
										
										{this.state.clansList.map((char) =>
													<MenuItem key={char} value={char}>{char}</MenuItem>
												  )
											}
											
										</Select>
										
									  </FormControl>
									</Grid>
										<Grid item>
											<TextField 
												style={{minWidth: 60}}
												fullWidth={true}
												label={'Слава'}
												onChange={(e) => this.changeClanGlory(e)}
												value = {this.props.clanGlory ?? ''}
												disabled={!clanEnable}
												helperText={clanEnable && this.props.clanGlory == null ? 'Слава не загрузилась. Укажите её вручную.' : ''}
												
												type="number"
												
												inputProps={{'min': -100, 'max': 100}}
												InputLabelProps={{
												  shrink: true,
												}}
												margin="dense"
												variant="outlined"

											  />
										</Grid>

										
										<Grid item>
											<TextField 
												style={{minWidth: 60}}
												fullWidth={true}
												label={'Позиция'}
												onChange={(e) => this.changeClanPosition(e)}
												value = {this.props.clanPosition ?? ''}

												disabled={!clanEnable}
												helperText={clanEnable && this.props.clanPosition == null ? 'Позиция не загрузилась. Укажите её вручную.' : ''}
												type="number"
												inputProps={{'min': 1, 'max': 1000}}
												InputLabelProps={{
												  shrink: true,
												}}
												margin="dense"
												variant="outlined"

											  />
										</Grid>
										<Grid item>
											<Button variant="outlined" color="primary" onClick={()=>this.openDrawersClanArts()}>
												Добавить клан. артефакты
											  </Button>
											  <SwipeableDrawer
													anchor="left"
													open={this.state.drawerClanArtsOpen}
													onClose={()=>this.openDrawersClanArts()}
													onOpen={()=>this.openDrawersClanArts()}
												  >
													<div className='row'>
														<ClansArt />
													</div>
												  </SwipeableDrawer>
										</Grid>
							</Grid>
			 	</div>
			 	<div className='row mt-4'>
			 		<div className='col text-center'>
					  <FormControl className='m-2' style={{minWidth: 240}}>
						<InputLabel htmlFor="charBless">Благословение гармонии</InputLabel>
						  <Select
							onChange={(e) => this.changeCharBless(e)}
							value={this.props.charBless}
							inputProps={{
							  name: 'Благословение гармонии',
							  id: 'charBless',
							}}
						>
							<MenuItem value={'Нет'}>Нет</MenuItem>
							<MenuItem value={'5'}>+5 ко всем характеристикам (1)</MenuItem>
							<MenuItem value={'10'}>+10 ко всем характеристикам (3)</MenuItem>
							<MenuItem value={'15'}>+15 ко всем характеристикам (5)</MenuItem>
							<MenuItem value={'20'}>+20 ко всем характеристикам (7)</MenuItem>
							<MenuItem value={'25'}>+25 ко всем характеристикам (9)</MenuItem>
							<MenuItem value={'50'}>+50 ко всем характеристикам</MenuItem>

						</Select>
						 </FormControl>
					</div>
				</div>
			 	<div className='row'>
			 		<div className='col text-center' >
			 		<FormControl className='m-2' style={{minWidth: 240}}>
						<InputLabel htmlFor="lifeBless">Благословение жизни</InputLabel>
						<Select
							onChange={(e) => this.changeLifeBless(e)}
							value={this.props.lifeBless}
							inputProps={{
							  name: 'Благословение жизни',
							  id: 'lifeBless',
							}}
						>
							<MenuItem value={'Нет'}>Нет</MenuItem>
							<MenuItem value={'1'}>+400 HP, +200 MP (1)</MenuItem>
							<MenuItem value={'2'}>+600 HP, +300 MP (2)</MenuItem>
							<MenuItem value={'3'}>+800 HP, +400 MP (3)</MenuItem>
							<MenuItem value={'4'}>+1000 HP, +500 MP (4)</MenuItem>
							<MenuItem value={'5'}>+1200 HP, +600 MP (5)</MenuItem>
							<MenuItem value={'6'}>+1400 HP, +700 MP (6)</MenuItem>
							<MenuItem value={'7'}>+1600 HP, +800 MP (7)</MenuItem>


						</Select>
						</FormControl>
					</div>
				</div>
				<details className="golem-config">
					<summary>Спутник-голем: {golem.type === 'Нет' ? 'не выбран' : `${golem.type} · ${golem.mode}`}{supportBonus > 0 ? ` · +${supportBonus}%` : ''}</summary>
					<p>Параметры голема укажите вручную: профиль персонажа пока не передаёт их в примерочную.</p>
					<div className="golem-controls-grid">
						<FormControl fullWidth>
							<InputLabel>Тип голема</InputLabel>
							<Select value={golem.type} onChange={(e) => this.props.dispatch({type: 'Смена голема', data: {type: e.target.value, mode: e.target.value === 'Нет' ? 'Нет' : golem.mode}})}>
								{['Нет', 'Бронзовый', 'Железный', 'Золотой', 'Мифрильный'].map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
							</Select>
						</FormControl>
						{golem.type !== 'Нет' && <>
							<FormControl fullWidth>
								<InputLabel>Режим</InputLabel>
								<Select value={golem.mode} onChange={(e) => this.changeGolem('mode', e.target.value)}>
									{['Нет', 'Сражение', 'Добыча', 'Поддержка', 'Ремонт'].map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
								</Select>
							</FormControl>
							<TextField label="Уровень голема" type="number" value={golem.level} inputProps={{min: 1, max: 100}} onChange={(e) => this.changeGolem('level', e.target.value)} />
							<TextField label="Энергия" type="number" value={golem.energy} inputProps={{min: 0}} onChange={(e) => this.changeGolem('energy', e.target.value)} />
							<TextField label="Овердрайв" type="number" value={golem.overdrive} inputProps={{min: 0}} onChange={(e) => this.changeGolem('overdrive', e.target.value)} />
						</>}
					</div>
					<p className="golem-formula">Предварительный расчёт поддержки: 5% от базовых параметров; золотой голем усиливает этот бонус на 10% — до 5,5% при уровне 1, энергии 1–9 и нулевом овердрайве. Рост уровня, энергии и овердрайва сложен от базовых 5%. При нуле энергии бонус отсутствует.</p>
				</details>

			</div>
		)
	};
};

const mapStateToProps = (state) => {
	
    return {     
		level: state.levelChange,
		power: state.powerChange,
		body: state.bodyChange,
		dex: state.dexChange,
		intell: state.intellChange,
		stamina: state.staminaChange,
		will: state.willChange,
		race: state.race,
		profession: state.profession,
		professionLevel: state.professionLevel,
		religion: state.religion,
		clan: state.clan,
		clanPosition: state.clanPosition,
		clanGlory: state.clanGlory,
		fractionReputation: state.fractionReputation,
		charBless: state.charBless,
		lifeBless: state.lifeBless,
		golem: state.golem,
    }
}


export default connect(mapStateToProps)(CharInput);


