//- Constants Imports
import { ROUTES } from 'constants/routes';

export const useDocumentTitle = (
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
		zna !== process.env.REACT_APP_NETWORK &&
		domainMetadataTitle
	) {
		document.title = process.env.REACT_APP_TITLE + ' | ' + domainMetadataTitle;
	} else {
		if (isMarketTitle) {
			document.title = process.env.REACT_APP_TITLE + ' | NFTs';
		} else if (isZDAOTitle) {
			document.title = process.env.REACT_APP_TITLE + ' | DAOs';
		} else if (isStakingTitle) {
			document.title = process.env.REACT_APP_TITLE + ' | Staking';
		} else if (isProfileTitle) {
			document.title = process.env.REACT_APP_TITLE + ' | Profile';
		} else {
			document.title = String(process.env.REACT_APP_TITLE);
		}
	}
};
