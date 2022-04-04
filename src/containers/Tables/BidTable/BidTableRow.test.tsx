import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { HEADERS } from './BidTable';
import BidTableRow, { ACTIONS, TEST_ID } from './BidTableRow';
import { ethers } from 'ethers';

import { TOKEN } from './BidTableRow.constants';

const mockDate = new Date(16461998260001);

const mockData = {
	bidNonce: '7124487995',
	date: mockDate, // 02/03/2022
	domainId:
		'0x617b3c878abfceb89eb62b7a24f393569c822946bbc9175c6c65a7d2647c5402',
	domainMetadataUrl: 'ipfs://QmYKjGMUG3qmx9TZqUSpceHtP2hjomUCiB2fMbJXVBaENd',
	domainName: 'wilder.cats',
	highestBid: ethers.utils.parseEther('1000'),
	yourBid: ethers.utils.parseEther('500'),
};

var mockOptionDropdown = jest.fn();

jest.mock(
	'../../../components/Dropdowns/OptionDropdown/OptionDropdown',
	() => (props: any) => {
		mockOptionDropdown(props);
		return <div>@@</div>;
	},
);

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
		expect(yourBid).toHaveTextContent('500.0 ' + TOKEN);
		expect(highsetBid.textContent).toBe('1000.0 ' + TOKEN);
	});

	it('should render options menu correctly', () => {
		renderComponent();
		expect(mockOptionDropdown).toBeCalledWith(
			expect.objectContaining({ options: ACTIONS }),
		);
	});
});
