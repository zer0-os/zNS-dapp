import { cleanup } from '@testing-library/react';
import { renderHook } from 'lib/testUtils';
import { useDomainSettingsBodyHandlers } from './useDomainSettingsBodyHandlers';
import {
	mockMetadata,
	mockLocalState,
	mockLocalActions,
	mockFormattedData,
} from './useDomainSettingsBodyData.test';
import {
	ERROR_KEYS,
	ERROR_TYPES,
	ERROR_MESSAGES,
} from '../DomainSettingsBody.constants';

const mockProps = {
	isLocked: true,
	metadata: mockMetadata,
	unavailableDomainNames: [] as string[],
	onShowLockedWarning: jest.fn(),
	onMetadataChange: jest.fn(),
};

const getHandlers = ({
	props = mockProps,
	localState = mockLocalState,
	localActions = mockLocalActions,
	formattedData = mockFormattedData,
} = {}) => {
	return renderHook(() =>
		useDomainSettingsBodyHandlers({
			props,
			localState,
			localActions,
			formattedData,
		}),
	);
};

describe('useDomainSettingsBodyHandlers', () => {
	beforeEach(() => {
		cleanup();
	});

	describe('handleBodyClicking', () => {
		it('should handle body clicking', async () => {
			const { handleBodyClicking } = getHandlers();

			handleBodyClicking();

			expect(mockProps.onShowLockedWarning).toHaveBeenCalledTimes(1);
		});
	});

	describe('handleDomainNameChange', () => {
		it('Should show name required error when the domain name input is empty', () => {
			const { handleDomainNameChange } = getHandlers({
				localState: {
					...mockLocalState,
					name: '',
				},
			});

			handleDomainNameChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.NAME]:
					ERROR_MESSAGES[ERROR_KEYS.NAME][ERROR_TYPES.REQUIRED],
			});
		});

		it('Should clear name required error when the domain name input is not empty', () => {
			const { handleDomainNameChange } = getHandlers({
				localState: {
					...mockLocalState,
					name: 'some other name change',
				},
			});

			handleDomainNameChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.NAME]: undefined,
			});
		});
	});

	describe('handleSubDomainNameChange', () => {
		it('Should show sub domain name required error when the sub domain name input is empty', () => {
			const { handleSubDomainNameChange } = getHandlers({
				localState: {
					...mockLocalState,
					domain: '',
				},
			});

			handleSubDomainNameChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.SUB_DOMAIN]:
					ERROR_MESSAGES[ERROR_KEYS.SUB_DOMAIN][ERROR_TYPES.REQUIRED],
			});
		});

		it('Should show redundant sub domain name error when the sub domain name input is duplicated', () => {
			const mockSubdomainName = 'mock-subdomain-name';
			const mockUnavailableDomainNames = [
				mockSubdomainName,
				'and-other-unavailable-names',
			];

			const { handleSubDomainNameChange } = getHandlers({
				props: {
					...mockProps,
					unavailableDomainNames: mockUnavailableDomainNames,
				},
				localState: {
					...mockLocalState,
					domain: mockSubdomainName,
				},
			});

			handleSubDomainNameChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.SUB_DOMAIN]:
					ERROR_MESSAGES[ERROR_KEYS.SUB_DOMAIN][ERROR_TYPES.DUPLICATED],
			});
		});

		it('Should show uppercase sub domain name error when the sub domain name input is lower case', () => {
			const mockSubdomainName = 'someuppercasE';

			const { handleSubDomainNameChange } = getHandlers({
				localState: {
					...mockLocalState,
					domain: mockSubdomainName,
				},
			});

			handleSubDomainNameChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.SUB_DOMAIN]:
					ERROR_MESSAGES[ERROR_KEYS.SUB_DOMAIN][ERROR_TYPES.LOWER_CASE],
			});
		});

		it('Should clear sub domain name required error when the sub domain name input is not empty', () => {
			const { handleSubDomainNameChange } = getHandlers({
				localState: {
					...mockLocalState,
					domain: 'some-other-sub-domain-name-change',
				},
			});

			handleSubDomainNameChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.SUB_DOMAIN]: undefined,
			});
		});
	});

	describe('handleStoryChange', () => {
		it('Should show story required error when the story input is empty', () => {
			const { handleStoryChange } = getHandlers({
				localState: {
					...mockLocalState,
					story: '',
				},
			});

			handleStoryChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.STORY]:
					ERROR_MESSAGES[ERROR_KEYS.STORY][ERROR_TYPES.REQUIRED],
			});
		});

		it('Should clear story required error when the story input is not empty', () => {
			const { handleStoryChange } = getHandlers({
				localState: {
					...mockLocalState,
					story: 'some other story change',
				},
			});

			handleStoryChange();

			expect(mockLocalActions.setErrors).toHaveBeenCalledTimes(1);
			expect(mockLocalActions.setErrors).toHaveBeenCalledWith({
				...mockLocalState.errors,
				[ERROR_KEYS.STORY]: undefined,
			});
		});
	});

	describe('handleMetadataChange', () => {
		it('Should handle metadata change when the inputs are good', () => {
			const localState = {
				...mockLocalState,
				name: 'metadata name',
				domain: 'metadata domain',
				story: 'metadata story',
				isMintable: true,
				isBiddable: true,
				gridViewByDefault: true,
				customDomainHeader: true,
			};
			const formattedData = {
				isChanged: true,
			};

			const { handleMetadataChange } = getHandlers({
				localState,
				formattedData,
			});

			handleMetadataChange();

			expect(mockProps.onMetadataChange).toHaveBeenCalledTimes(1);
			expect(mockProps.onMetadataChange).toHaveBeenCalledWith({
				...mockProps.metadata!,
				name: localState.name,
				domain: localState.domain,
				description: localState.story,
				isMintable: localState.isMintable,
				isBiddable: localState.isBiddable,
				gridViewByDefault: localState.gridViewByDefault,
				customDomainHeader: localState.customDomainHeader,
			});
		});
	});
});
