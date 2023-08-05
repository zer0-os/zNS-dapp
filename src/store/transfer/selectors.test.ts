import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import { getTransferred, getTransferring } from './selectors';
import { transferReady } from './transfer.mockData';

describe('transfer.selectors', () => {
	it('should return transferring from state', () => {
		const transferring = getTransferring({
			[REDUCER_NAME]: transferReady,
		} as AppState);
		expect(transferring).toEqual(transferReady.transferring);
	});

	it('should return transferred from state', () => {
		const transferred = getTransferred({
			[REDUCER_NAME]: transferReady,
		} as AppState);
		expect(transferred).toEqual(transferReady.transferred);
	});
});
