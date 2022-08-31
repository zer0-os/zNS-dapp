import {
	DomainTransferEvent,
	DomainMintEvent,
	DomainBidEvent,
	DomainSaleEvent,
	DomainBuyNowSaleEvent,
} from '@zero-tech/zns-sdk';

export type DomainEvents =
	| DomainTransferEvent
	| DomainMintEvent
	| DomainBidEvent
	| DomainSaleEvent
	| DomainBuyNowSaleEvent;
