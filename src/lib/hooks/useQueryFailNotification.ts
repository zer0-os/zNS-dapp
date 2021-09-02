//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

//This custom hook accepts 3 error parameters from apollo queries
//if one error its defined, it will pop up the fail notification
//if its loading, and keeps loading after 10s, will pop up other error
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
		setTimeout(() => {
			if (loadingRef.current) {
				addNotification(
					'One of our dependencies is working slow. Please visit later',
				);
			}
		}, 10000);
	}, []);

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
