import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PreviewCard, { TEST_ID_PARENT } from './PreviewCard';

const renderComponent = ({
	preventInteraction = false,
	children = <></>,
	creatorId = '',
	description = '',
	disabled = false,
	domain = '',
	image = '',
	isLoading = false,
	mvpVersion = 0,
	name = '',
	ownerId = '',
	style = {},
} = {}) => {
	return render(
		<PreviewCard
			preventInteraction={preventInteraction}
			creatorId={creatorId}
			description={description}
			disabled={disabled}
			domain={domain}
			image={image}
			isLoading={isLoading}
			mvpVersion={mvpVersion}
			name={name}
			ownerId={ownerId}
			style={style}
		/>,
	);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

const mockChildComponentNFTMedia = jest.fn();
const mockChildComponentTextButton = jest.fn();

jest.mock('../../NFTMedia', () => (props: any) => {
	mockChildComponentNFTMedia(props);
	return <div>NFT MEDIA</div>;
});

jest.mock('../../Buttons/TextButton/TextButton', () => (props: any) => {
	mockChildComponentTextButton(props);
	return <div>View NFT Page</div>;
});

describe('preview card component', () => {
	it('Renders Component', () => {
		const { getByTestId } = renderComponent();
		const container = getByTestId(TEST_ID_PARENT.CONTAINER);
		expect(container).toBeInTheDocument();
	});

	it('Does render blocker', () => {
		const { getByTestId } = renderComponent({ preventInteraction: true });
		const bloker = getByTestId(TEST_ID_PARENT.BLOCKER);
		expect(bloker).toBeInTheDocument();
	});

	it('Does render loader', () => {
		const { getByTestId } = renderComponent({ isLoading: true });
		const loader = getByTestId(TEST_ID_PARENT.LOADER);
		expect(loader).toBeInTheDocument();
	});

	it('Does render spinner', () => {
		const { getByTestId } = renderComponent({ isLoading: true });
		const spinner = getByTestId(TEST_ID_PARENT.SPINNER);
		expect(spinner).toBeInTheDocument();
	});

	it('Does render preview image container', () => {
		const { getByTestId } = renderComponent({ isLoading: false });
		const previewImage = getByTestId(TEST_ID_PARENT.PREVIEW_IMAGE);
		expect(previewImage).toBeInTheDocument();
	});

	it('Does have opacity style', () => {
		const { getByTestId } = renderComponent({ isLoading: false });
		const previewImage = getByTestId(TEST_ID_PARENT.PREVIEW_IMAGE);
		expect(previewImage).toHaveStyle({ opacity: 1 });
	});

	it('Asset element Does have classname', () => {
		const { getByTestId } = renderComponent({ mvpVersion: 3 });
		const asset = getByTestId(TEST_ID_PARENT.ASSET);
		expect(asset).toHaveClass('MVP3Asset');
	});

	it('Does Contain </NFTMEDIA>', () => {
		const { getByTestId } = renderComponent();
		const asset = getByTestId(TEST_ID_PARENT.ASSET);
		expect(asset.childElementCount).toBe(1);
	});

	it('Does Render Children NFTMedia with image url', () => {
		const image =
			'https://res.cloudinary.com/fact0ry/image/upload/c_…ns/QmRLG913uKX7QxwSFMk1TMhtjxwy6kVek37HTcR7AtJUVf';
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { getByTestId } = renderComponent({
			image: image,
		});
		expect(mockChildComponentNFTMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				size: 'medium',
				className: 'Image img-border-rounded',
				alt: 'NFT Preview',
				ipfsUrl: image,
			}),
		);
	});

	it('Does Not Render </TextButton>', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { getByTestId } = renderComponent({ mvpVersion: 0 });
		expect(mockChildComponentTextButton).not.toHaveBeenCalled();
	});
	it('Does render InfoContainer and have BUY as decendant', () => {
		const { getByTestId } = renderComponent();
		const infoContainer = getByTestId(TEST_ID_PARENT.INFO_CONTAINER);
		const buyContainer = getByTestId(TEST_ID_PARENT.BUY_CONTAINER);
		expect(infoContainer).toContainElement(buyContainer);
	});

	it('Does render InfoContainer and have BODY as decendant', () => {
		const { getByTestId } = renderComponent();
		const infoContainer = getByTestId(TEST_ID_PARENT.INFO_CONTAINER);
		const bodyContainer = getByTestId(TEST_ID_PARENT.BODY_COMPONENT);
		expect(infoContainer).toContainElement(bodyContainer);
	});

	it('Body component title has name as value', () => {
		const name = 'this is a test';
		const { getByTestId } = renderComponent({ name: name });
		const bodyContainerTitle = getByTestId(TEST_ID_PARENT.BODY_COMPONENT_TITLE);
		expect(bodyContainerTitle).toHaveTextContent(name);
	});

	it('Body component description has description as value', () => {
		const description = 'this is a test';
		const { getByTestId } = renderComponent({ description: description });
		const bodyContainerDescription = getByTestId(
			TEST_ID_PARENT.BODY_COMPONENT_DESCRIPTION,
		);
		expect(bodyContainerDescription).toHaveTextContent(description);
	});

	it('Does render future button container', () => {
		const { getByTestId } = renderComponent({ mvpVersion: 3 });
		const futureButtonContainer = getByTestId(
			TEST_ID_PARENT.FUTURE_BUTTON_CONTAINER,
		);
		expect(futureButtonContainer).toBeVisible();
	});
});
