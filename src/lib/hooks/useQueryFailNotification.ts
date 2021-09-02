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
	const [queryIsLoading, setQueryIsLoading] = React.useState(false);
	const { addNotification } = useNotification();

	const displaySlowNotification = () => {
		if (queryIsLoading && !firstError && !secondError)
			addNotification(
				'One of our dependencies is working slow. Please wait or visit later',
			);
	};

	React.useEffect(() => {
		console.log(loading);
		if (loading) {
			setQueryIsLoading(loading);
		}
		if (!firstError && !secondError && loading) {
			setTimeout(() => {
				displaySlowNotification();
			}, 10000);
		}
	}, [loading]);

	React.useEffect(() => {
		if ((firstError || secondError) && !displayedLoadError) {
			setDisplayedLoadError(true);
			addNotification(
				'One of our dependencies is experiencing an outage. Please visit later',
			);
		}

		if (displayedLoadError) {
			setDisplayedLoadError(false);
		}
	}, [firstError, secondError]);
}
