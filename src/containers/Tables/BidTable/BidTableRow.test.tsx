import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { HEADERS } from './BidTable';
import BidTableRow, { TEST_ID } from './BidTableRow';
import { ethers } from 'ethers';

const mockDate = new Date(16461998260001);

const mockData = {
	auctionId: '7124487995',
	date: mockDate, // 02/03/2022
	domainId:
		'0x617b3c878abfceb89eb62b7a24f393569c822946bbc9175c6c65a7d2647c5402',
	domainMetadataUrl: 'ipfs://QmYKjGMUG3qmx9TZqUSpceHtP2hjomUCiB2fMbJXVBaENd',
	domainName: 'wilder.cats',
	highestBid: ethers.utils.parseEther('1000'),
	yourBid: ethers.utils.parseEther('500'),
};

const renderComponent = ({ data = mockData } = {}) => {
	return render(
		<table>
			<tbody>
				<BidTableRow data={data} />
			</tbody>
		</table>,
	);
};

describe('BidTableRow component', () => {
	it('should render', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('should have correct number of columns', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container.childElementCount).toBe(HEADERS.length);
	});

	it('should render bid amounts correctly', () => {
		const { getByTestId } = renderComponent();
		const yourBid = getByTestId(TEST_ID.YOUR_BID);
		const highsetBid = getByTestId(TEST_ID.HIGHEST_BID);
		expect(yourBid.textContent).toBe('500.0 WILD');
		expect(highsetBid.textContent).toBe('1000.0 WILD');
	});

	it('should format date correctly', () => {
		const { getByTestId } = renderComponent();
		const yourBid = getByTestId(TEST_ID.DATE);
		expect(yourBid.textContent).toBe(mockDate.toLocaleDateString());
	});

	it('should render "You Lead" if user\'s bid is highest', () => {
		const { getByTestId } = renderComponent({
			data: {
				...mockData,
				highestBid: ethers.utils.parseEther('100'),
				yourBid: ethers.utils.parseEther('100'),
			},
		});
		const status = getByTestId(TEST_ID.STATUS);
		expect(status.textContent).toBe('You Lead');
	});

	it('should render "Outbid" if user\'s bid is not the highest', () => {
		const { getByTestId } = renderComponent({
			data: {
				...mockData,
				highestBid: ethers.utils.parseEther('200'),
				yourBid: ethers.utils.parseEther('100'),
			},
		});
		const status = getByTestId(TEST_ID.STATUS);
		expect(status.textContent).toBe('Outbid');
	});
});
