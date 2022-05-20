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
