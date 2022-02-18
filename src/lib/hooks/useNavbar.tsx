import { useMemo, useCallback } from 'react';
import { useNavbarRedux } from 'store/navbar/hooks';
import { SetNavbarTitlePayload } from 'store/navbar/types';

export type UseNavbarReturn = {
	title?: string;
	setNavbarTitle: (title?: string) => void;
};

export const useNavbar = (): UseNavbarReturn => {
	const { reduxState, reduxActions } = useNavbarRedux();

	const setNavbarTitle = useCallback(
		(title) => {
			const params: SetNavbarTitlePayload = { title };

			return reduxActions.setNavbarTitle(params);
		},
		[reduxActions],
	);

	return useMemo(
		() => ({
			title: reduxState.title,
			setNavbarTitle,
		}),
		[reduxState, setNavbarTitle],
	);
};
