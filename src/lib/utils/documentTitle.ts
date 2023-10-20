//- Constants Imports
import { ROUTES } from 'constants/routes';

export const updateDocumentTitle = (
	zna: string,
	app: string,
	domainMetadataTitle?: string,
) => {
	const isRootZNA = zna.split('.').length === 1;
	const isMarketTitle = isRootZNA && app === ROUTES.MARKET;
	const isZDAOTitle = isRootZNA && app === ROUTES.ZDAO;
	const isStakingTitle = app.includes(ROUTES.STAKING);
	const isProfileTitle = app.includes(ROUTES.PROFILE);

	// set title
	if (
		zna.length > 0 &&
		zna !== import.meta.env.VITE_NETWORK &&
		domainMetadataTitle
	) {
		document.title = import.meta.env.VITE_TITLE + ' | ' + domainMetadataTitle;
	} else {
		if (isMarketTitle) {
			document.title = import.meta.env.VITE_TITLE + ' | NFTs';
		} else if (isZDAOTitle) {
			document.title = import.meta.env.VITE_TITLE + ' | DAOs';
		} else if (isStakingTitle) {
			document.title = import.meta.env.VITE_TITLE + ' | Staking';
		} else if (isProfileTitle) {
			document.title = import.meta.env.VITE_TITLE + ' | Profile';
		} else {
			document.title = String(import.meta.env.VITE_TITLE);
		}
	}
};
