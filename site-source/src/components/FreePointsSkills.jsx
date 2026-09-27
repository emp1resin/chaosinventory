import React from 'react';
import TooltipsCharErr from './TooltipsCharErr';

import { connect } from 'react-redux';


class FreePointsSkills extends React.Component {
	
	constructor(props) {
			super(props);
			this.state = {
			  freePoint: 3
			};
		  }

	render() {

		// Считаем затраты на данный навык
		function getPointsCount(x) {
			if (x>100) {
				return 0;
			}
			if (x > 0) {
				return Math.ceil(x/2) + getPointsCount(x-1)
			} 
			return 0
		}

		let level = this.props.level*3 + this.state.freePoint;
		
		// пересчитываем все навыки
		for (var x in this.props.allSkills) {
			
			level -= getPointsCount(this.props.allSkills[x]) + this.props.allSkillsNeedPoints[x]
		}
		
		return(
			<div className={level<0 ? 'text-danger' : "text-primary"}>Свободных очков навыков: {level} {level<0 ? <TooltipsCharErr type={'skills'} level={this.props.level}/> : ''}</div>
		)
	};
};

const mapStateToProps = (state) => {
	
    return {
        allSkills: state.allSkills,
        allSkillsNeedPoints: state.allSkillsNeedPoints,
		level: state.levelChange,
		changeSkills: state.changeSkills,
		
    }
}

export default connect(mapStateToProps)(FreePointsSkills);


