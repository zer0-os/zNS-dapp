export type AuctionBannerType = {
	startTime: number;
	imgUrl: string;
	link: {
		text: string;
		url: string;
	};
	countdown: {
		primaryText: string;
		secondaryText: string;
		duration: number;
	};
	auctionOpen: {
		primaryText: string;
		secondaryText: string;
		duration: number;
	};
	auctionClosed: {
		primaryText: string;
		secondaryText: string;
		duration: number;
	};
};

export const getContent = (
	date: number,
	bannerContent: AuctionBannerType[],
) => {
	const result = bannerContent.findIndex(
		(item) => date >= item.startTime && date <= item.auctionClosed.duration,
	);
	return bannerContent[result];
};
