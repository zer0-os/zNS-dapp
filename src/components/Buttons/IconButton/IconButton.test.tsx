import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import IconButton, { TEST_ID } from './IconButton';

const mockOnClick = jest.fn();

const renderComponent = ({
	className = '',
	toggleable = false,
	iconUri = '',
	style = {},
	toggled = false,
	alt = '',
	disabled = false,
} = {}) => {
	return render(
		<IconButton
			className={className}
			toggleable={toggleable}
			iconUri={iconUri}
			style={style}
			toggled={toggled}
			onClick={mockOnClick}
			alt={alt}
			disabled={disabled}
		/>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('IconButton component', () => {
	it('Renders IconButton', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('Button to have classname Selected', () => {
		const { getByTestId } = renderComponent({ toggled: true });
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toHaveClass('selected');
	});

	it('Button to have classname Disable', () => {
		const { getByTestId } = renderComponent({ disabled: true });
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toHaveClass('Disabled');
	});
	it('Button to have classname coming through props', () => {
		const { getByTestId } = renderComponent({ className: 'ClassName-Prop' });
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toHaveClass('ClassName-Prop');
	});

	it('Has alt from props alt', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { getByTestId } = renderComponent({ alt: 'alt-img' });
		const imageEl = screen.getByAltText('alt-img');
		expect(imageEl).toBeInTheDocument();
	});

	it('Does trigger onClick function', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		const originalCalls = mockOnClick.mock.calls.length;
		fireEvent.click(container);
		expect(mockOnClick.mock.calls.length - originalCalls).toEqual(1);
	});
});
