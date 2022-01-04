import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import notificationsReducer, {
	REDUCER_NAME as NOTIFICCATION_REDUCER_NAME,
} from './notifications/reducer';
import currencyReducer, {
	REDUCER_NAME as CURRENCY_REDUCER_NAME,
} from './currency/reducer';
import mintRducer, { REDUCER_NAME as MINT_REDUCER_NAME } from './mint/reducer';

const createRootReducer = (history: History<any>) =>
	combineReducers({
		router: connectRouter(history),
		[NOTIFICCATION_REDUCER_NAME]: notificationsReducer,
		[CURRENCY_REDUCER_NAME]: currencyReducer,
		[MINT_REDUCER_NAME]: mintRducer,
		/**
		 * Other reducers will be added here
		 */
	});

export default createRootReducer;
