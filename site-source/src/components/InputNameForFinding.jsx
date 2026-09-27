/* eslint no-eval: 0 */
import React from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
	makeStyles
} from '@material-ui/core/styles';

import CloudUploadIconModule from '@material-ui/icons/CloudUpload';
const CloudUploadIcon = CloudUploadIconModule.default?.default || CloudUploadIconModule.default || CloudUploadIconModule;
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
	connect
} from 'react-redux';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Results from './Results';
import allItems from './ItemsAll';
import { fetchGameJson, fetchOptionalGameJson } from '../data/gameApi';


var nickArr = []
const breachRuneApiCache = new Map()

async function normalizeBreachRune(item) {
	if (!item) return item
	const rawCode = String(item.breachRune || '0')
	if (rawCode === '0' || rawCode === '') {
		item.breachRune = ''
		item.breachRuneImported = false
		return item
	}

	if (!/^\d+$/.test(rawCode)) {
		item.breachRune = rawCode.toLowerCase()
		item.breachRuneImported = true
		return item
	}

	try {
		if (!breachRuneApiCache.has(rawCode)) {
			breachRuneApiCache.set(rawCode,
				fetch(`https://chaosage.ru/sAPI2.php?id=${rawCode}&request=equipment_info`)
					.then(response => {
						if (!response.ok) throw new Error(`Руна Разлома ${rawCode}: ${response.status}`)
						return response.json()
					})
			)
		}
		const runeInfo = await breachRuneApiCache.get(rawCode)
		const slug = runeInfo.image?.match(/br_([a-z]+)\.png/i)?.[1]
			|| runeInfo.name?.replace(/^Руна\s+/i, '').trim().toLowerCase()
		item.breachRuneApiId = rawCode
		item.breachRune = slug || `api-${rawCode}`
		item.breachRuneName = runeInfo.name || `Руна Разлома #${rawCode}`
		item.breachRuneDescription = runeInfo.desc || ''
		item.breachRuneImage = runeInfo.image ? `https://chaosage.ru/images/${runeInfo.image}` : ''
		item.breachRuneImported = true
	} catch (error) {
		console.warn('Не удалось определить руну Разлома', rawCode, error)
		item.breachRuneApiId = rawCode
		item.breachRune = `api-${rawCode}`
		item.breachRuneName = `Неизвестная руна Разлома #${rawCode}`
		item.breachRuneImported = true
	}
	return item
}


fetch('https://chaosage.app/resources/nickParse.php')
	.then(response => response.json())
	.then((jsonData) => {


		var nick = JSON.parse(jsonData.out);


		for (var i = 0; i < nick.length; i++) {
			nickArr.push({
				label: nick[i].name
			})
		}
		//			console.log(nickArr)
	})
	.catch((error) => {
		// handle your errors here
		console.log(error)
	})


const suggestions = nickArr;

function renderInputComponent(inputProps) {
	const {
		classes,
		inputRef = () => {},
		ref,
		...other
	} = inputProps;

	return ( <
		TextField fullWidth InputProps = {
			{
				inputRef: node => {
					ref(node);
					inputRef(node);
				},
				classes: {
					input: classes.input,
				},
			}
		} {
			...other
		}
		/>
	);
}

function renderSuggestion(suggestion, {
	query,
	isHighlighted
}) {
	const matches = match(suggestion.label, query);
	const parts = parse(suggestion.label, matches);

	return ( <
		MenuItem selected = {
			isHighlighted
		}
		component = "div" >
		<
		div > {
			parts.map(part => ( <
				span key = {
					part.text
				}
				style = {
					{
						fontWeight: part.highlight ? 500 : 400
					}
				} > {
					part.text
				} <
				/span>
			))
		} <
		/div> <
		/MenuItem>
	);
}

function getSuggestions(value) {
	const inputValue = deburr(value.trim()).toLowerCase();
	const inputLength = inputValue.length;
	let count = 0;

	return inputLength === 0 ?
		[] :
		suggestions.filter(suggestion => {
			const keep =
				count < 8 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

			if (keep) {
				count += 1;
			}

			return keep;
		});
}

