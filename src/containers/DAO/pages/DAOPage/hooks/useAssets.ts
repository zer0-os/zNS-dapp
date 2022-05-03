import { zDAO } from '@zero-tech/zdao-sdk';
import { Asset } from 'lib/types/dao';
import { AssetType } from '@zero-tech/zdao-sdk/lib/types';
import { useEffect, useState } from 'react';

type UseAssetsReturn = {
	assets?: Asset[];
	totalUsd?: number;
	isLoading: boolean;
};

type AssetCache = {
	[daoSafeAddress: string]: {
		assets?: Asset[];
		totalUsd?: number;
	};
};

const cache: AssetCache = {};

const cacheKey = 'safeAddress';

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
			if (cache[dao[cacheKey]]) {
				const cached = cache[dao[cacheKey]];
				/* Wrapped this in a setTimeout to force it
					 to run after state is reset above - there
					 are probably better solutions!	*/
				setTimeout(() => {
					setTotalUsd(cached.totalUsd);
					setAssets(cached.assets);
					setIsLoading(false);
				}, 0);
				return;
			}
			dao
				?.listAssets()
				.then((d) => {
					const collectibles = d.collectibles.map((c) => ({
						...c,
						type: AssetType.ERC721,
					}));
					if (isMounted) {
						const allAssets = [
							...d.coins.filter((d) => d.amount !== '0'),
							...collectibles,
						];
						setAssets(allAssets);
						setTotalUsd(d.amountInUSD);
						cache[dao[cacheKey]] = {
							assets: allAssets,
							totalUsd: d.amountInUSD,
						};
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
