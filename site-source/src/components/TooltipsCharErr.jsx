import React from 'react';
//import ImgVisual from './ImgVisual';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { FaRegQuestionCircle } from 'react-icons/fa';

// Ввод характеристик персонажа, его уровня и т.д.
class TooltipsCharErr extends React.Component {
	
	render() {
		
		return(
			<>
			
				{this.props.type === 'chars' &&
				 <>
					<em data-tooltip-id={this.props.type}> 
						<FaRegQuestionCircle color="red" size='1em'/>
					</em>
					<ReactTooltip id={this.props.type} place="right" type="error" effect='solid'>
						<h4>Нехватка очков характеристик</h4>
						<hr/>
						<p>Вы распределили больше характеристик, чем доступно для {this.props.level} уровня <br/>(с учетом пройденного квеста "Опасные люди").</p>
						<p>Для получения дополнительных очков характеристик<br/> Вы можете повысить свой уровень.</p>
						<p>Каждый новый уровень дает <b>2 дополнительных очка характеристик</b></p>
						<em>Примерочная посчитает результаты вне зависимости<br/> от наличия данного предупреждения</em>
					</ReactTooltip>
				</>
				}
				{this.props.type === 'skills' &&
				 <>
					<em data-tooltip-id={this.props.type}> 
						<FaRegQuestionCircle color="red" size='1em'/>
					</em>
					<ReactTooltip id={this.props.type} place="right" type="error" effect='solid'>
						<h4>Нехватка очков навыков</h4>
						<hr/>
						<p>Вы распределили больше навыков, чем доступно для {this.props.level} уровня <br/>(с учетом пройденного квеста "Опасные люди").</p>
						<p>Для получения дополнительных очков навыков<br/> Вы можете повысить свой уровень.</p>
						<p>Каждый новый уровень дает <b>3 дополнительных очка навыков</b></p>
						<em>Примерочная посчитает результаты вне зависимости<br/> от наличия данного предупреждения</em>
					</ReactTooltip>
				</>
				}
	
			</>
		)
	};
};


export default TooltipsCharErr;


