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
	hasCountdown?: boolean;
	onFinish: () => void;
	background: string;
};

const useBannerData = (): UseBannerDataReturn => {
	const currentTime = new Date().getTime();
	// temp endpoint
	const contentData: BannerType[] = BannerData;
	const [isBanner, setIsBanner] = useState<boolean>(true);
	const [bannerContent, setBannerContent] = useState<BannerType | undefined>();
	const [background, setBackground] = useState<string>('');
	const [hasCountdown, setHasCountdown] = useState<boolean | undefined>(
		bannerContent?.hasCountdown,
	);

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

			if (
				Boolean(bannerContent.hasCountdown) &&
				Boolean(bannerContent.endTime) &&
				currentTime < bannerContent.endTime
			) {
				setHasCountdown(true);
			}
		}
	}, [bannerContent, contentData, currentTime]);

	const onFinish = () => {
		setHasCountdown(false);
	};

	return {
		bannerContent,
		isBanner,
		hasCountdown,
		onFinish,
		background,
	};
};

export default useBannerData;
