import React from 'react';
import TooltipsCharErr from './TooltipsCharErr';

import { connect } from 'react-redux';

// Иконки
//import $ from "jquery";
// Ввод характеристик персонажа, его уровня и т.д.


class FreePointsChar extends React.Component {
	
	constructor(props) {
			super(props);
			this.state = {
			  freePoint: 31
			};
		  }
	
	
	render() {

		const level = this.props.level*2 + this.state.freePoint - (this.props.spendPoints || 0);

		return(
			<div className={level<0 ? 'text-danger' : "text-primary"}>Свободных очков характеристик: {level} {level<0 ? <TooltipsCharErr type={'chars'} level={this.props.level}/> : ''}</div>
		)
	};
};

const mapStateToProps = (state) => {
	
//	console.log(state)
    return {
        spendPoints: state.powerChange + state.bodyChange + state.dexChange + state.intellChange + state.staminaChange + state.willChange,
		level: state.levelChange
		
    }
}

export default connect(mapStateToProps)(FreePointsChar);


