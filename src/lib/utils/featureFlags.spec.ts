// Global Utils Imports
import { Flags, getFeatureFlag, Environments } from './featureFlags';

describe('featureFlags', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe('when using IS_TITLE_BAR_MINT_BUTTON_ENABLED flag', () => {
		it('should be truthy in Development environment', () => {
			process.env = {
				...originalEnv,
				NODE_ENV: Environments.DEVELOPMENT,
			};
			expect(
				getFeatureFlag(Flags.IS_TITLE_BAR_MINT_BUTTON_ENABLED),
			).toBeTruthy();
		});

		it('should be truthy in Test environment', () => {
			process.env = {
				...originalEnv,
				NODE_ENV: Environments.TEST,
			};
			expect(
				getFeatureFlag(Flags.IS_TITLE_BAR_MINT_BUTTON_ENABLED),
			).toBeTruthy();
		});

		it('should be falsy in Production environment', () => {
			process.env = {
				...originalEnv,
				NODE_ENV: Environments.PRODUCTION,
			};
			expect(
				getFeatureFlag(Flags.IS_TITLE_BAR_MINT_BUTTON_ENABLED),
			).toBeFalsy();
		});
	});
});
