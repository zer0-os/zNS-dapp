export enum Environments {
	TEST = 'test',
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}

const isEnvironmentTest = (environment: string) =>
	environment === Environments.TEST;

const isEnvironmentDevelopment = (environment: string) =>
	environment === Environments.DEVELOPMENT;

// const isEnvironmentProduction = (environment: string) =>
// 	environment === Environments.PRODUCTION;

const isFeatureEnabled = (environment: string) =>
	isEnvironmentTest(environment) || isEnvironmentDevelopment(environment);

export enum Flags {
	IS_FEATURE_ENABLED,
}

type FeatureType = {
	[key in Flags]: (env: string) => boolean;
};

const FEATURE_FLAGS: FeatureType = {
	[Flags.IS_FEATURE_ENABLED]: isFeatureEnabled,
};

export const getFeatureFlag = (featureFlagKey: Flags) => {
	return FEATURE_FLAGS[featureFlagKey](process.env.NODE_ENV ?? '');
};
