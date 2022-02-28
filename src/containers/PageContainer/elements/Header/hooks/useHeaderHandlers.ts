import { useMemo, useCallback } from 'react';
import { History, Location } from 'history';

type UseHeaderHandlersProps = {
	props: {
		history: History<unknown>;
		location: Location<unknown>;
	};
	localActions: {
		setIsSearchInputHovered: React.Dispatch<React.SetStateAction<boolean>>;
		setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	};
	reduxActions: {
		setNavbarSearchingStatus: (isSearching: boolean) => void;
	};
	refs: {
		searchInputRef: React.RefObject<HTMLInputElement>;
	};
};

type UseHeaderHandlersReturn = {
	handleOnSearchOpen: () => void;
	handleOnSearchClose: () => void;
	handleOnSearchEnter: () => void;
	handleOnSearchLeave: () => void;
	handleOnSearchEscape: (event: any) => void;
	handleOnSearchChange: (event: any) => void;
	handleOnOpenProfile: () => void;
};

export const useHeaderHandlers = ({
	props,
	localActions,
	reduxActions,
	refs,
}: UseHeaderHandlersProps): UseHeaderHandlersReturn => {
	const handleOnSearchOpen = useCallback(() => {
		reduxActions.setNavbarSearchingStatus(true);
	}, [reduxActions]);

	const handleOnSearchClose = useCallback(() => {
		reduxActions.setNavbarSearchingStatus(false);
		localActions.setSearchQuery('');
	}, [localActions, reduxActions]);

	const handleOnSearchEnter = useCallback(() => {
		localActions.setIsSearchInputHovered(true);
	}, [localActions]);

	const handleOnSearchLeave = useCallback(() => {
		localActions.setIsSearchInputHovered(false);
	}, [localActions]);

	const handleOnSearchEscape = useCallback(
		(event: any) => {
			if (event.which === 27) refs.searchInputRef?.current?.blur();
		},
		[refs],
	);

	const handleOnSearchChange = useCallback(
		(event: any) => {
			localActions.setSearchQuery(event.target.value);
		},
		[localActions],
	);

	const handleOnOpenProfile = useCallback(() => {
		const { history, location } = props;
		const params = new URLSearchParams(location.search);
		const { pathname } = location;

		params.set('profile', 'true');
		history.push({
			pathname,
			search: params.toString(),
		});
	}, [props]);

	return useMemo(
		() => ({
			handleOnSearchOpen,
			handleOnSearchClose,
			handleOnSearchEnter,
			handleOnSearchLeave,
			handleOnSearchEscape,
			handleOnSearchChange,
			handleOnOpenProfile,
		}),
		[
			handleOnSearchOpen,
			handleOnSearchClose,
			handleOnSearchEnter,
			handleOnSearchLeave,
			handleOnSearchEscape,
			handleOnSearchChange,
			handleOnOpenProfile,
		],
	);
};
