import React from 'react';
import ItemsList from './ItemsList';

//import { makeStyles } from '@material-ui/core/styles';
//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
//import ListItemText from '@material-ui/core/ListItemText';
//import ListItemAvatar from '@material-ui/core/ListItemAvatar';
//import Avatar from '@material-ui/core/Avatar';
//import ImageIcon from '@material-ui/icons/Image';
//import WorkIcon from '@material-ui/icons/Work';
//import BeachAccessIcon from '@material-ui/icons/BeachAccess';


import { connect } from 'react-redux';

//const mainClass = {
//    width: '100%',
//    width: 300,
//    backgroundColor: 'white',
//  };

// Ввод характеристик персонажа, его уровня и т.д.
class ItemsFit extends React.Component {

	
	
	constructor(props) {
		super(props);
		this.state = {
			typeThing: 'Наручи'
		};
	}
	
	// Перерендерим только пр иизменении состояния, а не пропсов
	
//	shouldComponentUpdate(nextProps, nextState) {
//		if (this.state.typeThing===nextState.typeThing) {
//			return false
//		}
//		return true
//	}
	
	
	handleClick(event, index) {

		//			console.log(index)
		this.setState({
			typeThing: index
		})

	}
	
	render() {
	
//		console.log('Рендерим ')
//		
//		const itemsTypeList = [{
//			name: 'Наручи',
//			count: 0
//		},{
//			name: 'Перчатки',
//			count: 0
//		},{
//			name: 'Пояса',
//			count: 0
//		},{
//			name: 'Ботинки',
//			count: 0
//		},{
//			name: 'Шлемы',
//			count: 0
//		},{
//			name: 'Амулеты',
//			count: 0
//		}];
//		

	
		return(
			<div className='row'>
				
				<div className='col'>
					<ItemsList/>
				</div>
				
			</div>
		)
	};
};



export default connect()(ItemsFit);


