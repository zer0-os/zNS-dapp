//- Mocks Imports
import {
	mockBids,
	mockNullBids,
	mockNullOwnedDomains,
	mockOwnedDomains,
	TEST_NETWORK,
} from 'mocks/ownedDomains';
import { ACTION_KEYS } from './OwnedDomainsTable.constants';

//- Utils Imports
import {
	filterOwnedDomainsByNetwork,
	getActions,
} from './OwnedDomainsTable.utils';

////////////////////
// f:: getActions //
////////////////////

describe('getActions', () => {
	const env = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...env, REACT_APP_NETWORK: '' };
	});

	afterEach(() => {
		process.env = env;
	});

	describe('when there are existing bids', () => {
		it('should return Settings & View Bids options', () => {
			const actions = getActions(Boolean(mockBids?.bids.length));
			expect(actions).toHaveLength(2);
			expect(actions[0].title).toEqual(ACTION_KEYS.SETTINGS);
			expect(actions[1].title).toEqual(ACTION_KEYS.VIEW_BIDS);
		});
	});

	describe('when there are no existing bids', () => {
		it('should only return Settings option', () => {
			const actions = getActions(Boolean(mockNullBids?.bids.length));
			expect(actions).toHaveLength(1);
			expect(actions[0].title).toEqual(ACTION_KEYS.SETTINGS);
		});
	});
});

/////////////////////////////////////
// f:: filterOwnedDomainsByNetwork //
/////////////////////////////////////

describe('filterOwnedDomainsByNetwork', () => {
	describe('Default Network (no network set)', () => {
		const env = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = { ...env, REACT_APP_NETWORK: '' };
		});

		afterEach(() => {
			process.env = env;
		});

		// check environment variable has been set correctly
		it('mock REACT_APP_NETWORK success', () => {
			expect(process.env.REACT_APP_NETWORK).toBe('');
			expect(process.env.REACT_APP_NETWORK).not.toBe(
				TEST_NETWORK.TEST_NETWORK_ONE,
			);
		});

		describe('when there are existing owned domains', () => {
			it('should return total length of mockOwnedDomains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				expect(onNetworkOwnedDomains).toHaveLength(mockOwnedDomains.length);
			});

			it('should return expected result', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const expectedResult = mockOwnedDomains;
				expect(onNetworkOwnedDomains).toBe(expectedResult);
			});
		});

		describe('when there are no existing owned domains', () => {
			it('should return empty array', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockNullOwnedDomains);

				expect(onNetworkOwnedDomains).toHaveLength(mockNullOwnedDomains.length);
				expect(onNetworkOwnedDomains).toEqual([]);
			});
		});
	});

	describe('Network Variable (network set: test-network-one)', () => {
		const env = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = {
				...env,
				REACT_APP_NETWORK: TEST_NETWORK.TEST_NETWORK_ONE,
			};
		});

		afterEach(() => {
			process.env = env;
		});

		// check environment variable has been set correctly
		it('mock REACT_APP_NETWORK success', () => {
			expect(process.env.REACT_APP_NETWORK).toBe(TEST_NETWORK.TEST_NETWORK_ONE);
			expect(process.env.REACT_APP_NETWORK).not.toBe('');
		});

		describe('when there are existing owned domains', () => {
			it('should return total length of test-network-one domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const expectedResult = [mockOwnedDomains[0], mockOwnedDomains[1]];

				expect(onNetworkOwnedDomains).toHaveLength(expectedResult.length);
			});

			it('should only return test-network-one domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const expectedResult = [mockOwnedDomains[0], mockOwnedDomains[1]];

				const testNetworkOneDomains = mockOwnedDomains.find(
					(e) => e.name.split('.')[0] === TEST_NETWORK.TEST_NETWORK_ONE,
				);

				expect(onNetworkOwnedDomains).toContain(testNetworkOneDomains);
				expect(onNetworkOwnedDomains).toEqual(expectedResult);
			});

			it('should not return test-network-two domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const testNetworkTwoDomains = mockOwnedDomains.find(
					(e) => e.name.split('.')[0] === TEST_NETWORK.TEST_NETWORK_TWO,
				);

				expect(onNetworkOwnedDomains).not.toContain(testNetworkTwoDomains);
			});

			it('should not return test-network-three domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const testNetworkThreeDomains = mockOwnedDomains.find(
					(e) => e.name.split('.')[0] === TEST_NETWORK.TEST_NETWORK_THREE,
				);

				expect(onNetworkOwnedDomains).not.toContain(testNetworkThreeDomains);
			});
		});

		describe('when there are no existing owned domains', () => {
			it('should return empty array', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockNullOwnedDomains);

				expect(onNetworkOwnedDomains).toHaveLength(mockNullOwnedDomains.length);
				expect(onNetworkOwnedDomains).toEqual([]);
			});
		});
	});

	describe('Network Variable (network set: test-network-two)', () => {
		const env = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = {
				...env,
				REACT_APP_NETWORK: TEST_NETWORK.TEST_NETWORK_TWO,
			};
		});

		afterEach(() => {
			process.env = env;
		});

		// check environment variable has been set correctly
		it('mock REACT_APP_NETWORK success', () => {
			expect(process.env.REACT_APP_NETWORK).toBe(TEST_NETWORK.TEST_NETWORK_TWO);
			expect(process.env.REACT_APP_NETWORK).not.toBe('');
		});

		describe('when there are existing owned domains', () => {
			it('should return total length of test-network-two domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const expectedResult = [mockOwnedDomains[2]];

				expect(onNetworkOwnedDomains).toHaveLength(expectedResult.length);
			});

			it('should only return test-network-two domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const expectedResult = [mockOwnedDomains[2]];

				const testNetworkTwoDomains = mockOwnedDomains.find(
					(e) => e.name.split('.')[0] === TEST_NETWORK.TEST_NETWORK_TWO,
				);

				expect(onNetworkOwnedDomains).toContain(testNetworkTwoDomains);
				expect(onNetworkOwnedDomains).toEqual(expectedResult);
			});

			it('should not return test-network-one domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const testNetworkOneDomains = mockOwnedDomains.find(
					(e) => e.name.split('.')[0] === TEST_NETWORK.TEST_NETWORK_ONE,
				);

				expect(onNetworkOwnedDomains).not.toContain(testNetworkOneDomains);
			});

			it('should not return test-network-three domains', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockOwnedDomains);

				const testNetworkThreeDomains = mockOwnedDomains.find(
					(e) => e.name.split('.')[0] === TEST_NETWORK.TEST_NETWORK_THREE,
				);

				expect(onNetworkOwnedDomains).not.toContain(testNetworkThreeDomains);
			});
		});

		describe('when there are no existing owned domains', () => {
			it('should return empty array', () => {
				const onNetworkOwnedDomains =
					filterOwnedDomainsByNetwork(mockNullOwnedDomains);

				expect(onNetworkOwnedDomains).toHaveLength(mockNullOwnedDomains.length);
				expect(onNetworkOwnedDomains).toEqual([]);
			});
		});
	});
});
