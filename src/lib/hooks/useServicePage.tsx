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
				const allDomains = await sdk.instance.getAllDomains();
				const domainNames = allDomains.map((d) =>
					d.name.split('.').slice(1).join('.'),
				);
				if (!domainNames.includes(zna) || !domainNames.includes(domain)) {
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
