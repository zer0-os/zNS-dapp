// React Imports
import React, { useState } from 'react';

// Web3 Imports
import { Domain, Maybe } from 'lib/types';

export const BuyNowContext = React.createContext({
	domain: undefined as Maybe<Domain>,
	makeABuy: (domain: Domain) => {
		return;
	},
	closeBuyNow: () => {
		return;
	},
	buyPlaced: () => {
		return;
	},
	updated: undefined as Maybe<Domain>,
});

type BuyNowProviderType = {
	children: React.ReactNode;
};

const BuyNowProvider: React.FC<BuyNowProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [buyingOn, setBuyingOn] = useState<Maybe<Domain>>();
	const [updated, setUpdated] = useState<Maybe<Domain>>();

	const makeABuy = (domain: Domain) => {
		setBuyingOn(domain);
	};

	const closeBuyNow = () => {
		setBuyingOn(undefined);
	};

	const buyPlaced = () => {
		setUpdated(buyingOn);
		setBuyingOn(undefined);

		// This is a bad solution long term
		setTimeout(() => {
			setUpdated(undefined);
		}, 1000);
	};

	const contextValue = {
		domain: buyingOn,
		makeABuy,
		closeBuyNow,
		buyPlaced,
		updated,
	};

	return (
		<BuyNowContext.Provider value={contextValue}>
			{children}
		</BuyNowContext.Provider>
	);
};

export default BuyNowProvider;

export function useBuyNow() {
	const { buyPlaced, updated, domain, makeABuy, closeBuyNow } =
		React.useContext(BuyNowContext);
	return { buyPlaced, updated, domain, makeABuy, closeBuyNow };
}
