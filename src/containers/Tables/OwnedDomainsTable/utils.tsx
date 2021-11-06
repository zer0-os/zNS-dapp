import { Bid, Domain } from 'lib/types';

// Types
export type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

export type OwnedDomainTableProps = {
	onNavigate?: (to: string) => void;
};
// Enums
export enum Steps {
	Approve,
	Confirm,
	Accept,
}
