//- Library Imports
import { ethers } from 'ethers';
import { Account, Domain } from 'lib/types';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';

//- Constants Imports
import { OptionTitle } from './BidTable.constants';

//- Styles Imports
import { DollarSign, X } from 'react-feather';

export type BidTableData = {
	domainName: string;
	bidNonce: string;
	domainId: string;
	domainMetadataUrl: string;
	date: Date;
	yourBid: ethers.BigNumber;
	highestBid: ethers.BigNumber;
	domain: Domain;
	paymentTokenInfo: ConvertedTokenInfo;
};

export const ActionKeys = {
	REBID: OptionTitle.REBID,
	CANCEL_BID: OptionTitle.CANCEL_BID,
};

export const getTableActions = (
	account: string | null | undefined,
	owner: Account,
) => {
	const bidTableActions = [
		{
			icon: <DollarSign />,
			title: ActionKeys.REBID,
		},
		{
			icon: <X />,
			title: ActionKeys.CANCEL_BID,
		},
	];

	const filteredActions =
		String(owner) === account
			? bidTableActions.filter((item) => item.title !== ActionKeys.REBID)
			: bidTableActions;

	return filteredActions;
};
