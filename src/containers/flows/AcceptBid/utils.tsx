import { Bid, Domain, DomainData } from 'lib/types';
import { Contracts } from 'lib/contracts';

// Enums
export enum Steps {
	Approve,
	Confirm,
	Accept,
}

// Types
export type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

export type AcceptBidProps = {
	setViewingDomain: (value: DomainData | undefined) => void;
	acceptingBid: AcceptBidModalData;
	onClose: () => void;
	setError: (text: string) => void;
	error: string;
	zAuctionAddress: string;
	znsContracts: Contracts;
	ownedQuery: any;
};
