import { zDAO } from '@zero-tech/zdao-sdk';
import { zDAOAssets } from '@zero-tech/zdao-sdk/lib/types';
import { useEffect, useState } from 'react';

type UseAssetsReturn = {
	assets?: zDAOAssets;
	totalUsd?: number;
	isLoading: boolean;
};

const useAssets = (dao?: zDAO): UseAssetsReturn => {
	const [assets, setAssets] = useState<zDAOAssets | undefined>();
	const [totalUsd, setTotalUsd] = useState<number | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!dao) {
			return;
		}
		setTotalUsd(undefined);
		setAssets(undefined);
		setIsLoading(true);
		try {
			dao?.listAssets().then((d) => {
				console.log('listAssets', d);
				setAssets(d);
				setTotalUsd(d.amountInUSD);
			});
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [dao]);

	return {
		assets,
		totalUsd,
		isLoading,
	};
};

export default useAssets;
