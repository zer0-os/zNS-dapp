import { useCallback } from 'react';
import { DisplayParentDomain, Maybe } from 'lib/types';
import { Registrar } from 'types/Registrar';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
} from '../DomainSettings.constants';

type UseDomainSettingsHandlersProps = {
	props: {
		domain: DisplayParentDomain;
		registrar: Registrar;
	};
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

export const useDomainSettingsHandlers = ({
	props,
	localActions,
	modalsActions,
}: UseDomainSettingsHandlersProps) => {
	/* SDK */
	const sdk = useZnsSdk();

	/* Iniital Actions */
	const handleCheckAndSetDomainMetadataLockStatus = useCallback(async () => {
		const { registrar, domain } = props;

		const isDomainMetadataLocked = await registrar.isDomainMetadataLocked(
			domain.id,
		);

		localActions.setIsLocked(isDomainMetadataLocked);
	}, [props, localActions]);

	/* Local Actions */
	const handleShowingLockedWarning = useCallback(() => {
		localActions.setWarning(DomainSettingsWarning.LOCKED);
	}, [localActions]);

	/* Unlock */
	const handleUnlock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleUnlockModalConfirm();

		try {
			const tx = await sdk.instance.lockDomainMetadata(
				props.domain.id,
				false,
				props.registrar.signer,
			);

			try {
				modalsActions.handleUnlockModalProcessing();

				await tx.wait();

				localActions.setIsLocked(false);
			} catch (e) {
				console.error(e);
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_FAILED);

				localActions.setIsLocked(true);
				return;
			}
		} catch (e) {
			console.log(e);

			if (e.code === 4001) {
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
				localActions.setIsLocked(true);
			}
		}

		modalsActions.handleUnlockModalClose();
	}, [sdk, props, localActions, modalsActions]);

	/* Lock */
	const handleLock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleLockModalOpen();

		try {
			const tx = await sdk.instance.lockDomainMetadata(
				props.domain.id,
				true,
				props.registrar.signer,
			);

			try {
				modalsActions.handleLockModalProcessing();

				await tx.wait();

				localActions.setIsLocked(true);
			} catch (e) {
				console.error(e);
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_FAILED);
				localActions.setIsLocked(false);
			}
		} catch (e) {
			console.log(e);

			if (e.code === 4001) {
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
				localActions.setIsLocked(false);
			}
		}

		modalsActions.handleLockModalClose();
	}, [sdk, props, localActions, modalsActions]);

	/* Save Without Locking */
	const handleSaveWithoutLocking = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleSaveWithoutLockingModalConfirm();

		try {
			const tx = await sdk.instance.setDomainMetadata(
				props.domain.id,
				props.domain.metadata,
				props.registrar.signer,
			);

			try {
				modalsActions.handleSaveWithoutLockingModalProcessing();

				await tx.wait();

				localActions.setSuccess(DomainSettingsSuccess.MEATA_DATA_SAVED);

				localActions.setIsSaved(true);
			} catch (e) {
				console.error(e);
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_FAILED);
				localActions.setIsSaved(false);
			}
		} catch (e) {
			console.log(e);

			if (e.code === 4001) {
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
				localActions.setIsSaved(false);
			}
		}

		modalsActions.handleSaveWithoutLockingModalClose();
	}, [sdk, props, localActions, modalsActions]);

	/* Save And Lock */
	const handleSaveAndLock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleSaveAndLockModalConfirm();

		try {
			const tx = await sdk.instance.setAndLockMetadata(
				props.domain.id,
				props.domain.metadata,
				props.registrar.signer,
			);

			try {
				modalsActions.handleSaveAndLockModalProcessing();

				await tx.wait();

				localActions.setSuccess(
					DomainSettingsSuccess.MEATA_DATA_SAVED_AND_LOCKED,
				);

				localActions.setIsSaved(true);
			} catch (e) {
				console.error(e);
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_FAILED);
				localActions.setIsSaved(false);
			}
		} catch (e) {
			console.log(e);

			if (e.code === 4001) {
				localActions.setWarning(DomainSettingsWarning.TRANSACTION_DENIED);
				localActions.setIsSaved(false);
			}
		}

		localActions.setIsLocked(true);
		modalsActions.handleSaveAndLockModalClose();
	}, [sdk, props, localActions, modalsActions]);

	/* Finish */
	const handleFinish = useCallback(() => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);
		localActions.setIsLocked(true);
		localActions.setIsSaved(false);
	}, [localActions]);

	return {
		handleCheckAndSetDomainMetadataLockStatus,
		handleShowingLockedWarning,
		handleUnlock,
		handleLock,
		handleSaveWithoutLocking,
		handleSaveAndLock,
		handleFinish,
	};
};
