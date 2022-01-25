export type BannerData = {
	title: string;
	label: React.ReactNode;
	buttonText: string;
	bannerImageUrl: string;
	bannerImageAlt: string;
};

export enum IndustryType {
	WHEELS = 'WHEELS',
	CRIBS = 'CRIBS',
	KICKS = 'KICKS',
	PETS = 'PETS',
}

export enum BannerEventType {
	RAFFLE = 'RAFFLE',
	MINT = 'MINT',
}

export const getBannerTitle = (banner?: IndustryType) => {
	switch (banner) {
		case IndustryType.WHEELS:
			return 'Wilder Wheels';
		case IndustryType.CRIBS:
			return 'Wilder Cribs';
		case IndustryType.KICKS:
			return 'Wilder Kicks';
		case IndustryType.PETS:
			return 'Wilder Pets';
		default:
			return '';
	}
};
