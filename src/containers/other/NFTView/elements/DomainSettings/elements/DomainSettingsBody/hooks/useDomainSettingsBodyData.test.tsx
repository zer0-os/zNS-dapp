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
};

describe('useDomainSettingsBodyData', () => {
	it('should return the expected data', () => {
		const { localState, localActions } = renderHook(() =>
			useDomainSettingsBodyData(mocCurrentDomain, mockMetadata),
		);

		expect(localState).toEqual(mockLocalState);

		Object.entries(localActions).forEach(([localActionName, localAction]) => {
			expect(localActionName in mockLocalActions).toBe(true);
			expect(typeof localAction).toBe('function');
		});
	});
});
