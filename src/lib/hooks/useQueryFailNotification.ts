//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

//This custom hook accepts 2 error parameters from apollo queries
//if one error its defined, it will pop up the fail notification
export function useQueryFailNotification(
	loading: boolean,
	firstError?: ApolloError,
	secondError?: ApolloError,
) {
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	const { addNotification } = useNotification();

	const loadingRef = React.useRef(loading);
	loadingRef.current = loading;

	React.useEffect(() => {
		if (!firstError && !secondError && loading) {
			setTimeout(() => {
				if (loadingRef.current) {
					addNotification(
						'One of our dependencies is working slow. Please visit later',
					);
				}
			}, 10000);
		}
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
