import { zDAO } from '@zero-tech/zdao-sdk';
import { Asset } from 'lib/types/dao';
import { AssetType } from '@zero-tech/zdao-sdk/lib/types';
import { useEffect, useState } from 'react';

type UseAssetsReturn = {
	assets?: Asset[];
	totalUsd?: number;
	isLoading: boolean;
};

const useAssets = (dao?: zDAO): UseAssetsReturn => {
	const [assets, setAssets] = useState<Asset[] | undefined>();
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
				const collectibles = d.collectibles.map((c) => ({
					...c,
					type: AssetType.ERC721,
				}));
				setAssets([...d.coins, ...collectibles]);
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
