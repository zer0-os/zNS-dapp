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
		let isMounted = true;
		setIsLoading(true);
		if (!dao) {
			return;
		}
		setTotalUsd(undefined);
		setAssets(undefined);
		setIsLoading(true);
		try {
			dao
				?.listAssets()
				.then((d) => {
					const collectibles = d.collectibles.map((c) => ({
						...c,
						type: AssetType.ERC721,
					}));
					if (isMounted) {
						setAssets([
							...d.coins.filter((d) => d.amount !== '0'),
							...collectibles,
						]);
						setTotalUsd(d.amountInUSD);
					}
				})
				.then(() => {
					if (isMounted) {
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
	}, [dao]);

	return {
		assets,
		totalUsd,
		isLoading,
	};
};

export default useAssets;
