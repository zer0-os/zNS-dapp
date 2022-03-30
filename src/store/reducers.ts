import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import notificationsReducer, {
	REDUCER_NAME as NOTIFICATION_REDUCER_NAME,
} from './notifications/reducer';
import currencyReducer, {
	REDUCER_NAME as CURRENCY_REDUCER_NAME,
} from './currency/reducer';
import mintRducer, { REDUCER_NAME as MINT_REDUCER_NAME } from './mint/reducer';
import transferReducer, {
	REDUCER_NAME as TRANSFER_REDUCER_NAME,
} from './transfer/reducer';
import navbarReducer, {
	REDUCER_NAME as NAVBAR_REDUCER_NAME,
} from './navbar/reducer';
import stakingReducer, {
	REDUCER_NAME as STAKING_REDUCER_NAME,
} from './staking/reducer';

const createRootReducer = (history: History<any>) =>
	combineReducers({
		router: connectRouter(history),
		[NOTIFICATION_REDUCER_NAME]: notificationsReducer,
		[CURRENCY_REDUCER_NAME]: currencyReducer,
		[MINT_REDUCER_NAME]: mintRducer,
		[TRANSFER_REDUCER_NAME]: transferReducer,
		[NAVBAR_REDUCER_NAME]: navbarReducer,
		[STAKING_REDUCER_NAME]: stakingReducer,
		/**
		 * Other reducers will be added here
		 */
	});

export default createRootReducer;
