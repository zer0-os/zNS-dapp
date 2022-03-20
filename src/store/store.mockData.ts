import { AppState } from 'store';
import { REDUCER_NAME as NOTIFICATION_REDUCER_NAME } from './notifications/reducer';
import { notificationsReady } from './notifications/notifications.mockData';
import { REDUCER_NAME as CURRENCY_REDUCER_NAME } from './currency/reducer';
import { currencyReady } from './currency/currency.mockData';
import { REDUCER_NAME as MINT_REDUCER_NAME } from './mint/reducer';
import { mintReady } from './mint/mint.mockData';
import { REDUCER_NAME as TRANSFER_REDUCER_NAME } from './transfer/reducer';
import { transferReady } from './transfer/transfer.mockData';
import { REDUCER_NAME as NAVBAR_REDUCER_NAME } from './navbar/reducer';
import { navbarReady } from './navbar/navbar.mockData';
import { REDUCER_NAME as STAKING_REDUCER_NAME } from './staking/reducer';
import { stakingReady } from './staking/staking.mockData';

export const storeReady = {
	[NOTIFICATION_REDUCER_NAME]: notificationsReady,
	[CURRENCY_REDUCER_NAME]: currencyReady,
	[MINT_REDUCER_NAME]: mintReady,
	[TRANSFER_REDUCER_NAME]: transferReady,
	[NAVBAR_REDUCER_NAME]: navbarReady,
	[STAKING_REDUCER_NAME]: stakingReady,
} as AppState;
