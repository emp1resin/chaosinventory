import React from 'react';
//import ImgVisual from './ImgVisual';

import { connect } from 'react-redux';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import HelpIconModule from '@material-ui/icons/Help';
const HelpIcon = HelpIconModule.default?.default || HelpIconModule.default || HelpIconModule;
// Ввод характеристик персонажа, его уровня и т.д.
class CharSingle extends React.Component {
	
	constructor(props) {
			super(props);
			this.state = {
			  inputValue: ''
			};
		  }
	
	// Изменяем состояние при изменении характеристик
	updateInputValue(evt) {
		this.setState({
		  inputValue: evt.target.value
		});
		
		const data = evt.target.value;
		const param = this.props.charName;

		this.props.dispatch({
		  type: `Изменить параметр ${param}`,
		  data
		});
	  }
	
	render() {
		
		
		
		
		const level = this.props.charName === 'Уровень персонажа';
		let l = 0;
		let m = 900;
		if (level) {
			l = 1
		}
		if (level) {
			m = 120
		}
		
		
		return(
				<div className={level ? 'col-12 mb-4 mt-1' : 'col-12 mt-1'}>
					<TextField
						fullWidth={true}
						label={this.props.charName}
			
						value = {this.props.data}
			
						onChange={evt => this.updateInputValue(evt)}
						type="number"
						inputProps={{'min': l, 'max': m}}
						InputLabelProps={{
						  shrink: true,
						}}
						margin="dense"
						variant="outlined"
						InputProps={{
						  endAdornment: (
								  
									  <span data-tooltip-id={this.props.charName}>
										
									</span>
									
							  
						  ),
						}}
					  />
				</div>
		)
	};
};

//const mapStateToProps = (state) => {
//	
//    return {     
//		level: state.levelChange,
//    }
//}



export default connect()(CharSingle);


