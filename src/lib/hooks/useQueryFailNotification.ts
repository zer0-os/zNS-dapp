//- React Imports
import { ApolloError } from '@apollo/client';
import React from 'react';
import useNotification from './useNotification';

//This custom hook accepts 2 error parameters from apollo queries
//if one error its defined, it will pop up the fail notification
export function useQueryFailNotification(
	firstError?: ApolloError,
	secondError?: ApolloError,
) {
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	const { addNotification } = useNotification();

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
