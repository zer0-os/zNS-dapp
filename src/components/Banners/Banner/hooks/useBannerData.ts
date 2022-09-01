//- React imports
import { useEffect, useState } from 'react';

//- Types Imports
import { BannerType } from '../Banner.types';

//- Utils Imports
import { getBannerContent } from '../Banner.utils';

//- Data Imports
import BannerData from '../Banner.data.json';

export type UseBannerDataReturn = {
	data?: BannerType;
	background?: string;
	isBanner?: boolean;
};

const useBannerData = (): UseBannerDataReturn => {
	const currentTime = new Date().getTime();
	const jsonData: BannerType[] = BannerData;

	const [data, setData] = useState<BannerType>();
	const [background, setBackground] = useState<string | undefined>();
	const [isBanner, setIsBanner] = useState<boolean>(true);

	useEffect(() => {
		let isMounted = true;

		const content = getBannerContent(currentTime, jsonData);
		setData(content);

		if (isMounted) {
			if (!data) {
				setIsBanner(false);
			} else {
				setIsBanner(true);
			}
		}

		fetch(content.imgUrl)
			.then((r) => r.blob())
			.then((blob) => {
				if (isMounted) {
					const url = URL.createObjectURL(blob);
					setBackground(url);
				}
			});
		return () => {
			isMounted = false;
		};
	}, [currentTime, data, jsonData]);

	// to be removed
	console.log('current', currentTime);
	console.log('open', currentTime + 50000);
	console.log('end', currentTime * 50);

	return {
		data,
		background,
		isBanner,
	};
};

export default useBannerData;
