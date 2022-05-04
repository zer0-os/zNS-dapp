import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ArrowLink, { TEST_ID } from './ArrowLink';

const renderComponent = () => {
	return render(<ArrowLink>Arrow Link</ArrowLink>);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

/**
 * 04/04/2022
 * This tests are not comprehensive, and should be expanded.
 * They miss:
 * - Does href get applied to link
 * - Does backwards arrow work
 * - Does link replace or redirect on click
 * And a few other cases
 */
describe('ArrowLink component', () => {
	it('Renders ArrowLink', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('Renders Arrow Container', () => {
		const { getByTestId } = renderComponent();

		const arrowContainer = getByTestId(TEST_ID.ARROW.CONTAINER);
		expect(arrowContainer).toBeInTheDocument();
	});

	it('Renders Arrow', () => {
		const { getByTestId } = renderComponent();

		const arrow = getByTestId(TEST_ID.ARROW.ARROW);
		expect(arrow).toBeInTheDocument();
	});
});
