export type BannerType = {
	primaryText: string;
	secondaryText: string;
	imgUrl: string;
	buttonText: string;
	startTime: number;
	endTime: number;
	target: {
		type: string;
		value: string;
	};
};
