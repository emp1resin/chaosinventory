import React from 'react';
import TooltipsSkillsInfo from './TooltipsSkillsInfo';

import { connect } from 'react-redux';

// Ввод характеристик персонажа, его уровня и т.д.
class SkillsSingle extends React.Component {
//	
	constructor(props) {
			super(props);
			this.state = {
			  inputValue: 0,
			  masterPoint: 0,
			  spendPoints: 0,
			};
		  }
	
	
	
	
//	// Изменяем состояние при изменении навыка
	updateInputValue(evt) {
		
		this.setState({
		  inputValue: evt.target.value,
		  spendPoints: evt.target.value*2,
		});
		
		

		const data = evt.target.value;
		const param = this.props.skillName;
//
		this.props.dispatch({
		  type: `Изменить навык ${param}`,
		  data
		});
	  }
	
	updateInputValue2(evt) {
		
		this.setState({
		  masterPoint: evt.target.value
		});
		
		const data = evt.target.value;
		const param = this.props.skillName;
//
		this.props.dispatch({
		  type: `Изменить мастерство навыка ${param}`,
		  data
		});
	  }
	
	render() {
		
		
		let typeDiff = true
		// Сравниваем искомый тип навыка с текущим
		if (this.props.typeNeed !== 'all') {
			typeDiff = this.props.typeNeed === this.props.type;
		} else {
			typeDiff = true
		}

		
		// Суммарно затрат на данный навык
		const pointNeededForThisSkills = this.props.allSkillsNeedPoints[this.props.skillId];
		
		// Сколько конкретного навыка вкачено всего
		const pointThisSkills  = this.props.allSkills[this.props.skillId];
		
		// Какое значение мастерства у данного навыка
		const masterOfThisSkills  = this.props.allSkillsMaster[this.props.skillId];

		
		// Считаем затраты на данный навык
		function getPointsCount(x) {
			if (x>100) {
				return 0;
			}
//			console.log(x)
			if (x > 0) {
				return Math.ceil(x/2) + getPointsCount(x-1)
			} 
			return 0
		}
		
		// Цветовое оформление выбранных навыков
		let k = (pointThisSkills+masterOfThisSkills)/50+1;
		const color = `rgb(${255/k}, ${255/k}, ${255/k})`
		
		return(
			
			<>
				{typeDiff && 
					<div className='col-12'>
						<div className="input-group input-group-sm mb-1" >
						  <div className="input-group-prepend w-50" >
							<label className="input-group-text  w-100"  style={{backgroundColor: color}} htmlFor={this.props.skillId}>
								<TooltipsSkillsInfo 
									id={this.props.skillId} 
									nameSkills={this.props.skillName} 
									secondName={this.props.secondName} 
									contentNoob={this.props.contentNoob} 
									contentExpert={this.props.contentExpert} 
									contentMaster={this.props.contentMaster}
									contentGrandmaster={this.props.contentGrandmaster}/>
							</label>
						  </div>
						<input type="number" min={0} max={40} value={pointThisSkills}  className="form-control" onChange={evt => this.updateInputValue(evt)} />
			
						  <select style={{backgroundColor: color}}  value={masterOfThisSkills} className="custom-select" id={this.props.skillId} onChange={evt => this.updateInputValue2(evt)}>
							<option value="0">Новичок</option>
							<option value="1">Эксперт</option>
							<option value="2">Мастер</option>
							{this.props.contentGrandmaster && <option value="3">Грандмастер</option>}
						  </select>
						<input type="text" disabled value={getPointsCount(pointThisSkills) + pointNeededForThisSkills}  className="form-control" />

						</div>
					</div>
				}
			</>
			
			
		)
	};
};

const mapStateToProps = (state) => {
	
//	console.log(state.allSkills)
//	Получаем пропсы навыков для отображения их, если скрываем часть
    return {
        allSkillsNeedPoints: state.allSkillsNeedPoints,
        allSkillsMaster: state.allSkillsMaster,
        allSkills: state.allSkills,
    }
}


export default connect(mapStateToProps)(SkillsSingle);


