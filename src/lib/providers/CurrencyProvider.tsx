//- React Imports
import React, { useState, useEffect } from 'react';

//- Lib Imports
import { lootTokenPrice, wildTokenPrice } from 'lib/tokenPrices';

export const CurrencyContext = React.createContext({
	wildPriceUsd: 0,
	lootPriceUsd: 0,
});

type CurrencyProviderType = {
	children: React.ReactNode;
};

const CurrencyProvider: React.FC<CurrencyProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [wildPriceUsd, setWildPriceUsd] = useState(0);
	const [lootPriceUsd, setLootPriceUsd] = useState(0);

	useEffect(() => {
		getWildPriceUsd();
		getLootPriceUsd();
	});

	// Poll CoinGecko every 30 seconds
	const getWildPriceUsd = async () => {
		const price = await wildTokenPrice();
		setWildPriceUsd(price);
		if (price === 0) console.error('$WILD price API call failed');
		await new Promise((resolve) => setTimeout(resolve, 30000));
		getWildPriceUsd();
	};

	const getLootPriceUsd = async () => {
		const price = await lootTokenPrice();
		setLootPriceUsd(price);
		if (price === 0) console.error('$LOOT price API call failed');
		await new Promise((resolve) => setTimeout(resolve, 30000));
		getLootPriceUsd();
	};

	const contextValue = {
		wildPriceUsd,
		lootPriceUsd,
	};

	return (
		<CurrencyContext.Provider value={contextValue}>
			{children}
		</CurrencyContext.Provider>
	);
};

export default CurrencyProvider;

export function useCurrencyProvider() {
	const { wildPriceUsd, lootPriceUsd } = React.useContext(CurrencyContext);
	return { wildPriceUsd, lootPriceUsd };
}
