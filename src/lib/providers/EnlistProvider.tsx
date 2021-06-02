//- React Imports
import React, { useState } from 'react';

//- Type Imports
import { Domain, DefaultDomain } from 'lib/types';

type context = {
	enlisting: Domain | undefined;
	enlist: (domain: Domain) => void;
	submit: () => void;
	clear: () => void;
};

export const EnlistContext = React.createContext<context>({
	enlisting: DefaultDomain || undefined,
	enlist: (domain: Domain) => {},
	submit: () => {},
	clear: () => {},
});

type EnlistProviderType = {
	children: React.ReactNode;
};

const EnlistProvider: React.FC<EnlistProviderType> = ({ children }) => {
	const [enlisting, setEnlisting] = useState<Domain | undefined>(undefined);

	const enlist = (domain: Domain) => {
		setEnlisting(domain);
	};

	const clear = () => setEnlisting(undefined);

	// @TODO Set up enlisting back-end
	const submit = () => {
		console.log('hello');
		console.warn('Enlisting is not yet linked up');
		clear();
	};

	const contextValue = {
		enlisting,
		enlist,
		submit,
		clear,
	};

	return (
		<EnlistContext.Provider value={contextValue}>
			{children}
		</EnlistContext.Provider>
	);
};

export default EnlistProvider;
