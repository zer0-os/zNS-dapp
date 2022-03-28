import React, { useState } from 'react';

type Total = {
	zna: string;
	total: number;
};

export const TotalsContext = React.createContext({
	totals: [] as Total[],
	add: (total: Total) => {},
});

type TotalsProviderProps = {
	children: React.ReactNode;
};

export const TotalsProvider = ({ children }: TotalsProviderProps) => {
	const [totals, setTotals] = useState<Total[]>([]);

	const add = (total: Total) => {
		if (!totals.includes(total)) {
			setTotals([...totals, total]);
		}
	};

	const contextValue = {
		totals,
		add,
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
