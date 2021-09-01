//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

export function useQueryFailNotification(error?: ApolloError) {
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	const { addNotification } = useNotification();

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
