//- React Imports
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

//- Component Imports
import BidTableRow from './BidTableRow';

//- Types Imports
import { Actions } from '../BidTable.types';

//- Library Imports
import { ethers } from 'ethers';

//- Constants Imports
import { Currency } from 'constants/currency';
import { TestId, Headers } from '../BidTable.constants';

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
		renderComponent();

		expect(mockOptionDropdown).toBeCalledWith(
			expect.objectContaining({ options: Actions }),
		);
	});
});
