export const isWilderWorldAppDomain = (url: string) => {
	const matches =
		url.match(
			/(https?:\/\/(.+?\.)?app\.wilderworld\.com(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)/,
		) || [];

	return matches.length > 0;
};
