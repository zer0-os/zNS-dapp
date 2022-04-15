import { DEFAULT_IPFS_GATEWAY } from 'constants/ipfs';
import { getMetadata, parseDomainMetadata } from './metadata';

const MOCK_METADATA = {
	description: 'loves testing javascript',
	image: 'image url',
	image_full: 'full image url',
	previewImage: 'preview image url',
	animation_url: 'animation url',
	stakingRequests: 'enabled',
};

const MOCK_METADATA_WITH_NAME = {
	...MOCK_METADATA,
	name: 'the tester',
};

const MOCK_METADATA_WITH_TITLE = {
	...MOCK_METADATA,
	title: 'the tester',
};

const MOCK_METADATA_UNHANDLED_VALUE = {
	...MOCK_METADATA,
	unhandledValue: 'test',
};

const MOCK_METADATA_FULL = {
	...MOCK_METADATA,
	...MOCK_METADATA_WITH_TITLE,
	attributes: ['test attribute'],
	isBiddable: true,
	isMintable: true,
	gridViewByDefault: true,
	customDomainHeader: true,
	customDomainHeaderValue: 'test domain header',
};

const MOCK_METADATA_DEFAULT = {
	...MOCK_METADATA,
	...MOCK_METADATA_WITH_TITLE,
	attributes: undefined,
	isBiddable: true,
	isMintable: false,
	gridViewByDefault: false,
	customDomainHeader: false,
	customDomainHeaderValue: undefined,
};

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({ test: 100 }),
	}),
) as jest.Mock;

/////////////////////////////
// f:: parseDomainMetadata //
/////////////////////////////

describe('parseDomainMetadata', () => {
	it('should parse full metadata correctly', () => {
		expect(parseDomainMetadata(MOCK_METADATA_FULL as any)).toEqual(
			MOCK_METADATA_FULL,
		);
	});

	it('should parse partial metadata correctly', () => {
		expect(parseDomainMetadata(MOCK_METADATA_WITH_TITLE as any)).toEqual(
			MOCK_METADATA_DEFAULT,
		);
	});

	it('should handle "name" correctly', () => {
		expect(parseDomainMetadata(MOCK_METADATA_WITH_NAME as any)).toEqual(
			MOCK_METADATA_DEFAULT,
		);
	});

	it('should splice out unhandled key-value pairs', () => {
		const unhandled = parseDomainMetadata(MOCK_METADATA_UNHANDLED_VALUE as any);
		expect((unhandled as any).unhandledValue).toBeUndefined();
	});
});

/////////////////////
// f:: getMetadata //
/////////////////////

describe('getMetadata', () => {
	it('should call correct URL retrieve and parse metadata', async () => {
		jest.spyOn(global, 'fetch').mockReturnValue({
			json: () => Promise.resolve(MOCK_METADATA_WITH_TITLE),
		} as any);
		const metadata = await getMetadata('ipfs://Qmtejtei9t03u2st');
		expect(global.fetch).toHaveBeenCalledWith(
			DEFAULT_IPFS_GATEWAY + 'Qmtejtei9t03u2st',
		);
		expect(metadata).toEqual(MOCK_METADATA_DEFAULT);
	});
});
