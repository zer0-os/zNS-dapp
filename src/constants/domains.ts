/**
 * Hardcoded root domain the app should point to
 * e.g.
 *  wilder for an app hardcoded to Wilder World
 *  empty string for zero.live app
 */
export const ROOT_DOMAIN = process.env.REACT_APP_NETWORK ?? '';
export const IS_DEFAULT_NETWORK = ROOT_DOMAIN.length === 0;

/**
 * Hardcoded domain logos
 * These will need to be pulled in dynamically
 * at some point.
 */
export const DOMAIN_LOGOS = {
	WILDER_WORLD:
		'https://res.cloudinary.com/fact0ry/image/upload/c_fill,h_32,q_100,w_32/logos/wilder-orange.png',
	ZERO: 'https://res.cloudinary.com/fact0ry/image/upload/c_fill,h_32,q_100,w_32/logos/zero.svg',
};
