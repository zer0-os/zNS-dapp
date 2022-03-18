import { useEffect, useRef, useState } from 'react';
import mock from './useDaoAssets.mock';

type UseDaoAssetsReturn = {
	assets?: any[];
	isLoading: boolean;
	refetch: () => void;
};

const useDaoAssets = (daoId: string): UseDaoAssetsReturn => {
	const isMounted = useRef<boolean>();
	const [assets, setAssets] = useState<any[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getAssets = async (): Promise<any[] | undefined> => {
		await new Promise((r) => setTimeout(r, 1500));
		return mock.mockAssets;
	};

	const refetch = () => {
		getAssets()
			.then((d) => {
				if (isMounted.current) {
					setAssets(d);
					setIsLoading(false);
				}
			})
			.catch((e) => {
				console.error(e);
			});
	};

	useEffect(() => {
		isMounted.current = true;
		refetch();
		return () => {
			isMounted.current = false;
		};
	}, [daoId]);

	return {
		assets,
		isLoading,
		refetch,
	};
};

export default useDaoAssets;
