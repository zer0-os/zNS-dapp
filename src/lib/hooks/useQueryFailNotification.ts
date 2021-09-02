//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

export function useQueryFailNotification(
	loading: boolean,
	firstError?: ApolloError,
	secondError?: ApolloError,
) {
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	const { addNotification } = useNotification();

	const loadingRef = React.useRef(loading);
	loadingRef.current = loading;

	//Trigger a timeout that will check if query finish loading after 10s
	React.useEffect(() => {
		setTimeout(() => {
			if (loadingRef.current) {
				addNotification(
					'One of our dependencies is working slow. Please visit later',
				);
			}
		}, 10000);
	}, []);

	//If has at least one error defined, and not displayed error message yet, display error
	React.useEffect(() => {
		if ((firstError || secondError) && !displayedLoadError) {
			setDisplayedLoadError(true);
			addNotification(
				'One of our dependencies is experiencing an outage. Please visit later',
			);
		} else {
			setDisplayedLoadError(false);
		}
	}, [firstError, secondError]);
}
