/**
 * Format seconds as humanized string
 * @param seconds to format
 * @param showSeconds bool value to show seconds in formatted string
 * @returns formatted humanized string
 */
export const secondsToDhms = (seconds: number, showSeconds = false): string => {
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor((seconds % (3600 * 24)) / 3600);
	var m = Math.floor((seconds % 3600) / 60);
	var s = Math.floor(seconds % 60);

	var dDisplay = d > 0 ? d + 'd ' : '';
	var hDisplay = h >= 0 ? h + 'h ' : '';
	var mDisplay = m >= 0 ? m + 'm ' : '';
	var sDisplay = showSeconds ? (s > 0 ? s + 's' : '') : '';

	return dDisplay + hDisplay + mDisplay + sDisplay;
};
