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

	// Poll CoinGecko every 30 seconds, 5 seconds if call fails and set value to $0 (wont be rendered in this case)
	const getWildPriceUsd = async () => {
		try {
			const price = await wildTokenPrice();
			setWildPriceUsd(price);
			await new Promise((resolve) => setTimeout(resolve, 1000000));
		} catch (e) {
			console.error(e);
			await new Promise((resolve) => setTimeout(resolve, 5000000));
		}
		getWildPriceUsd();
	};

	const getLootPriceUsd = async () => {
		try {
			const price = await lootTokenPrice();
			setLootPriceUsd(price);
			await new Promise((resolve) => setTimeout(resolve, 30000000));
		} catch (e) {
			console.error(e);
			await new Promise((resolve) => setTimeout(resolve, 50000000));
		}
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
