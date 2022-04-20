import { ROUTES } from 'constants/routes';
import { BidTable, OwnedDomainsTable } from 'containers';

/**
 * Labels to render in the address hover
 */
export const COPY_LABELS = {
	DEFAULT: 'Click to copy to clipboard',
	COPIED: 'Copied!',
};

/**
 * Not worth making an extra file just for the one type,
 * so nesting it in here
 */
type Tab = {
	title: string;
	component: () => any;
	location: string;
};

/**
 * NOTE: Default route will always be first tab
 */
export const TABS: Tab[] = [
	{
		title: 'Owned Domains',
		component: () => <OwnedDomainsTable />,
		location: ROUTES.OWNED_DOMAINS,
	},
	{
		title: 'Your Bids',
		component: () => <BidTable />,
		location: ROUTES.YOUR_BIDS,
	},
];
