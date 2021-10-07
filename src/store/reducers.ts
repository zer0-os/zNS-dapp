import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import notificationsReducer, {
	REDUCER_NAME as NOTIFICCATION_REDUCER_NAME,
} from './notifications/reducer';

const createRootReducer = (history: History<any>) =>
	combineReducers({
		router: connectRouter(history),
		[NOTIFICCATION_REDUCER_NAME]: notificationsReducer,
		/**
		 * Other reduceers will be added here
		 */
	});

export default createRootReducer;
