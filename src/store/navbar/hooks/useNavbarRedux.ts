import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'store';
import { setNavbarTitle as reduxSetNavbarTitle } from 'store/navbar/actions';
import { getNavbarTitle } from 'store/navbar/selectors';
import { NavbarState, SetNavbarTitlePayload } from '../types';

export type UseNavbarReduxReturn = {
	reduxState: NavbarState;
	reduxActions: {
		setNavbarTitle: (params: SetNavbarTitlePayload) => void;
	};
};

export const useNavbarRedux = (): UseNavbarReduxReturn => {
	const dispatch = useDispatch();

	const reduxState = useSelector((state: AppState) => ({
		title: getNavbarTitle(state),
	}));

	const setNavbarTitle = useCallback(
		(params: SetNavbarTitlePayload) => {
			dispatch(reduxSetNavbarTitle(params));
		},
		[dispatch],
	);

	const reduxActions = useMemo(
		() => ({
			setNavbarTitle,
		}),
		[setNavbarTitle],
	);

	return { reduxState, reduxActions };
};
