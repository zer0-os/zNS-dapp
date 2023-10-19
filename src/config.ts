const config = {
	env: import.meta.env.ENVIRONMENT,
	baseURL: import.meta.env.VITE_APP_ZNS_SHARE_BASE_URL,
	useDataStore:
		import.meta.env.VITE_APP_USE_DATA_STORE?.toLowerCase() === 'true',
};

export default config;
