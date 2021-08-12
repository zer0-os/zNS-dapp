import React, { useState } from 'react';

//the hook that returns the useZauctionAPI with the api endpoint that match with the selected chain

export function useZAuctionBaseApiUri(chain: number): string | undefined {
	const [api, setApi] = useState<string | undefined>();

	React.useEffect(() => {
		function getApiEndpoint() {
			switch (chain) {
				case 1:
					return 'https://zproduction.ilios.dev/api';
				case 42:
					return 'https://zproxy.ilios.dev/api';
				default:
					return 'Unsupported Chain';
			}
		}

		setApi(getApiEndpoint());
	}, [chain]);

	return api;
}
