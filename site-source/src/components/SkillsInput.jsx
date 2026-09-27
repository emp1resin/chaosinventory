import React from 'react';
import SkillsSingle from './SkillsSingle';
import FreePointsSkills from './FreePointsSkills';
import skillsSummary from './SkillsProps';

import { connect } from 'react-redux';


//import './SkillsProps';
// Ввод характеристик персонажа, его уровня и т.д.
class SkillsInput extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			typeSkills: 'all'
		};
	}
	
	
	updateInputValue(e) {
//		let {
//			name,
//			value
//		} = e.target;
		

		this.setState({
		  typeSkills: e.target.value
		});
	}
	
	// Перерендерим только пр иизменении состояния, а не пропсов
	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.typeSkills !== this.state.typeSkills);
	}
	
	
	render() {

		function Skills(props) {

			// передаем каждому из навыков его пропс из общего стора по id
			  const sidebar = (
				  	<>
					  {props.skills.map((skill) =>
								<SkillsSingle key={skill.id} 
								  	skillName={skill.name} 
								  	secondName={skill.secondName} 
									contentNoob={skill.contentNoob} 
								  	contentExpert={skill.contentExpert} 
									contentMaster={skill.contentMaster}
									contentGrandmaster={skill.contentGrandmaster}
								  	skillId={skill.id} typeNeed={props.type} 
								  	type={skill.type}/>
					  )}
					</>
			  );
		
			  return (
				  <>
				  	{sidebar}
				  </>
			  );
		}
	
	
//	console.log(this.state.typeSkills)
		return(
			<div>
				<h3>Навыки</h3>
				<FreePointsSkills/>
				<p className="skill-faq-note">Грандмастер доступен у четырёх навыков. FAQ не указывает дополнительные затраты очков на этот ранг; в счётчике он пока равен рангу «Мастер».</p>
			 	<div className='row mt-1 mb-1'>
			 		<div className='col '>
						<div className="input-group mb-3">
						  <div className="input-group-prepend">
							<label className="input-group-text" htmlFor="TypeOfSkills">Тип навыков</label>
						  </div>
						  <select value={this.state.typeSkills} className="custom-select" id="TypeOfSkills" onChange={evt => this.updateInputValue(evt)}>
							<option value="all">Все</option>
							<option value="warrior">Воинские</option>
							<option value="magic">Магические</option>
							<option value="defence">Защитные</option>
							<option value="atack">Атакующие</option>
							<option value="alchemy">Алхимические</option>
							<option value="forAll">Общие</option>
						  </select>
						</div>
					</div>
				</div>
			 	<div className='row'  style={this.state.typeSkills === 'all' ? {maxHeight: 350, overflowY: 'scroll'} : {}}>
					<Skills skills={skillsSummary} type={this.state.typeSkills} />
				</div>
			</div>
		)
	};
};

//Array.prototype.last = function() {
// return this[this.length - 1];
//}

//const mapStateToProps = (state) => {
//	
////	console.log(state.allSkills)
////	Получаем пропсы навыков для отображения их, если скрываем часть
//    return {
//        allSkills: state.allSkills,
//        allSkillsMaster: state.allSkillsMaster,
//    }
//}


export default connect()(SkillsInput);
