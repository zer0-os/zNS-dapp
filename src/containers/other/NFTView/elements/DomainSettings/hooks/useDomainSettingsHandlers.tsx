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
		const success = Math.random() < 0.8; // 80% probability of getting true

		if (!success) {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsLocked(!success);
		modalsActions.handleUnlockModalClose();
	}, [localActions, modalsActions]);

	/* Save Without Locking */
	const handleSaveWithoutLocking = useCallback(async () => {
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
		const success = Math.random() < 0.8; // 80% probability of getting true

		if (!success) {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsSaved(success);
		modalsActions.handleSaveWithoutLockingModalClose();
	}, [localActions, modalsActions]);

	/* Save And Lock */
	const handleSaveAndLock = useCallback(async () => {
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
		const success = Math.random() < 0.8; // 80% probability of getting true

		if (!success) {
			localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
		}

		localActions.setIsLocked(success);
		localActions.setIsSaved(success);
		modalsActions.handleSaveAndLockModalClose();
	}, [localActions, modalsActions]);

	return {
		handleShowingLockedWarning,
		handleUnlock,
		handleSaveWithoutLocking,
		handleSaveAndLock,
	};
};
