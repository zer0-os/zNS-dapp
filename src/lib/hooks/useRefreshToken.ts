import React from 'react';

export const useRefreshToken = () => {
	const [shouldRefresh, setRefreshToken] = React.useState(0);

	const refresh = () => {
		setRefreshToken(shouldRefresh + 1);
	};

	return { shouldRefresh, refresh };
};
