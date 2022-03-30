import {
	DomainTransferEvent,
	DomainMintEvent,
	DomainBidEvent,
	DomainSaleEvent,
} from '@zero-tech/zns-sdk/lib/types';

export type DomainEvents =
	| DomainTransferEvent
	| DomainMintEvent
	| DomainBidEvent
	| DomainSaleEvent;
