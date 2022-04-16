export enum AspectRatio {
	LANDSCAPE = 'landscape', // 16:9
	PORTRAIT = 'portrait', // 4:5
}

/**
 * Hard-coded aspect ratios until we have a better
 * solution for this
 */
export const ASPECT_RATIOS: { [ratio in AspectRatio]: string[] } = {
	[AspectRatio.LANDSCAPE]: ['wilder.wheels', 'wilder.cribs'],
	[AspectRatio.PORTRAIT]: ['wilder.WoW'],
};
