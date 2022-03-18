import { ethers } from 'ethers';
import { Transaction } from './useDaoTransaction.types';
import {
	DAY_IN_MILLISECONDS,
	WEEK_IN_MILLISECONDS,
	MONTH_IN_MILLISECONDS,
} from '../components/History/History.constants';

const randomPool = [
	{
		action: 'Sent',
		asset: 'ETH',
		icon: '',
		amount: ethers.BigNumber.from(ethers.utils.parseEther('184')),
		address: '0x0000000000000000000000000000000000000000',
		date: new Date(),
		id: 'test-transaction',
	},
	{
		action: 'Received',
		asset: 'WILD',
		icon: '',
		amount: ethers.BigNumber.from(ethers.utils.parseEther('184')),
		address: '0x0000000000000000000000000000000000000000',
		date: new Date(),
		id: 'test-transaction',
	},
	{
		action: 'Sent',
		asset: 'wilder.wheels.123',
		icon: '',
		address: '0x0000000000000000000000000000000000000000',
		date: new Date(),
		id: 'test-transaction',
	},
];

const createMockArray = (dateOffset: number): Transaction[] => {
	return Array.apply(null, Array(3)).map((_, index) => ({
		...randomPool[index % randomPool.length],
		action: randomPool[index % randomPool.length].action as 'Sent' | 'Received', // to stop typescript complaining
		date: new Date(new Date().getTime() - dateOffset),
	}));
};

const mockTransactions: Transaction[] = [
	createMockArray(0),
	createMockArray(WEEK_IN_MILLISECONDS - DAY_IN_MILLISECONDS),
	createMockArray(MONTH_IN_MILLISECONDS - WEEK_IN_MILLISECONDS),
	createMockArray(MONTH_IN_MILLISECONDS * 2),
].flat();

const mock = {
	mockTransactions,
};
export default mock;
