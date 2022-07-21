//- React Imports
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

//- Component Imports
import BidTableCard from './BidTableCard';

//- Mock Imports
import { mockData, mockOptionDropdown } from '../mocks';

//- Library Imports
import { ethers } from 'ethers';

//- Types Imports
import { getTableActions } from '../BidTable.utils';

//- Constants Imports
import { Currency } from 'constants/currency';
import { TestId } from '../BidTable.constants';

jest.mock(
	'../../../../components/Dropdowns/OptionDropdown/OptionDropdown',
	() => (props: any) => {
		mockOptionDropdown(props);
		return <div>@@</div>;
	},
);

const renderComponent = ({ data = mockData } = {}) => {
	return render(<BidTableCard data={data} />);
};

describe('BidTableCard component', () => {
	it('should render BidTableCard', () => {
		const { getByTestId } = renderComponent();

		expect(getByTestId(TestId.CARD_CONTAINER)).toBeInTheDocument();
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

	it('should render menu dropdown options', () => {
		const accountId = '0x000';
		const ownerId = { id: '0x000' };
		const options = getTableActions(accountId, ownerId);
		renderComponent();

		expect(mockOptionDropdown).toBeCalledWith(
			expect.objectContaining({ options: options }),
		);
	});
});
