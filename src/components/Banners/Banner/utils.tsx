export type BannerContentType = {
	title: string;
	subtext: string;
	timeToShow: number;
	timeToHide: number;
	countdownDate?: number;
	actionText?: string;
	action?: string;
	contractAddress?: string;
	href?: string;
	imgUrl?: string;
	imgAlt?: string;
};

export const getBannerContent = (
	date: number,
	bannerContent: BannerContentType[],
) => {
	const result = bannerContent.findIndex(
		(item) => date >= item.timeToShow && date <= item.timeToHide,
	);
	return bannerContent[result];
};
