import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import notificationsReducer from './notifications/reducer';

const createRootReducer = (history: History<any>) =>
	combineReducers({
		router: connectRouter(history),
		notifications: notificationsReducer,
		/**
		 * Other reduceers will be added here
		 */
	});

export default createRootReducer;
