import { renderHook } from 'lib/testUtils';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { DisplayDomain, Maybe } from 'lib/types';
import { useDomainSettingsBodyData } from './useDomainSettingsBodyData';

const mocCurrentDomain: Maybe<DisplayDomain> = undefined;

export const mockMetadata: Maybe<DomainMetadata> = {
	name: 'mock metadata name',
	domain: 'mock-metadata-domain',
	description: 'mock metadata description',
	image: '',
	animation_url: '',
	stakingRequests: undefined,
	isBiddable: true,
	gridViewByDefault: true,
	customDomainHeader: false,
	customDomainHeaderValue: '',
};

export const mockLocalState = {
	name: mockMetadata.name,
	domain: mockMetadata.domain as string,
	story: mockMetadata.description,
	errors: {},
	isMintable: Boolean(mockMetadata.isMintable),
	isBiddable: Boolean(mockMetadata.isBiddable),
	gridViewByDefault: Boolean(mockMetadata.gridViewByDefault),
	customDomainHeader: Boolean(mockMetadata.customDomainHeader),
	customDomainHeaderValue: String(mockMetadata.customDomainHeaderValue),
};

export const mockLocalActions = {
	setName: jest.fn(),
	setDomain: jest.fn(),
	setStory: jest.fn(),
	setErrors: jest.fn(),
	setIsMintable: jest.fn(),
	setIsBiddable: jest.fn(),
	setGridViewByDefault: jest.fn(),
	setCustomDomainHeader: jest.fn(),
	setCustomDomainHeaderValue: jest.fn(),
};

export const mockFormattedData = {
	isChanged: false,
};

describe('useDomainSettingsBodyData', () => {
	it('should return the expected data', () => {
		const { localState, localActions, formattedData } = renderHook(() =>
			useDomainSettingsBodyData(mocCurrentDomain, mockMetadata),
		);

		expect(localState).toEqual(mockLocalState);
		expect(formattedData).toEqual(mockFormattedData);

		Object.entries(localActions).forEach(([localActionName, localAction]) => {
			expect(localActionName in mockLocalActions).toBe(true);
			expect(typeof localAction).toBe('function');
		});
	});
});
