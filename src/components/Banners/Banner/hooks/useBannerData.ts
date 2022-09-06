//- React imports
import { useEffect, useState } from 'react';

//- Types Imports
import { BannerType } from '../Banner.types';

//- Utils Imports
import { getBannerContent } from '../Banner.utils';

//- Data Imports
import BannerData from '../Banner.data.json';

export type UseBannerDataReturn = {
	bannerContent?: BannerType;
	isBanner: boolean;
	isCountdown: boolean;
	onFinish: () => void;
	background: string;
};

const useBannerData = (): UseBannerDataReturn => {
	const currentTime = new Date().getTime();
	// temp endpoint
	const contentData: BannerType[] = BannerData;
	const [isBanner, setIsBanner] = useState<boolean>(true);
	const [isCountdown, setIsCountdown] = useState<boolean>(false);
	const [bannerContent, setBannerContent] = useState<BannerType | undefined>();
	const [background, setBackground] = useState<string>('');

	useEffect(() => {
		let isActive = true;

		const content = getBannerContent(currentTime, contentData);
		setBannerContent(content);

		if (isActive) {
			if (bannerContent?.imgUrl) {
				fetch(bannerContent.imgUrl)
					.then((r) => r.blob())
					.then((blob) => {
						const url = URL.createObjectURL(blob);
						setBackground(url);
					});
			}
		}

		if (!bannerContent) {
			setIsBanner(false);
		} else {
			setIsBanner(true);
			if (bannerContent.endTime && currentTime < bannerContent.endTime) {
				setIsCountdown(true);
			}
		}
	}, [bannerContent, contentData, currentTime]);

	const onFinish = () => {
		setIsCountdown(false);
	};

	return {
		bannerContent,
		isBanner,
		isCountdown,
		onFinish,
		background,
	};
};

export default useBannerData;
