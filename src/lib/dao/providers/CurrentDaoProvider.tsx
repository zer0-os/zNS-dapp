import React from 'react';

import { useLocation } from 'react-router-dom';
import { zDAO } from '@zero-tech/zdao-sdk';

import useDao from '../hooks/useDao';
import { zNAFromPathname } from 'lib/utils';

export const CurrentDaoContext = React.createContext({
	dao: undefined as zDAO | undefined,
	isLoading: true,
	zna: '',
});

type CurrentDaoProviderProps = {
	children: React.ReactNode;
};

/**
 * Loads DAO at current zNA
 */
export const CurrentDaoProvider = ({ children }: CurrentDaoProviderProps) => {
	// Get zNA from browser location
	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);

	const { isLoading, dao } = useDao(zna);

	const context = {
		dao,
		isLoading,
		zna,
	};

	if (zna.length === 0) {
		document.title = 'DAOs | ' + process.env.REACT_APP_TITLE;
	} else {
		if (dao) {
			document.title = dao.title + ' | ' + process.env.REACT_APP_TITLE;
		}
	}

	return (
		<CurrentDaoContext.Provider value={context}>
			{children}
		</CurrentDaoContext.Provider>
	);
};

export function useCurrentDao() {
	const context = React.useContext(CurrentDaoContext);

	return context;
}
