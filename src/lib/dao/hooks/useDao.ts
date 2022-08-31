import { zDAO } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';
import { useZdaoSdk } from '../providers/ZdaoSdkProvider';

type UseDaoReturn = {
	dao: zDAO | undefined;
	isLoading: boolean;
};

const useDao = (zna: string): UseDaoReturn => {
	const { instance: sdk } = useZdaoSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dao, setDao] = useState<zDAO | undefined>();

	useEffect(() => {
		let isMounted = true;
		setDao(undefined);
		setIsLoading(true);
		if (!sdk || !zna || zna.length === 0) {
			setIsLoading(false);
			return;
		}
		try {
			sdk.getZDAOByZNA(zna).then((d) => {
				if (isMounted) {
					setDao(d);
					setIsLoading(false);
				}
			});
		} catch (e) {
			if (isMounted) {
				console.error(e);
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
	}, [zna, sdk]);

	return {
		dao,
		isLoading,
	};
};

export default useDao;
