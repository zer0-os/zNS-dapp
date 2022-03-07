import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextButton, { TEST_ID } from './TextButton';

const mockOnClick = jest.fn();

const renderComponent = ({
	children = <></>,
	className = 'test-class',
	disabled = false,
	selected = true,
	style = {},
	toggleable = false,
} = {}) => {
	return render(
		<TextButton
			children={children}
			className={className}
			disabled={disabled}
			onClick={mockOnClick}
			selected={selected}
			style={style}
			toggleable={toggleable}
		></TextButton>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('TextButton component', () => {
	it('should render', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toBeInTheDocument();
	});

	it('should trigger onClick function', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.BUTTON);
		const originalCalls = mockOnClick.mock.calls.length;
		fireEvent.click(container);
		expect(mockOnClick.mock.calls.length - originalCalls).toEqual(1);
	});

	it('should render children', () => {
		const child = <p>Test Children</p>;
		const { getByText } = renderComponent({ children: child });

		expect(getByText('Test Children')).toBeInTheDocument();
	});

	it('should apply Selected class when selected prop is true', () => {
		const { getByTestId } = renderComponent({ selected: true });
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toHaveClass('Selected');
	});

	it('should apply Disabled class when disabled prop is true', () => {
		const { getByTestId } = renderComponent({ disabled: true });
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toHaveClass('Disabled');
	});

	it('should apply className from props', () => {
		const { getByTestId } = renderComponent({ className: 'class-prop' });
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toHaveClass('class-prop');
	});

	it('should apply container styles from props', () => {
		const { getByTestId } = renderComponent({
			style: { background: 'yellow' },
		});
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toHaveStyle({ background: 'yellow' });
	});
});
