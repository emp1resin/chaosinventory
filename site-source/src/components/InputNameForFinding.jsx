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
import { importCharacter } from '../data/characterImport';
import { requestData } from '../data/apiTransport';
import { apiBase } from '../data/apiConfig';
import { beginImport, recordDiagnostic } from '../data/diagnostics';
import BugReportButton from './BugReportButton';


var nickArr = []
// Suggestions do not depend on the original developer's service.
// The control also accepts any nickname not present in local suggestions.
const suggestions = nickArr;
async function loadSuggestions(signal) {
  const html = await requestData(`${apiBase}/api/avatar-rating-html`, {signal,format:'text',source:'rating',timeoutMs:10000});
  const doc = new DOMParser().parseFromString(html,'text/html');
  // Rating rows link the nickname via showInfo.php; names are suggestions only.
  for (const link of doc.querySelectorAll('a[href]')) {
    try {
      const url = new URL(link.getAttribute('href'),'https://chaosage.ru');
      const name = url.pathname.endsWith('/showInfo.php') && url.searchParams.get('avatar');
      if (name && !nickArr.some(item=>item.label===name)) nickArr.push({label:name});
    } catch {}
  }
}


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

class InputNameForFinding extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: 'DestinyS',
			loadedName: '',
			reportRevision: 0,
			loading: false,
			error: '',
			drawerResultsOpen: false
		};
	}


	async giveDataByName(x) {
    const nick = String(x || '').trim();
    if (!nick) { this.setState({error:'Введите ник персонажа.'}); return; }
    this.importController?.abort();
    const controller = new AbortController();
    this.importController = controller;
    beginImport(nick);
    this.setState(state => ({loading:true, error:'', importWarning:'', reportRevision:state.reportRevision+1}));
    try {
      const action = await importCharacter(nick, allItems, {signal:controller.signal});
      if (this.importController !== controller || controller.signal.aborted) return;
      this.props.dispatch(action);
      if (!nickArr.some(item=>item.label.toLocaleLowerCase()===nick.toLocaleLowerCase())) nickArr.push({label:nick});
      recordDiagnostic('import_complete', {slots:action.importMeta.equipped, warnings:action.importMeta.warnings.length});
      this.setState({loading:false, loadedName:nick,
        importWarning:action.importMeta.warnings.length ? `Не получены данные: ${action.importMeta.warnings.join(', ')}. Проверьте эти поля вручную.` : ''});
    } catch (error) {
      if (this.importController !== controller || controller.signal.aborted) return;
      controller.abort();
      recordDiagnostic('import_failed', {code:error.code || 'UNKNOWN', message:String(error.message).slice(0,240)});
      this.setState({loading:false,error:error.message || 'Не удалось загрузить персонажа.'});
    }
  }
  componentDidMount() { this.suggestionsController=new AbortController();loadSuggestions(this.suggestionsController.signal).catch(()=>{}); }
  componentWillUnmount() { this.importController?.abort();this.suggestionsController?.abort(); }
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
			<Typography variant="caption" component="p" className="toolbar-hint">
				После загрузки укажите навыки, клановые артефакты, благословения и активные эликсиры вручную.
			</Typography>
			<div className = 'col-12 toolbar-status' > {
				this.state.loading && < LinearProgress / >
			}
			{this.state.importWarning && <Typography role="status" style={{marginTop:8}}>{this.state.importWarning}</Typography>}
			{this.state.error && <Typography color="error" style={{marginTop: 8}}>{this.state.error}</Typography>}
			<BugReportButton nick={this.state.name} lastError={this.state.error}
				build={this.state.error ? null : this.props.reportState} loadedNick={this.state.loadedName}
				resetKey={this.state.reportRevision} />

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


export default connect(state => ({ reportState: state }))(InputNameForFinding);
