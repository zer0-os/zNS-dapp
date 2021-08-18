//- React Imports
import React, { useState, useEffect } from 'react';

//- Lib Imports
import { wildToUsd } from 'lib/tokenPrices';

export const CurrencyContext = React.createContext({
	wildPriceUsd: 0,
});

type CurrencyProviderType = {
	children: React.ReactNode;
};

const CurrencyProvider: React.FC<CurrencyProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [wildPriceUsd, setWildPriceUsd] = useState(0);

	useEffect(() => {
		getWildPriceUsd();
	});

	// Poll CoinGecko every 30 seconds
	const getWildPriceUsd = async () => {
		const price = await wildToUsd(1);
		setWildPriceUsd(price || 0);
		await new Promise((resolve) => setTimeout(resolve, 30000));
		getWildPriceUsd();
	};

	const contextValue = {
		wildPriceUsd,
	};

	return (
		<CurrencyContext.Provider value={contextValue}>
			{children}
		</CurrencyContext.Provider>
	);
};

export default CurrencyProvider;

export function useCurrencyProvider() {
	const { wildPriceUsd } = React.useContext(CurrencyContext);
	return { wildPriceUsd };
}
