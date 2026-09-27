
import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIconModule from '@material-ui/icons/Delete';
const DeleteIcon = DeleteIconModule.default?.default || DeleteIconModule.default || DeleteIconModule;
import Divider from '@material-ui/core/Divider';

import { connect } from 'react-redux';

function SaveGrid(props) {
		
	const [name, setName] = useState('')
	
	const [arrDelId, setArrDelId] = useState([])
	
	const deleteList = (hash, id) => {
		console.log(hash, id)
		
		fetch(`https://chaosage.app/resources/delFittingRoom.php?hash=${hash}&id=${id}`)
			.then(e=>{
			
			
				handelDel(id)

				

			})
			.catch(e=>console.log(e))
	}
	
	
	const setAll = (e, data) => {
		console.log(JSON.parse(data))
		
		props.dispatch({
			type: 'Загрузить все данные игрока',
			data: JSON.parse(data)
		});
	}
	
	
	const handelDel = (id) => {
		setArrDelId([...arrDelId, id])
		console.log(arrDelId)
	}
	
		console.log(props.list)
		const saveData = (e) => {
			
			if (name !== '') {
				var data = JSON.stringify(props.getAllState)
				console.log('Сохраняем данные')

				var d = {
						hash: 'fff',
						name: 'fds4',
						data: data,
					}



				var formData = new FormData();
				formData.append('hash', props.hash);
				formData.append('name', name);
				formData.append('data', data);

				fetch('https://chaosage.app/resources/saveFittingRoom.php', {
					method: 'POST', 
					body: formData

				  })
				.then(e=>{
					console.log(e)
					// Устанавливаем имя на 0
					props.list.push({
						id: Math.random()*100,
						name: name,
						date: 'Сейчас'
					})
					setName('')
				})
				.catch(e=>console.log(e))
			}
			
		}


		return(
			<div style={{padding: 15}}>
				<Typography variant="h5" gutterBottom >
					Сохранение образа
			  	</Typography>
				<Typography variant="caption" display="block" gutterBottom>
					Сохраненный образ будет доступен только Вам. Если Вы им не поделитесь, конечно
				  </Typography>
				<Grid
						container
						direction="row"
						justify="space-around"
						alignItems="center"
						spacing={3}
						style={{marginLeft: 5}}
					>
					<Grid item >
						<TextField 
							onChange={(e) => setName(e.target.value)}
							id="standard-basic"  
							label={'Введите имя'} 
							value={name}
							placeholder={'Имя'} />
					</Grid>
					<Grid item>
						<Button
								variant="contained"
								color="primary"
								onClick={(e)=>saveData(e)}
							  >
								Сохранить
							</Button>
					</Grid>
				</Grid>
				<Divider style={{margin:25}}/>
				<Typography variant="h5" gutterBottom >
					Загрузить образ
			  	</Typography>
				<Typography variant="caption" display="block" gutterBottom>
					Список сохраненных Вами образов
				  </Typography>
			  	<List aria-label="list of hash" dense={true}>
			  		{props.list.filter(item=>{
						let c = false
						
						// Фильтруем временный список
						for (var i = 0; i<arrDelId.length; i++) {
							if (arrDelId[i] === item.id) {
								c = true
							}
						} 
						
						// Если статус стоит на удаление
						if ((item.status*1)===0) {
							c = true
						}
						return !c
					}).map((item) => {
						return(
							<div key = {item.id} >
								<ListItem button>
									  <ListItemText primary={item.name} secondary={item.date} />
									  <Button
									  	size = 'small'
										variant="contained"
										color="primary"
										onClick={(e)=>setAll(e, item.dataRoom)}
									  >
										Загрузить
									</Button>
									{item.status && <IconButton onClick={(e)=>deleteList(item.loginHash, item.id)} style={{marginLeft: 5}} aria-label="delete">
										  <DeleteIcon fontSize="small" />
										</IconButton>
									}
									</ListItem>
								<Divider/>
							</div>
						)
					  
					})}
			  </List>
			</div>
		)
	
	
	
}


const mapStateToProps = (state) => {
	
    return {
		getAllState: state.getAllState,

    }
}

export default connect(mapStateToProps)(SaveGrid);