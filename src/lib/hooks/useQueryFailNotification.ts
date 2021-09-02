//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

export function useQueryFailNotification(
	loading: boolean,
	error?: ApolloError,
) {
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	const { addNotification } = useNotification();

	const loadingRef = React.useRef(loading);
	loadingRef.current = true;

	//Trigger a timeout that will check if query finish loading after 10s
	React.useEffect(() => {
		const slowTimer = setTimeout(() => {
			if (loadingRef.current) {
				addNotification(
					'One of our dependencies is working slow. Please visit later',
				);
			}
		}, 5000);

		return () => clearTimeout(slowTimer);
	}, []);

	//If has at least one error defined, and not displayed error message yet, display error
	React.useEffect(() => {
		if (error && !displayedLoadError) {
			setDisplayedLoadError(true);
			addNotification(
				'One of our dependencies is experiencing an outage. Please visit later',
			);
		} else {
			setDisplayedLoadError(false);
		}
	}, [error]);
}
