import React, { useState } from 'react';

export const MvpVersionContext = React.createContext({
	mvpVersion: 1,
	setMvpVersion: (version: number) => {},
});

type MvpVersionProviderType = {
	children: React.ReactNode;
};

const MvpVersionProvider: React.FC<MvpVersionProviderType> = ({ children }) => {
	const [mvpVersion, set] = useState(1);

	const production = () => {
		console.log(
			'%cYou have switched to production mode',
			'display: block; border: 3px solid #3ca1ff; border-radius: 7px; padding: 10px; margin: 8px;',
		);
		set(1);
	};

	const prototype = () => {
		console.log(
			'%cYou have switched to prototype mode',
			'display: block; border: 3px solid #3ca1ff; border-radius: 7px; padding: 10px; margin: 8px;',
		);
		set(3);
	};

	const setMvpVersion = (version: number) => {
		if (version > 3 || version < 1) {
			return console.warn('Invalid MVP version - valid values are 1, 2, and 3');
		}
		console.log(
			'%cMVP: ' + version,
			'display: block; border: 3px solid #3ca1ff; border-radius: 7px; padding: 10px; margin: 8px;',
		);
		set(version);
	};

	const contextValue = {
		mvpVersion,
		setMvpVersion,
	};

	// Global function so it can be called in the console
	(global as any).mvp = setMvpVersion;
	(global as any).production = production;
	(global as any).prototype = prototype;

	return (
		<MvpVersionContext.Provider value={contextValue}>
			{children}
		</MvpVersionContext.Provider>
	);
};

export default MvpVersionProvider;
