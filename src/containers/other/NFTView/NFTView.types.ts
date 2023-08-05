import {
	DomainBidEvent,
	DomainBuyNowSaleEvent,
	DomainMintEvent,
	DomainSaleEvent,
	DomainTransferEvent,
} from '@zero-tech/zns-sdk';

export type DomainEvents =
	| DomainTransferEvent
	| DomainMintEvent
	| DomainBidEvent
	| DomainSaleEvent
	| DomainBuyNowSaleEvent;
