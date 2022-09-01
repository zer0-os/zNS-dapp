import { BannerType } from './Banner.types';

export const getBannerContent = (
	currentTime: number,
	bannerContent: BannerType[],
) => {
	const result = bannerContent.findIndex(
		(item) => currentTime >= item.startTime && currentTime <= item.endTime,
	);
	return bannerContent[result];
};
