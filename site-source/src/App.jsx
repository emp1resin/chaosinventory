import React from 'react';
//import Info from './components/Info';
import 'bootstrap/dist/css/bootstrap.css';

//import VisualBlock from './components/VisualBlock';
import CharInput from './components/CharInput';
import SkillsInput from './components/SkillsInput';
//import BottomMenu from './components/BottomMenu';

import ItemsFit from './components/ItemsFit';

import InputNameForFinding from './components/InputNameForFinding';
import SaveState from './components/SaveState';
import BuildCost from './components/BuildCost';



import './App.css';
import 'typeface-roboto';

import { connect } from 'react-redux';


class App extends React.Component {

	
	
	
	render() {

		

		return(
			<main className='app-shell'>
				<header className='hero'>
					<div>
						<p className='eyebrow'>Аватары · Эпоха Хаоса</p>
						<h1>ChaosInventory</h1>
						<p className='hero-copy'>Соберите образ, проверьте руны и сравните итоговые параметры.</p>
					</div>
					<div className='data-badge'><span></span> Данные FAQ и игрового API</div>
				</header>
				<div className='workspace'>
		 		
		 		<div className='row toolbar'>
					<InputNameForFinding/>
					<SaveState/>
				</div>
				<BuildCost/>
		 		<div className='row'>
					
					<div className='col-xl-4 col-lg-4  col-md-5'>
						<div className='panel p-3'>
							<CharInput/>
						</div>
					</div>
					<div className='col-xl-8 col-lg-8  col-md-7'>
						<div className='panel p-3'>
							<ItemsFit/>
							<SkillsInput/>
						</div>
					</div>
			
				</div>
		 		
				
		 		</div>
		 	</main>
		)
	};
};


export default connect()(App);
