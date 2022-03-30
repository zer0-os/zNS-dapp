import { useMemo, useCallback } from 'react';
import { useNavbarRedux } from 'store/navbar/hooks';
import {
	SetNavbarTitlePayload,
	SetNavbarSearchingStatusPayload,
} from 'store/navbar/types';

export type UseNavbarReturn = {
	title?: string;
	isSearching: boolean;
	setNavbarTitle: (title?: string) => void;
	setNavbarSearchingStatus: (isSearching: boolean) => void;
};

export const useNavbar = (): UseNavbarReturn => {
	const { reduxState, reduxActions } = useNavbarRedux();

	const setNavbarTitle = useCallback(
		(title?: string) => {
			const params: SetNavbarTitlePayload = { title };

			return reduxActions.setNavbarTitle(params);
		},
		[reduxActions],
	);

	const setNavbarSearchingStatus = useCallback(
		(isSearching: boolean) => {
			const params: SetNavbarSearchingStatusPayload = { isSearching };

			return reduxActions.setNavbarSearchingStatus(params);
		},
		[reduxActions],
	);

	return useMemo(
		() => ({
			title: reduxState.title,
			isSearching: reduxState.isSearching,
			setNavbarTitle,
			setNavbarSearchingStatus,
		}),
		[reduxState, setNavbarTitle, setNavbarSearchingStatus],
	);
};
