import { capitalize } from 'lodash';

/**
 * Truncate string
 * @param str to truncate
 * @param len length to truncate
 * @param tail tail to truncate
 * @returns truncated string
 */
export const truncateString = (
	str: string,
	len: number,
	tail: string = '...',
) =>
	str.length > len
		? str.slice(0, len > tail.length ? len - tail.length : len) + tail
		: str;

/**
 * Capitalize string
 * @param str to capitalize
 * @returns capitalized string
 */
export const capitalizeString = (str: string) => capitalize(str);
