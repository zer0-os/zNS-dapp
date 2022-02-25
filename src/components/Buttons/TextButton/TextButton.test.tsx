import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextButton, { TEST_ID } from './TextButton';

const mockOnClick = jest.fn();

const renderComponent = ({
	className = 'test-class',
	toggleable = false,
	selected = true,
	children = <></>,
} = {}) => {
	return render(
		<TextButton
			className={className}
			toggleable={toggleable}
			selected={selected}
			onClick={mockOnClick}
			children={children}
		></TextButton>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('TextButton component', () => {
	it('Renders TextButton', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toBeInTheDocument();
	});

	it('Does trigger onClick function', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.BUTTON);
		const originalCalls = mockOnClick.mock.calls.length;
		fireEvent.click(container);
		expect(mockOnClick.mock.calls.length - originalCalls).toEqual(1);
	});
	it('Renders children', () => {
		const child = <p>Test Children</p>;
		const { getByTestId } = renderComponent({ children: child });
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container.childElementCount).toBe(1);
	});

	it('Renders children text', () => {
		const child = <p>Test Children</p>;
		const { getByText } = renderComponent({ children: child });

		expect(getByText('Test Children')).toBeInTheDocument();
	});

	it('Has className Selected', () => {
		const { getByTestId } = renderComponent({ selected: true });
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toHaveClass('selected');
	});

	it('Has className from props', () => {
		const { getByTestId } = renderComponent({ className: 'class-prop' });
		const container = getByTestId(TEST_ID.BUTTON);
		expect(container).toHaveClass('class-prop');
	});
});
