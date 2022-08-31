import { useHistory } from 'react-router-dom';
import useNotification from './useNotification';

type UseRedirectReturn = {
	redirect: (to: string, message?: string) => void;
};

/**
 * Redirects the user to a location, with an optional notification
 * @returns void
 */
const useRedirect = (): UseRedirectReturn => {
	const { addNotification } = useNotification();
	const { replace } = useHistory();

	const redirect = (to: string, message?: string) => {
		if (message) {
			addNotification(message);
		}
		replace(to);
	};

	return {
		redirect,
	};
};

export default useRedirect;