function getSuggestionValue(suggestion) {
	return suggestion.label;
}

const useStyles = makeStyles(theme => ({
	root: {
		//    height: 40,
		flexGrow: 1,
		marginBottom: 15
	},
	container: {
		position: 'relative',
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 2,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
		backgroundColor: 'white',
	},
	suggestion: {
		display: 'block',
		backgroundColor: 'white',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
		backgroundColor: 'white',
	},
	divider: {
		height: theme.spacing(2),
	}
}));




function IntegrationAutosuggest(props) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [state, setState] = React.useState({
		single: '',
		popper: '',
	});

	const [stateSuggestions, setSuggestions] = React.useState([]);

	const handleSuggestionsFetchRequested = ({
		value
	}) => {
		setSuggestions(getSuggestions(value));
	};

	const handleSuggestionsClearRequested = () => {
		setSuggestions([]);
	};

	const handleChange = name => (event, {
		newValue
	}) => {

		props.updateData(newValue)
		setState({
			...state,
      [name]: newValue,
		});
	};

	const autosuggestProps = {
		renderInputComponent,
		suggestions: stateSuggestions,
		onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
		onSuggestionsClearRequested: handleSuggestionsClearRequested,
		getSuggestionValue,
		renderSuggestion,
	};


	return ( <
		div className = {
			classes.root
		} >


		<
		Autosuggest {
			...autosuggestProps
		}
		inputProps = {
			{
				classes,
				id: 'react-autosuggest-popper',
				label: 'Загрузка по Нику',
				placeholder: 'Введите Ник персонажа',
				value: state.popper,
				onChange: handleChange('popper'),
				inputRef: node => {
					setAnchorEl(node);
				},
				InputLabelProps: {
					shrink: true,
				},
			}
		}
		theme = {
			{
				suggestionsList: classes.suggestionsList,
				suggestion: classes.suggestion,
			}
		}
		renderSuggestionsContainer = {
			options => ( <
				Popper anchorEl = {
					anchorEl
				}
				open = {
					Boolean(options.children)
				} >
				<
				Paper square {
					...options.containerProps
				}
				style = {
					{
						width: anchorEl ? anchorEl.clientWidth : undefined
					}
				} >
				{
					options.children
				} <
				/Paper> <
				/Popper>
			)
		}
		/> <
		/div>
	);
};

// id вещей оригинальные, для сетов солнца и некоторых других
var sets_data = {}
sets_data['Стихия'] = ['1194', '1195', '1196', '1197', '1198', '1199', '1200', '1201', '1202', '1203', '1224', '1225', '1226', '1227', '1228', '1229', '1230', '1231', '1232', '1233', '1254', '1255', '1256', '1257', '1258', '1259', '1260', '1261', '1262', '1263']
sets_data['Тьма'] = ['1214', '1215', '1216', '1217', '1218', '1219', '1220', '1221', '1222', '1223', '1244', '1245', '1246', '1247', '1248', '1249', '1250', '1251', '1252', '1253', '1274', '1275', '1276', '1277', '1278', '1279', '1280', '1281', '1282', '1283']
sets_data['Свет'] = ['1204', '1205', '1206', '1207', '1208', '1209', '1210', '1211', '1212', '1213', '1234', '1235', '1236', '1237', '1238', '1239', '1240', '1241', '1242', '1243', '1264', '1265', '1266', '1267', '1268', '1269', '1270', '1271', '1272', '1273']

sets_data['Сила'] = ['1284', '1285', '1286', '1287', '1288', '1289', '1290', '1291', '1292', '1293', '1294', '1295', '1296', '1297', '1298', '1299', '1332', '1333', '1334', '1335', '1336', '1337', '1338', '1339', '1340', '1341', '1342', '1343', '1344', '1345', '1346', '1347', '1380', '1381', '1382', '1383', '1384', '1385', '1386', '1387', '1388', '1389', '1390', '1391', '1392', '1393', '1394', '1395']


