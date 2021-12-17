import React, { useState } from 'react';

export const NavContext = React.createContext({
	location: undefined as React.ReactNode | string | undefined,
	setLocation: (location: React.ReactNode | string) => {},
});

type NavContextProviderType = {
	children: React.ReactNode;
};

const NavProvider: React.FC<NavContextProviderType> = ({ children }) => {
	const [location, setLocation] = useState<
		React.ReactNode | string | undefined
	>();

	const contextValue = {
		location,
		setLocation,
	};

	return (
		<NavContext.Provider value={contextValue}>{children}</NavContext.Provider>
	);
};

export default NavProvider;

export function useNav() {
	const context = React.useContext(NavContext);

	return context;
}
