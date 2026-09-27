import React from 'react';


import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
//import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';

class ClansArt extends React.Component {
	

	changeArts(e, v, w) {
		if (v !== 'Изменить ') {
			this.props.dispatch({
			  type: v
			});
		} else {
			this.props.dispatch({
			  type: v + w,
				data: e.target.value
			});
		}
		
	}
	
	changeTur() {
		this.props.dispatch({
		  type: 'Изменить Турнирная руна'
		});
	}
	render() {

		const clansArt = [{
			name: 'Маска огненного демона',
			params: ` урон ${Math.round(7*this.props.clansArtMask * this.props.level/10 * (1-0.015*(this.props.clansArtMask -1)))} - ${Math.round(11*this.props.clansArtMask * this.props.level/10 * (1-0.015*(this.props.clansArtMask -1)))} , здоровье +${Math.round(20*this.props.clansArtMask * this.props.level/10 * (1-0.015*(this.props.clansArtMask -1)))}, восстановление здоровья +${Math.round(1*this.props.clansArtMask * this.props.level/10 * (1-0.015*(this.props.clansArtMask -1)))}`,
			url: 'https://chaosage.ru/images/fireDemonMask.gif',
			val: this.props.clansArtMask
		}, {
			name: 'Меч вечного сияния',
			params: ` атака +${Math.round(10*this.props.clansArtSword * this.props.level/10 * (1-0.015*(this.props.clansArtSword -1)))}, защита +${Math.round(6*this.props.clansArtSword * this.props.level/10 * (1-0.015*(this.props.clansArtSword -1)))}, крит. удар +${Math.round(2*this.props.clansArtSword * this.props.level/10 * (1-0.015*(this.props.clansArtSword -1)))}, пробой брони +${Math.round(3*this.props.clansArtSword * this.props.level/10 * (1-0.015*(this.props.clansArtSword -1)))}`,
			url: 'https://chaosage.ru/images/ethernalShineSword.gif',
			val: this.props.clansArtSword
		}, {
			name: 'Сфера небесной энергии',
			params: ` мана +${Math.round(40*this.props.clansArtSphere * this.props.level/10 * (1-0.015*(this.props.clansArtSphere -1)))}, восстановление маны +${Math.round(1*this.props.clansArtSphere * this.props.level/10 * (1-0.015*(this.props.clansArtSphere -1)))}`,
			url: 'https://chaosage.ru/images/skyEnergySphere.gif',
			val: this.props.clansArtSphere
		}, {
			name: 'Руна правителей',
			params: ` ОД на действие -${Math.round(10*0.5*this.props.clansArtRune * (1-0.015*(this.props.clansArtRune -1)))/10}, здоровье +${Math.round(50*this.props.clansArtRune * this.props.level/10 * (1-0.015*(this.props.clansArtRune -1)))}, мана +${Math.round(50*this.props.clansArtRune * this.props.level/10 * (1-0.015*(this.props.clansArtRune -1)))}, броня +${Math.round(4*this.props.clansArtRune * this.props.level/10 * (1-0.015*(this.props.clansArtRune -1)))}, сопротивление +${Math.round(4*this.props.clansArtRune * this.props.level/10 * (1-0.015*(this.props.clansArtRune -1)))}`,
			url: 'https://chaosage.ru/images/runeOfRulers.gif',
			val: this.props.clansArtRune
		}]
//		const level = this.props.level*2 + this.state.freePoint - (this.props.spendPoints || 0);

		return(
			<div className='col' style={{padding: 25, width: 500}}>
				<h2>Клановые артефакты</h2>
				<Typography variant="body2" style={{marginBottom: 12}}>
					Укажите количество установленных в клане артефактов. Рассчитанная сумма параметров показана под каждым названием.
				</Typography>
				<List >
				  
				  <Divider variant="inset" component="li" />
				  {clansArt.map((char) =>
								<React.Fragment key={char.name}>
									<ListItem  
										button 
										alignItems="flex-start"  
										style={{maxWidth: 400}}
										onClick={(e) => this.changeArts(e, char.name)}>
										<ListItemAvatar>
										  <Avatar alt={char.name} src={char.url} />
										</ListItemAvatar>
										<ListItemText
										  primary={char.name}

										  secondary={
											<React.Fragment>
											  <Typography
												component="span"
												variant="body2"

												color="textPrimary"
											  >
												Параметры: 
											  </Typography>
											  {char.params}
											</React.Fragment>
										  }
										/>

											<ListItemSecondaryAction>
											  <TextField
													fullWidth={true}
													label={'Кол-во'}
													edge="end"
													value = {char.val}
													onChange={(e) => this.changeArts(e, 'Изменить ', char.name)}
													type="number"
													inputProps={{'min': 0, 'max': 100}}
													InputLabelProps={{
													  shrink: true,
													}}
													margin="dense"
													variant="outlined"
												  />
											</ListItemSecondaryAction>
										</ListItem>
									<Divider variant="inset" component="li" />
								</React.Fragment>
					  )}
				</List>
				<ListItem style={{maxWidth: 400}}>
					<ListItemText
						primary="Дополнительная руна с турнира Арены"
						secondary="Включите, если она действует сверх рун в списке клановых артефактов. Данные персонажа не содержат этот приз."
					/>
					<ListItemSecondaryAction>
						<Switch
							edge="end"
							inputProps={{'aria-label': 'Дополнительная руна с турнира Арены'}}
							onChange={() => this.changeTur()}
							checked={Boolean(this.props.turnireRune)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
			</div>
		)
	};
};

const mapStateToProps = (state) => {
	
//	console.log(state)
    return {
        clansArtSword: state.clansArtSword,
		clansArtSphere: state.clansArtSphere,
		clansArtRune: state.clansArtRune,
		clansArtMask: state.clansArtMask,
		turnireRune: state.turnireRune,
		level: state.levelChange,
		
    }
}

export default connect(mapStateToProps)(ClansArt);

//
//<ListItem alignItems="flex-start"   style={{maxWidth: 400}}>
//					<ListItemText
//					  primary="Руна правителей с Турнира Арены"
//					  secondary={
//						<React.Fragment>
//						  {" Одна из Рун получена при победе в воскресном клановом турнире на Арене"}
//						</React.Fragment>
//					  }
//					/>
//					<ListItemSecondaryAction>
//						  <Switch
//							edge="end"
//							onChange={(e)=>this.changeTur()}
//							checked={this.props.turnireRune}
//						  />
//						</ListItemSecondaryAction>
//				  </ListItem>
