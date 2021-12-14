import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Artwork, { TEST_ID } from './Artwork';
import { BrowserRouter } from 'react-router-dom';

const renderComponent = ({
	domain = '0://wilder.kovansaletest9',
	disableInteraction = false,
	id = '',
	image = '',
	metadataUrl = '',
	name = '',
	pending = false,
	style = {},
} = {}) => {
	return render(
		<BrowserRouter>
			<Artwork
				domain={domain}
				disableInteraction={disableInteraction}
				id={id}
				image={image}
				metadataUrl={metadataUrl}
				name={name}
				pending={pending}
				style={style}
			/>
			,
		</BrowserRouter>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

const mockChildComponentNFTMedia = jest.fn();

jest.mock('../NFTMedia', () => (props: any) => {
	mockChildComponentNFTMedia(props);
	return <div>NFT MEDIA</div>;
});

describe('ArtWork component', () => {
	it('Renders Component', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('Renders Artwork Component', () => {
		const { getByTestId } = renderComponent();
		const artworkContainer = getByTestId(TEST_ID.ARTWORK_CONTAINER);
		expect(artworkContainer.childElementCount).toBe(1);
		expect(mockChildComponentNFTMedia).toBeDefined();
	});

	it('Should animate', () => {
		const metauriMock =
			'https://ipfs.fleek.co/ipfs/QmVPsNsdHy1Xww3aUBJHR6xopn42jF7UhjTfG5zqY9hmL8';
		const { getAllByTestId } = renderComponent({
			metadataUrl: metauriMock,
			name: 'testing',
		});
		const shouldAnimate = getAllByTestId(TEST_ID.SHOULD_ANIMATE);
		expect(shouldAnimate).toBeDefined();
		expect(shouldAnimate).toHaveLength(1);
	});

	it('Should have name as  value', async () => {
		const name = 'testing';
		const metauriMock =
			'https://ipfs.fleek.co/ipfs/QmVPsNsdHy1Xww3aUBJHR6xopn42jF7UhjTfG5zqY9hmL8';
		const { getAllByTestId } = renderComponent({
			metadataUrl: metauriMock,
			name: name,
		});
		const shouldAnimate = getAllByTestId(TEST_ID.SHOULD_ANIMATE);

		expect(shouldAnimate[0]).toHaveTextContent(name);
	});

	it('Domain should be truncated', () => {
		const mockDomain = '0://wilder.wheelstest1.27.table';
		const truncated = 'wilder...table';
		const { getByTestId } = renderComponent({
			domain: mockDomain,
			pending: false,
			disableInteraction: true,
		});

		const disableLink = getByTestId(TEST_ID.DISABLE_LINK);
		expect(disableLink).toBeInTheDocument();
		expect(disableLink.textContent).toBe(truncated);
	});

	it('Renders link correctly and navigates correctly', () => {
		const mockDomain = '0://wilder.wheelstest1.27.table';
		const domainSplit = mockDomain.split('wilder.')[1];
		const { getByTestId } = renderComponent({
			domain: mockDomain,
			pending: false,
			disableInteraction: false,
		});

		const link = getByTestId(TEST_ID.LINK);
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', `/${domainSplit}`);
	});

	it('Renders span when Pending === true', () => {
		const mockDomain = '0://wilder.wheelstest1.27.table';
		const { getByTestId } = renderComponent({
			domain: mockDomain,
			pending: true,
		});
		const pendingSpan = getByTestId(TEST_ID.PENDING);
		expect(pendingSpan).toBeInTheDocument();
		expect(pendingSpan.textContent).toBe(mockDomain);
	});
});
