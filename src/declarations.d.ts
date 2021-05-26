import { ExternalProvider } from '@ethersproject/providers';
declare global {
	interface Window {
		ethereum: ExternalProvider;
	}
	interface DomainTableData {
		tableId: number;
		metadataUri: string;
		domainName: string;
		lastBid: number;
		numBids: number;
		lastSalePrice: number;
		tradePrice: number;
	}
	module '*.mp4';
}

window.ethereum = window.ethereum || undefined;
