//- React Imports
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

//- Component Imports
import BidTableRow from './BidTableRow';

//- Types Imports
import { bidTableActions } from '../BidTable.types';

//- Utils Imports
import { getTableActions } from '../BidTable.utils';

//- Library Imports
import { ethers } from 'ethers';

//- Constants Imports
import { Currency } from 'constants/currency';
import { Headers, TestId } from '../BidTable.constants';

//- Mock Imports
import { mockData, mockOptionDropdown } from '../mocks';

jest.mock(
	'../../../../components/Dropdowns/OptionDropdown/OptionDropdown',
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

		expect(getByTestId(TestId.ROW_CONTAINER)).toBeInTheDocument();
	});

	it('should have correct number of columns', () => {
		const { getByTestId } = renderComponent();

		expect(getByTestId(TestId.ROW_CONTAINER).childElementCount).toBe(
			Headers.length,
		);
	});

	it('should render bid amounts correctly', () => {
		const { getByTestId } = renderComponent();

		expect(getByTestId(TestId.YOUR_BID)).toHaveTextContent(
			ethers.utils.formatEther(mockData.yourBid) + ' ' + Currency.WILD,
		);
		expect(getByTestId(TestId.HIGHEST_BID).textContent).toBe(
			ethers.utils.formatEther(mockData.highestBid) + ' ' + Currency.WILD,
		);
	});

	it('should render options menu correctly', () => {
		const accountId = '0x000';
		const ownerId = mockData.domain.owner;
		const options = getTableActions(accountId, ownerId);
		renderComponent();

		expect(mockOptionDropdown).toBeCalledWith(
			expect.objectContaining({ options: options }),
		);
	});

	it('should render both Rebid and Cancel Bid options when owner ID is not equal to account ID', () => {
		const accountId = '0x000';
		const ownerId = mockData.domain.owner;
		const options = getTableActions(accountId, ownerId);

		renderComponent();

		expect(options.length).toEqual(2);
		expect(options).toEqual(bidTableActions);
	});

	it('should only render Cancel Bid option when owner ID is equal to account ID', () => {
		// for purpose of using the same ID
		const accountId = mockData.domain.owner;
		const ownerId = mockData.domain.owner;
		const options = getTableActions(String(accountId), ownerId);

		renderComponent();

		expect(options.length).toEqual(1);
		expect(options).toContain(bidTableActions[1]);
		expect(options).not.toContain(bidTableActions[0]);
	});
});
