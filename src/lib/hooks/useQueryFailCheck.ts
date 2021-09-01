//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

export function useQueryFailCheck(
	error?: ApolloError,
	optionalError?: ApolloError,
) {
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	const { addNotification } = useNotification();

	if ((error || optionalError) && !displayedLoadError) {
		setDisplayedLoadError(true);
		addNotification(
			'One of our dependencies is experiencing an outage. Please visit later',
		);
	}
}
