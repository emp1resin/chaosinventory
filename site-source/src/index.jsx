import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { applyMiddleware, createStore } from 'redux';
import {Provider} from 'react-redux';

import postReducer from './reducers/postReducer';
import { recordDiagnostic, startReportRetry } from './data/diagnostics';

const traceActions = () => next => action => {
	const result = next(action);
	if (typeof action.type === 'string' && action.type !== 'Загрузка персонажа') {
		recordDiagnostic('ui_action', { action: action.type.slice(0, 120) });
	}
	return result;
};
const store = createStore(postReducer, applyMiddleware(traceActions));
startReportRetry();

ReactDOM.render(
	<Provider store={store}>
  		<App />
	</Provider>, document.getElementById('root')
);
