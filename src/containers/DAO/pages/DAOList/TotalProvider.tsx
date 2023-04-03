import React, { useState } from 'react';

type Total = {
	zna: string;
	total: number;
	isLoading?: boolean;
};

export const TotalsContext = React.createContext({
	totals: [] as Total[],
	add: (total: Total) => {},
	isLoading: true as boolean,
});

type TotalsProviderProps = {
	children: React.ReactNode;
};

export const TotalsProvider = ({ children }: TotalsProviderProps) => {
	const [totals, setTotals] = useState<Total[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const add = (total: Total) => {
		if (!totals.map((t) => t.zna).includes(total.zna)) {
			setTotals([...totals, total]);
		}
		setIsLoading(false);
	};

	const contextValue = {
		totals,
		add,
		isLoading,
	};

	return (
		<TotalsContext.Provider value={contextValue}>
			{children}
		</TotalsContext.Provider>
	);
};

export function useTotals() {
	const context = React.useContext(TotalsContext);

	return context;
}
