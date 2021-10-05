import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import FutureButton, { TEST_ID } from './FutureButton';

const mockOnClick = jest.fn();

const renderComponent = ({
	loading = false,
	toggleable = false,
	glow = true,
} = {}) => {
	return render(
		<FutureButton
			loading={loading}
			toggleable={toggleable}
			glow={glow}
			onClick={mockOnClick}
		>
			Future Button
		</FutureButton>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('FutureButton component', () => {
	it('Renders FutureButton', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('Does trigger onClick function', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.CONTAINER);
		const originalCalls = mockOnClick.mock.calls.length;
		fireEvent.mouseUp(container);
		expect(mockOnClick.mock.calls.length - originalCalls).toEqual(1);
	});

	it('Does render loader when the loading is true', () => {
		const { getByTestId } = renderComponent({ loading: true });

		const spinner = getByTestId(TEST_ID.LOADER);
		expect(spinner).toBeInTheDocument();
	});

	it('Does not render loader when the loading is false', () => {
		const { queryByTestId } = renderComponent({ loading: false });

		const spinner = queryByTestId(TEST_ID.LOADER);
		expect(spinner).toBeNull();
	});

	it('Does render wash when the component is rendered', () => {
		const { getByTestId } = renderComponent();

		const wash = getByTestId(TEST_ID.WASH);
		expect(wash).toBeInTheDocument();
	});
});
