import '@testing-library/jest-dom/extend-expect';
import {
	fireEvent,
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { ethers } from 'ethers';

import {
	MESSAGE,
	TABLE_HEADERS,
	TABLE_HEADERS_DISCONNECTED,
} from './StakePoolTable.constants';
import StakePoolTableRow, { TEST_ID } from './StakePoolTableRow';

//////////
// Mock //
//////////

var mockUserValueStaked = jest.fn();

/**
 * Note:
 * This is directly copied from pool output in SDK
 * as of Fri 18 Mar 2022
 */
const mockPoolData = {
	instance: {
		address: '0x9E87a268D42B0Aba399C121428fcE2c626Ea01FF',
		userValueStaked: mockUserValueStaked,
	},
	content: {
		image: '/staking/farm.png',
		name: 'Farm WILD - WETH LP',
		token: 'Liquidity Provider',
		tokenTicker: 'LP',
		domain: '/pools/lp',
		tokenPurchaseUrl: '',
	},
	metrics: {
		apy: 145.03269039595662,
		tvl: {
			numberOfTokens: 35576.6553275205,
			valueOfTokensUSD: 6971564.4606713345,
		},
	},
};

const mockUserData = {
	userValueUnlocked: ethers.utils.parseEther('1000'),
	userValueLocked: ethers.utils.parseEther('1000'),
};

var mockAccountValid = { account: '1' };
var mockAccountInvalid = { account: undefined };
var mockAccount: { account: string | undefined } = mockAccountValid;

jest.mock('@web3-react/core', () => ({
	useWeb3React: () => mockAccount,
}));

var mockSelectStakePool = jest.fn();
jest.mock('lib/providers/staking/PoolSelectProvider', () => ({
	useStakingPoolSelector: () => ({
		selectStakePool: mockSelectStakePool,
	}),
}));

///////////
// Setup //
///////////

const renderComponent = () => {
	return render(
		<table>
			<tbody>
				<StakePoolTableRow data={mockPoolData} rowNumber={'1'} />
			</tbody>
		</table>,
	);
};

const jestConsole = console;
const consoleError = console.error;

beforeEach(() => {
	global.console = require('console');
	console.error = jest.fn();
});

afterEach(() => {
	mockAccount = mockAccountValid; // reset mock account value
	global.console = jestConsole;
	console.error = consoleError;
});

///////////
// Tests //
///////////

test('should render', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	renderComponent();
	await screen.findByText(mockPoolData.content.name);
});

test('should render correct number of columns with wallet connected', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	const { getByTestId } = renderComponent();
	await screen.findByText(mockPoolData.content.name);
	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(
		TABLE_HEADERS.length,
	);
});

test('should render correct number of columns with wallet disconnected', async () => {
	mockAccount = mockAccountInvalid;
	const { getByTestId } = renderComponent();
	await screen.findByText(mockPoolData.content.name);
	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(
		TABLE_HEADERS_DISCONNECTED.length,
	);
});

test('should handle row click event', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	const { getByTestId } = renderComponent();
	await screen.findByText(mockPoolData.content.name);
	const container = getByTestId(TEST_ID.CONTAINER);
	fireEvent.click(container);
	expect(mockSelectStakePool).toBeCalledWith(mockPoolData);
});

test('should handle button click event', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	renderComponent();
	await screen.findByText(mockPoolData.content.name);
	const button = screen.getByRole('button', { name: 'Stake' });
	fireEvent.mouseUp(button);
	expect(mockSelectStakePool).toBeCalledWith(mockPoolData);
});

test('should render spinner while loading', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	const { getByTestId } = renderComponent();
	const spinner = getByTestId(TEST_ID.SPINNER);
	expect(spinner).toBeInTheDocument();
	await waitForElementToBeRemoved(spinner);
});

test('should handle failed load', async () => {
	mockUserValueStaked.mockRejectedValue(undefined);
	renderComponent();
	await screen.findByText(MESSAGE.FAILED_TO_LOAD);
	expect(console.error).toBeCalledTimes(1);
});

test('should format apy correctly', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	renderComponent();
	await screen.findByText('145.03%');
});

test('should format total stake correctly', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	renderComponent();
	await screen.findByText('$6,971,564.46');
});

test('should format user stake correctly', async () => {
	mockUserValueStaked.mockResolvedValue(mockUserData);
	renderComponent();
	await screen.findByText('2,000.00 ' + mockPoolData.content.tokenTicker);
});
