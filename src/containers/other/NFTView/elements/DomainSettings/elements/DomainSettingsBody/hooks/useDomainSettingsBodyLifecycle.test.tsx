import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

jest.mock('lib/hooks/useUpdateEffect', () => ({
	useUpdateEffect: jest.fn(),
}));

const mockHandlers = {
	handleDomainNameChange: jest.fn(),
	handleSubDomainNameChange: jest.fn(),
	handleStoryChange: jest.fn(),
	handleCustomDomainHeaderTextChange: jest.fn(),
	handleMetadataChange: jest.fn(),
};

describe('useDomainSettingsBodyLifecycle', () => {
	describe('useUpdateEffect', () => {
		it('Should call useUpdateEffect with correct params', () => {
			useUpdateEffect(mockHandlers.handleDomainNameChange);
			useUpdateEffect(mockHandlers.handleSubDomainNameChange);
			useUpdateEffect(mockHandlers.handleStoryChange);
			useUpdateEffect(mockHandlers.handleCustomDomainHeaderTextChange);
			useUpdateEffect(mockHandlers.handleMetadataChange);

			expect(useUpdateEffect).toHaveBeenCalledWith(
				mockHandlers.handleDomainNameChange,
			);
			expect(useUpdateEffect).toHaveBeenCalledWith(
				mockHandlers.handleSubDomainNameChange,
			);
			expect(useUpdateEffect).toHaveBeenCalledWith(
				mockHandlers.handleStoryChange,
			);
			expect(useUpdateEffect).toHaveBeenCalledWith(
				mockHandlers.handleCustomDomainHeaderTextChange,
			);
			expect(useUpdateEffect).toHaveBeenCalledWith(
				mockHandlers.handleMetadataChange,
			);
		});
	});
});
