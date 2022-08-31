import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import FutureButton, { TEST_ID } from './FutureButton';

//////////
// Mock //
//////////

const EXPECTED_VALUES = {
	CLASS_NAME: 'test-class-name',
	BUTTON_TEXT: 'text-button-text',
};

const mockOnClick = jest.fn();

///////////
// Setup //
///////////

const renderComponent = ({
	className = EXPECTED_VALUES.CLASS_NAME,
	loading = false,
	glow = true,
} = {}) => {
	return render(
		<FutureButton
			className={className}
			loading={loading}
			glow={glow}
			onClick={mockOnClick}
		>
			{EXPECTED_VALUES.BUTTON_TEXT}
		</FutureButton>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

///////////
// Tests //
///////////

describe('FutureButton component', () => {
	it('should render container', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('should render button content', () => {
		const { getByText } = renderComponent();
		const text = getByText(EXPECTED_VALUES.BUTTON_TEXT);
		expect(text).toBeInTheDocument();
	});

	it('should trigger onClick function', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		fireEvent.mouseUp(container);
		expect(mockOnClick.mock.calls.length).toEqual(1);
	});

	it('should apply className from props', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container.className).toContain(EXPECTED_VALUES.CLASS_NAME);
	});

	it('should not render loader when the loading is false', () => {
		const { queryByTestId } = renderComponent();
		const spinner = queryByTestId(TEST_ID.LOADER);
		expect(spinner).toBeNull();
	});

	it('should render wash when the component is rendered', () => {
		const { getByTestId } = renderComponent();
		const wash = getByTestId(TEST_ID.WASH);
		expect(wash).toBeInTheDocument();
	});

	it('should render loader when the loading is true', () => {
		const { getByTestId } = renderComponent({ loading: true });
		const spinner = getByTestId(TEST_ID.LOADER);
		expect(spinner).toBeInTheDocument();
	});
});
