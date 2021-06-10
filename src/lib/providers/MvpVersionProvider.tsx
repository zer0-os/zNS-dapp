import React, { useState } from 'react';

export const MvpVersionContext = React.createContext({
	mvpVersion: 1,
	setMvpVersion: (version: number) => {},
});

type MvpVersionProviderType = {
	children: React.ReactNode;
};

// Console message to let users know they can switch MVP versions
console.log(
	'%cHello fellow devs and tinkerers! If you would like to try different MVP versions, you can call mvp( [version] ) in the console, i.e. mvp(3)\nValid versions: 1, 2, 3',
	'display: block; border: 3px solid #3ca1ff; border-radius: 7px; padding: 10px; margin: 8px;',
);

const MvpVersionProvider: React.FC<MvpVersionProviderType> = ({ children }) => {
	const [mvpVersion, set] = useState(1);

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

	return (
		<MvpVersionContext.Provider value={contextValue}>
			{children}
		</MvpVersionContext.Provider>
	);
};

export default MvpVersionProvider;
