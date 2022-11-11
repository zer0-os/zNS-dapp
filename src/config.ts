const config = {
	env: process.env.ENVIRONMENT,
	baseURL: process.env.REACT_APP_ZNS_SHARE_BASE_URL,
	useDataStore: process.env.REACT_APP_USE_DATA_STORE?.toLowerCase() === 'true',
};

export default config;
