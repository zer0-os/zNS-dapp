import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Member, { TEST_ID } from './Member';

const renderComponent = ({
	id = 'member_id',
	name = 'member_name',
	image = 'meber_image',
	subtext = '',
	showZna = false,
} = {}) => {
	return render(
		<Member
			id={id}
			name={name}
			image={image}
			subtext={subtext}
			showZna={showZna}
		/>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('Member component', () => {
	it('Renders Member', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('Renders Member Info', () => {
		const { getByTestId } = renderComponent();

		const info = getByTestId(TEST_ID.MEMBER_INFO);
		expect(info).toBeInTheDocument();
	});

	it('Renders Member ID with the formatter', () => {
		const id = '1234567890';
		const { getByTestId } = renderComponent({ id });

		const memberId = getByTestId(TEST_ID.MEMBER_ID);
		const expectedMemberID = `${id.substring(0, 4)}...${id.substring(
			id.length - 4,
		)}`;
		expect(memberId).toBeInTheDocument();
		expect(memberId).toHaveTextContent(expectedMemberID);
	});

	it('Does not render the member subtext when it has no value', () => {
		const { queryByTestId } = renderComponent();

		const memberSubText = queryByTestId(TEST_ID.MEMBER_TEXT);
		expect(memberSubText).toBeNull();
	});

	it('Does not render the member subtext when it has value', () => {
		const subtext = 'this is subtext';
		const { getByTestId } = renderComponent({ subtext });

		const memberSubtext = getByTestId(TEST_ID.MEMBER_TEXT);
		expect(memberSubtext).toBeInTheDocument();
		expect(memberSubtext).toHaveTextContent(subtext);
	});

	it('Does render ZNA button when the showZna is true', () => {
		const { getByTestId } = renderComponent({ showZna: true });

		const memberZnaBtn = getByTestId(TEST_ID.MEMBER_ZNA_BUTTON);
		expect(memberZnaBtn).toBeInTheDocument();
	});

	it('Does not render ZNA button when the showZna is false', () => {
		const { queryByTestId } = renderComponent({ showZna: false });

		const memberZnaBtn = queryByTestId(TEST_ID.MEMBER_ZNA_BUTTON);
		expect(memberZnaBtn).toBeNull();
	});
});
