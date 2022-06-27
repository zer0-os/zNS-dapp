//- React Imports
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { zNAFromPathname } from 'lib/utils';

//- Constants Imports
import { ROUTES } from 'constants/routes';

type UseServicePageReturn = {
	route: string;
	isInvalidPath: boolean | undefined;
};

const useServicePage = (domain: string): UseServicePageReturn => {
	const isMounted = useRef<boolean>();

	const sdk = useZnsSdk();
	const location = useLocation();
	const zna = zNAFromPathname(location.pathname);

	const [route, setRoute] = useState<string>('');
	const [isInvalidPath, setisInvalidPath] = useState<boolean>();

	// Handle  domains that don't exist
	useEffect(() => {
		isMounted.current = true;

		(async () => {
			if (!sdk) {
				return;
			}

			try {
				const domains = await sdk.instance.getDomainsByName(domain);
				if (domains.length === 0) {
					setRoute(ROUTES.PAGE_NOT_FOUND);
					setisInvalidPath(true);
				}
			} catch (e) {
				console.error(e);
			}
		})();
		return () => {
			isMounted.current = false;
		};
	}, [domain, sdk, zna]);

	return {
		route,
		isInvalidPath,
	};
};

export default useServicePage;
