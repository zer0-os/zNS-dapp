//- Library Imports
import { ethers } from 'ethers';

export const mockDate = new Date(16461998260001);

export const mockPaymentTokenInfo = {
	id: '0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79',
	name: 'WILD',
	priceInUsd: '0.17677',
	symbol: 'WILD',
	decimals: '18',
};

// export const mockData = {
// 	bidNonce: '7124487995',
// 	date: mockDate, // 02/03/2022
// 	domainId:
// 		'0x617b3c878abfceb89eb62b7a24f393569c822946bbc9175c6c65a7d2647c5402',
// 	domainMetadataUrl: 'ipfs://QmYKjGMUG3qmx9TZqUSpceHtP2hjomUCiB2fMbJXVBaENd',
// 	domainName: 'wilder.cats',
// 	highestBid: ethers.utils.parseEther('1000'),
// 	yourBid: ethers.utils.parseEther('500'),
// 	paymentTokenInfo: mockPaymentTokenInfo,
// };

export const mockData = {
	domain: {
		id: '0x000',
		name: 'test-domain-name',
		parent: { id: '0x111', name: 'parent-test-domain-name' },
		owner: { id: '0x222' },
		minter: { id: '0x333' },
		metadata: 'test-metadata',
		isLocked: false,
		lockedBy: { id: '0x333' },
	},
	bidNonce: '7124487995',
	date: mockDate, // 02/03/2022
	domainId:
		'0x617b3c878abfceb89eb62b7a24f393569c822946bbc9175c6c65a7d2647c5402',
	domainMetadataUrl: 'ipfs://QmYKjGMUG3qmx9TZqUSpceHtP2hjomUCiB2fMbJXVBaENd',
	domainName: 'wilder.cats',
	highestBid: ethers.utils.parseEther('1000'),
	yourBid: ethers.utils.parseEther('500'),
	paymentTokenInfo: mockPaymentTokenInfo,
};

export var mockOptionDropdown = jest.fn();
