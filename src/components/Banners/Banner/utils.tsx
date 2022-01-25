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
	CRAFTS = 'CRAFTS',
}

export enum BannerEventType {
	RAFFLE = 'RAFFLE',
	MINT = 'MINT',
}

export const getIndustryTitle = (industryType: IndustryType) => {
	switch (industryType) {
		case IndustryType.WHEELS:
			return 'Wheels';
		case IndustryType.CRIBS:
			return 'Cribs';
		case IndustryType.KICKS:
			return 'Kicks';
		case IndustryType.PETS:
			return 'Pets';
		case IndustryType.CRAFTS:
			return 'Crafts';
		default:
			return '';
	}
};
