import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store';
import {
	setNavbarSearchingStatus as reduxSetNavbarSearchingStatus,
	setNavbarTitle as reduxSetNavbarTitle,
} from 'store/navbar/actions';
import {
	getNavbarSearchingStatus,
	getNavbarTitle,
} from 'store/navbar/selectors';
import {
	NavbarState,
	SetNavbarSearchingStatusPayload,
	SetNavbarTitlePayload,
} from '../types';

export type UseNavbarReduxReturn = {
	reduxState: NavbarState;
	reduxActions: {
		setNavbarTitle: (params: SetNavbarTitlePayload) => void;
		setNavbarSearchingStatus: (params: SetNavbarSearchingStatusPayload) => void;
	};
};

export const useNavbarRedux = (): UseNavbarReduxReturn => {
	const dispatch = useDispatch();

	const reduxState = useSelector((state: AppState) => ({
		title: getNavbarTitle(state),
		isSearching: getNavbarSearchingStatus(state),
	}));

	const setNavbarTitle = useCallback(
		(params: SetNavbarTitlePayload) => {
			dispatch(reduxSetNavbarTitle(params));
		},
		[dispatch],
	);

	const setNavbarSearchingStatus = useCallback(
		(params: SetNavbarSearchingStatusPayload) => {
			dispatch(reduxSetNavbarSearchingStatus(params));
		},
		[dispatch],
	);

	const reduxActions = useMemo(
		() => ({
			setNavbarTitle,
			setNavbarSearchingStatus,
		}),
		[setNavbarTitle, setNavbarSearchingStatus],
	);

	return { reduxState, reduxActions };
};
