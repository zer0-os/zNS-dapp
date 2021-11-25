import { useCallback } from 'react';
import { Maybe } from 'lib/types';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
} from '../DomainSettings.constants';

type UseDomainSettingsHandlersProps = {
	localState: {};
	localActions: {
		setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
		setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
		setWarning: React.Dispatch<
			React.SetStateAction<Maybe<DomainSettingsWarning>>
		>;
		setSuccess: React.Dispatch<
			React.SetStateAction<Maybe<DomainSettingsSuccess>>
		>;
	};
	modalsActions: {
		/* Unlock */
		handleUnlockModalConfirm: () => void;
		handleUnlockModalProcessing: () => void;
		handleUnlockModalClose: () => void;
		/* Lock */
		handleLockModalOpen: () => void;
		handleLockModalProcessing: () => void;
		handleLockModalClose: () => void;
		/* Save Without Locking */
		handleSaveWithoutLockingModalConfirm: () => void;
		handleSaveWithoutLockingModalProcessing: () => void;
		handleSaveWithoutLockingModalClose: () => void;
		/* Save Without Locking */
		handleSaveAndLockModalConfirm: () => void;
		handleSaveAndLockModalProcessing: () => void;
		handleSaveAndLockModalClose: () => void;
	};
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useDomainSettingsHandlers = ({
	localState,
	localActions,
	modalsActions,
}: UseDomainSettingsHandlersProps) => {
	const handleShowingLockedWarning = useCallback(() => {
		localActions.setWarning(DomainSettingsWarning.LOCKED);
	}, [localActions]);

	/* Unlock */
	const handleUnlock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleUnlockModalConfirm();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		modalsActions.handleUnlockModalProcessing();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		// Mock result with random boolean
		// Should be the result of API connection
		const mockSuccess = Math.random() < 0.9; // 90% probability of getting true

		if (!mockSuccess) {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsLocked(!mockSuccess);
		modalsActions.handleUnlockModalClose();
	}, [localActions, modalsActions]);

	/* Lock */
	const handleLock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleLockModalOpen();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		modalsActions.handleLockModalProcessing();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);
		console.log('here');

		// Mock result with random boolean
		// Should be the result of API connection
		const mockSuccess = Math.random() < 0.8; // 80% probability of getting true

		if (!mockSuccess) {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsLocked(mockSuccess);
		modalsActions.handleLockModalClose();
	}, [localActions, modalsActions]);

	/* Save Without Locking */
	const handleSaveWithoutLocking = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleSaveWithoutLockingModalConfirm();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		modalsActions.handleSaveWithoutLockingModalProcessing();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		// Mock result with random boolean
		// Should be the result of API connection
		const mockSuccess = Math.random() < 0.8; // 80% probability of getting true

		if (mockSuccess) {
			localActions.setSuccess(DomainSettingsSuccess.MEATA_DATA_SAVED);
		} else {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsSaved(mockSuccess);
		modalsActions.handleSaveWithoutLockingModalClose();
	}, [localActions, modalsActions]);

	/* Save And Lock */
	const handleSaveAndLock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleSaveAndLockModalConfirm();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		modalsActions.handleSaveAndLockModalProcessing();

		// Set loading for 5 seconds for now
		// Should be implemented with API
		await delay(5000);

		// Mock result with random boolean
		// Should be the result of API connection
		const mockSuccess = Math.random() < 0.8; // 80% probability of getting true

		if (mockSuccess) {
			localActions.setSuccess(
				DomainSettingsSuccess.MEATA_DATA_SAVED_AND_LOCKED,
			);
		} else {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsLocked(mockSuccess);
		localActions.setIsSaved(mockSuccess);
		modalsActions.handleSaveAndLockModalClose();
	}, [localActions, modalsActions]);

	/* Finish */
	const handleFinish = useCallback(() => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);
		localActions.setIsLocked(true);
		localActions.setIsSaved(false);
	}, [localActions]);

	return {
		handleShowingLockedWarning,
		handleUnlock,
		handleLock,
		handleSaveWithoutLocking,
		handleSaveAndLock,
		handleFinish,
	};
};