sets_data['Тело'] = ['1300', '1301', '1302', '1303', '1304', '1305', '1306', '1307', '1308', '1309', '1310', '1311', '1312', '1313', '1314', '1315', '1348', '1349', '1350', '1351', '1352', '1353', '1354', '1355', '1356', '1357', '1358', '1359', '1360', '1361', '1362', '1363', '1396', '1397', '1398', '1399', '1400', '1401', '1402', '1403', '1404', '1405', '1406', '1407', '1408', '1409', '1410', '1411']

sets_data['Ловкость'] = ['1316', '1317', '1318', '1319', '1320', '1321', '1322', '1323', '1324', '1325', '1326', '1327', '1328', '1329', '1330', '1331', '1364', '1365', '1366', '1367', '1368', '1369', '1370', '1371', '1372', '1373', '1374', '1375', '1376', '1377', '1378', '1379', '1412', '1413', '1414', '1415', '1416', '1417', '1418', '1419', '1420', '1421', '1422', '1423', '1424', '1425', '1426', '1427']


class InputNameForFinding extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: 'DestinyS',
			loading: false,
			error: '',
			drawerResultsOpen: false
		};
	}


	giveDataByName(x) {
		if (!x || !x.trim()) {
			this.setState({error: 'Введите ник персонажа.'});
			return;
		}

		this.setState({
			loading: true,
			error: '',

		});


		// Загружаем список вещей и некоторые параметры игрока своим парсером
		fetchGameJson(`https://chaosage.space/getAvatarsDataByName?name=${encodeURIComponent(x.trim())}`)
			.then((jsonData) => {
				if (!jsonData.out) throw new Error('Персонаж не найден.');

				for (var i in jsonData.out.things) {


					for (var j = 0; j < allItems.length; j++) {

						if (allItems[j].name === jsonData.out.things[i]) {
							jsonData.out.things[i] = allItems[j]
							break
						}
					}

				}

				//			console.log(jsonData)

				var urls = [
					  "https://chaosage.space/religionAndClansData",
					  `https://chaosage.ru/sAPI2.php?user_name=${encodeURIComponent(x.trim())}&request=user_fraction`,
					  `https://chaosage.ru/sAPI2.php?user_name=${encodeURIComponent(x.trim())}&request=clan_list_by_user_name`,
					  `https://chaosage.ru/sAPI2.php?user_name=${encodeURIComponent(x.trim())}&request=user_equipment_list`,
					]
				return Promise.all([
					fetchOptionalGameJson(urls[0]),
					fetchOptionalGameJson(urls[1]),
					fetchOptionalGameJson(urls[2]),
					fetchGameJson(urls[3]),
				])
					.then(result => {
						if (!result[3] || typeof result[3] !== 'object') {
							throw new Error('Игра не вернула список надетых вещей.')
						}
						var p_c = result[2] || {}
						var secondJsonData = {
							clansData: result[0] || {clansArr: {}},
							fractionData: result[1] || {},
							positionOnClan: Object.values(p_c),
							listOfThings: result[3],
						}
						//						console.log(secondJsonData)
						//						console.log(secondJsonData)


						let position = 100;
						if (secondJsonData.positionOnClan) {
							for (var i = 0; i < secondJsonData.positionOnClan.length; i++) {
								//								console.log(secondJsonData.positionOnClan[i])
								if (x.trim().toLocaleLowerCase() === String(secondJsonData.positionOnClan[i][1]).toLocaleLowerCase()) {
									position = i + 1
									break
								}
							}
						}

						// перебираем модификаторы
						//						console.log(secondJsonData.listOfThings)
						if (secondJsonData.listOfThings) {
							for (var j = 0; j < secondJsonData.listOfThings.length; j++) {
								console.log(secondJsonData.listOfThings[j])
							}
						}


						if (jsonData.out.clan === 'нет') {
							jsonData.out.clan = 'Нет'
						}


						var urls2 = [
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.arms}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.gloves}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.weapon}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.belt}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.boots}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.helm}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.amulet}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.shield}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.ring1}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.ring2}&request=equipment_info`,
					  `https://chaosage.ru/sAPI2.php?id=${secondJsonData.listOfThings.armor}&request=equipment_info`,
					]
						return Promise.all(urls2.map(url => fetchGameJson(url)))
							.then(items => Promise.all(items.map(normalizeBreachRune)))
							.then(result => {

								// перебираем вещи, чтобы присвоить некоторые особые значения для сетов солнца
//								console.log('Вещи, которые мы выгрузили', result)
//								// Для начала заполним список оригинальных Id вещей (так как в игре сломалась страничка персонажа)
//								for (var i_ in result) {
//									
//									if (result[i_].original_id) {
//										console.log(result[i_].original_id)
//									}
//									
//								}
								for (var i_ in result) {
									// Сеты Солнца на мага
									if ((result[i_].set == '23') || ((result[i_].set == '24')) || ((result[i_].set == '25'))) {
										//										
										// перебираем имена вещей на персонаже
										for (var i in jsonData.out.things) {

											// 
											if (jsonData.out.things[i] == result[i_].name.split('(')[0]) {

												if (sets_data['Стихия'].includes(result[i_].original_id)) {
													jsonData.out.things[i] += ' Стихия'
												} else if (sets_data['Тьма'].includes(result[i_].original_id)) {
													jsonData.out.things[i] += ' Тьма'
												} else if (sets_data['Свет'].includes(result[i_].original_id)) {
													jsonData.out.things[i] += ' Свет'
												}

												for (var j = 0; j < allItems.length; j++) {

													if (allItems[j].name === jsonData.out.things[i]) {
														jsonData.out.things[i] = allItems[j]
														break
													}
												}
											}



										}

									} else if ((result[i_].set == '26') || ((result[i_].set == '27')) || ((result[i_].set == '28'))) {
										//										
										// перебираем имена вещей на персонаже
										for (var i in jsonData.out.things) {

											// 
											if (jsonData.out.things[i] == result[i_].name.split('(')[0]) {

												if (sets_data['Сила'].includes(result[i_].original_id)) {
													jsonData.out.things[i] += ' Сила'
												} else if (sets_data['Ловкость'].includes(result[i_].original_id)) {
													jsonData.out.things[i] += ' Ловкость'
												} else if (sets_data['Тело'].includes(result[i_].original_id)) {
													jsonData.out.things[i] += ' Тело'
												}

												for (var j = 0; j < allItems.length; j++) {

													if (allItems[j].name === jsonData.out.things[i]) {
														jsonData.out.things[i] = allItems[j]
														break
													}
												}
											}



										}

									}
								}
								//								console.log('Вещи на выходе', result)
								this.setState({
									loading: false
								});


								this.props.dispatch({
									type: `Загрузка персонажа`,
									data: jsonData,
									dataGlory: secondJsonData.clansData.clansArr[jsonData.out.clan] * 1,
									fractionData: secondJsonData.fractionData.fractionRLevel * 1 || 0,
									positionOnClan: position,
									modifireInformation: result
								});
							})



					});


			})
			.catch((error) => {
				console.error(error)
				this.setState({loading: false, error: error.message || 'Не удалось загрузить персонажа.'})
			})
	};
	updateData = (value) => {
		this.setState({
			name: value
		})
	};

						
	setSet = (e) => {
		console.log('Надeть сет', e.target.value)
		var set_name = e.target.value
		var type = ''
		// Проверяем особые комплекты
		if ((set_name.includes('Комплект Жреца')) || (set_name.includes('Комплект Стража'))) {
			
			type = set_name.split(' ')[3]
			set_name = set_name.split(' ')[0] + ' ' + set_name.split(' ')[1] + ' ' + set_name.split(' ')[2]
		}


		this.props.dispatch({
			type: `Нацепить сет`,
			set_name, items: allItems.filter((item, i)=>{
				if (item.complect === set_name) {
					
					if (type === 'Свет') {
						if (item['parametrs']['заклинатель'] > item['parametrs']['разрушитель']) {
							return true
						}
						return false
					}
					if (type === 'Стихия') {
						if (item['parametrs']['разрушитель'] > item['parametrs']['заклинатель']) {
							return true
						}
						return false
					}
					if (type === 'Тьма') {
						if (item['parametrs']['призыватель'] > item['parametrs']['заклинатель']) {
							return true
						}
						return false
					}
					
					if (type === 'Сила') {
						if (item['needPower'] > item['needBody']) {
							return true
						}
						return false
					}
					if (type === 'Тело') {
						if (item['needBody'] > item['needPower']) {
							return true
						}
						return false
					}
					if (type === 'Ловкость') {
						if (item['needDex'] > item['needPower']) {
							return true
						}
						return false
					}
					
					return true
				}
				return false
			}).map(obj=> ({ ...obj, runes: '', runeWord: '', typeThing: obj.kindOfThing }))
		});
	}					
	
	openDrawersResults = (e) => {
		this.setState({
			drawerResultsOpen: !this.state.drawerResultsOpen
		})
	}
	render() {
		const setOptions = ['Нет'];
		[...new Set(allItems.map((item) => item.complect))]
			.filter((name) => name && !['Нет', 'Некомплектный'].includes(name))
			.sort((a, b) => a.localeCompare(b, 'ru'))
			.forEach((name) => {
				if (name.includes('Комплект Жреца')) {
					setOptions.push(`${name} Свет`, `${name} Стихия`, `${name} Тьма`);
				} else if (name.includes('Комплект Стража')) {
					setOptions.push(`${name} Сила`, `${name} Тело`, `${name} Ловкость`);
				} else {
					setOptions.push(name);
				}
			});

		return ( <>
			<div className = 'col-xl-2 col-lg-3  col-md-4  col-sm-12 col-12' >
				<IntegrationAutosuggest updateData = {this.updateData}/> 
			</div>
			<div className = 'col-xl-2 col-lg-3 col-md-4  col-sm-8 col-6' >

				<Button variant = "contained" color = "primary"
					onClick = {() => this.giveDataByName(this.state.name)}>
					<CloudUploadIcon style = {{marginRight: 15}}/>Загрузить </Button>
				<Typography variant="caption" component="p" style={{marginTop: 8, maxWidth: 440}}>
					После загрузки укажите навыки, мастерство, клановые артефакты, турнирную руну и благословения вручную. Активные эликсиры API не возвращает; в расчёт они не включены.
				</Typography>

			</div> 
			<div className = 'col-xl-3 col-lg-4 col-md-5  col-sm-8 col-6' >

				<FormControl className='m-2' style={{minWidth: 120}}>
					<InputLabel htmlFor="set_avatar">Надеть сет</InputLabel>
					<Select
						onChange={(e) => this.setSet(e)}
						inputProps={{
						  name: 'Сет',
						  id: 'set_avatar',
							  defaultValue: 'Нет'
						}}
					>
						{setOptions.map((item) => {
							return <MenuItem key={item} value={item}>{item}</MenuItem>
						})}
						
					</Select>

			  </FormControl>
			</div> 
			<div className = 'col-xl-5 col-lg-2  col-md-3 col-sm-4  col-6' >
			
				<Button variant = "contained"
						color = "primary"
						onClick = {() => this.openDrawersResults()}> Результаты </Button>


			</div> 
			<div className = 'col-12'
			style = {
				{
					height: 5
				}
			} > {
				this.state.loading && < LinearProgress / >
			}
			{this.state.error && <Typography color="error" style={{marginTop: 8}}>{this.state.error}</Typography>}

			<
			/div> <
			SwipeableDrawer anchor = "right"
			open = {
				this.state.drawerResultsOpen
			}
			onClose = {
				() => this.openDrawersResults()
			}
			onOpen = {
				() => this.openDrawersResults()
			} >
			<
			div className = 'row' >
			<
			Results / >
			<
			/div> <
			/SwipeableDrawer> <
			/>
		)
	}


}


export default connect()(InputNameForFinding);
