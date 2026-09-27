import React from 'react';
//import ImgVisual from './ImgVisual';
import { Tooltip as ReactTooltip } from 'react-tooltip';

//import { FaRegQuestionCircle } from 'react-icons/fa';

// Ввод характеристик персонажа, его уровня и т.д.
class TooltipsSkillsInfo extends React.Component {
	
	render() {
//		console.log(this.props)
		return(
			<>
				<b data-tooltip-id={this.props.id}> 
					{(this.props.secondName) ? this.props.secondName : this.props.nameSkills}
				</b>
				<ReactTooltip
					className="skill-tooltip"
					id={this.props.id}
					place="right"
					positionStrategy="fixed"
					portalRoot={document.body}
					clickable
					delayShow={250}
					opacity={1}
				>
					<p className='text-left' style={{whiteSpace: 'pre-line'}}><strong>Новичок:</strong> {this.props.contentNoob}</p>
					<p className='text-left' style={{whiteSpace: 'pre-line'}}><strong>Эксперт:</strong> {this.props.contentExpert}</p>
					<p className='text-left' style={{whiteSpace: 'pre-line'}}><strong>Мастер:</strong> {this.props.contentMaster}</p>
					{this.props.contentGrandmaster && <p className='text-left' style={{whiteSpace: 'pre-line'}}><strong>Грандмастер:</strong> {this.props.contentGrandmaster}</p>}
				</ReactTooltip>
			</>
		)
	};
};


export default TooltipsSkillsInfo;


