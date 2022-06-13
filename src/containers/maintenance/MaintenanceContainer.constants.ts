enum PAGE_TYPE {
	PAGE_NOT_FOUND,
	GENERAL_ERROR,
	MAINTENANCE,
}

export const TITLE = {
	[PAGE_TYPE.PAGE_NOT_FOUND]: '404',
	[PAGE_TYPE.GENERAL_ERROR]: 'Something went wrong',
	[PAGE_TYPE.MAINTENANCE]: 'We’ll be back soon!',
};

export const SECONDARY_TITLE = {
	[PAGE_TYPE.PAGE_NOT_FOUND]: 'Lost in the Metaverse',
};

export const SUBTEXT = {
	[PAGE_TYPE.PAGE_NOT_FOUND]:
		'We’re sorry, we couldn’t find the page you’re looking for.',
	[PAGE_TYPE.GENERAL_ERROR]:
		'It’s not you, it’s us. We’ll get this fixed as soon as possible.',
	[PAGE_TYPE.MAINTENANCE]:
		'Sorry for the inconvenience, we’re undergoing some maintenance.',
};

export const LINK_TEXT = {
	[PAGE_TYPE.MAINTENANCE]: 'Follow our Discord for further updates.',
};

export const BUTTON_TEXT = 'Back to Home';
