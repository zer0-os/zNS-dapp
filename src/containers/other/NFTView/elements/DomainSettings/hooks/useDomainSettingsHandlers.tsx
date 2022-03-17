import { useMemo, useCallback } from 'react';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { Maybe, Metadata } from 'lib/types';
import { Registrar } from 'types/Registrar';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
} from '../DomainSettings.constants';

type UseDomainSettingsHandlersProps = {
	props: {
		isZnsDomain: boolean;
		domainId: string;
		registrar: Registrar;
		onClose: () => void;
		setDomainMetadata: (v: Maybe<Metadata>) => void;
	};
	localState: {
		localMetadata: Maybe<DomainMetadata>;
	};
	localActions: {
		setMetadata: React.Dispatch<React.SetStateAction<Maybe<DomainMetadata>>>;
		setLocalMetadata: React.Dispatch<
			React.SetStateAction<Maybe<DomainMetadata>>
		>;
		setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
		setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
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
	localState,
	localActions,
	modalsActions,
}: UseDomainSettingsHandlersProps) => {
	/* SDK */
	const sdk = useZnsSdk();

	/* Iniital Actions */
	const handleCheckAndSetDomainMetadataLockStatus = useCallback(async () => {
		const { registrar, domainId } = props;

		const isDomainMetadataLocked = await registrar.isDomainMetadataLocked(
			domainId,
		);

		localActions.setIsLocked(isDomainMetadataLocked);
	}, [props, localActions]);

	/* Get Metadata */
	const handleFetchMetadata = useCallback(async () => {
		try {
			const metadata = await sdk.instance.getDomainMetadata(
				props.domainId,
				props.registrar.signer,
			);

			localActions.setMetadata(metadata);
			localActions.setLocalMetadata(metadata);
		} catch (e) {
			console.error('Fetched Metadata Errors = ', e);
		}
	}, [sdk, props, localActions]);

	/* Set Metadata (to write to navbar provider) */
	/* TODO:: This should be moved to redux later */
	const handleUpdatedMetadata = useCallback(async () => {
		if (props.isZnsDomain) {
			try {
				const updatedMetadata = await sdk.instance.getDomainMetadata(
					props.domainId,
					props.registrar.signer,
				);
				if (updatedMetadata) {
					props.setDomainMetadata({
						attributes: updatedMetadata.attributes,
						title: updatedMetadata.name || updatedMetadata.title,
						description: updatedMetadata.description,
						image: updatedMetadata.image,
						image_full: updatedMetadata.image_full,
						previewImage: updatedMetadata.previewImage,
						animation_url: updatedMetadata.animation_url,
						stakingRequests: updatedMetadata.stakingRequests,
						isBiddable: Boolean(updatedMetadata.isBiddable),
						isMintable: Boolean(updatedMetadata.isMintable),
						gridViewByDefault: Boolean(updatedMetadata.gridViewByDefault),
						customDomainHeader: Boolean(updatedMetadata.customDomainHeader),
						customDomainHeaderValue: updatedMetadata.customDomainHeaderValue,
					} as Metadata);
				}
			} catch (e) {
				console.error('Fetched Updated Metadata Errors = ', e);
			}
		}
	}, [sdk, props]);

	/* Local Actions */
	const handleShowingLockedWarning = useCallback(() => {
		localActions.setWarning(DomainSettingsWarning.LOCKED);
	}, [localActions]);

	const handleLocalMetadataChange = useCallback(
		(localMetadata: DomainMetadata) => {
			localActions.setIsChanged(true);
			localActions.setLocalMetadata(localMetadata);
		},
		[localActions],
	);

	/* Unlock */
	const handleUnlock = useCallback(async () => {
		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleUnlockModalConfirm();

		try {
			const tx = await sdk.instance.lockDomainMetadata(
				props.domainId,
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
				props.domainId,
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

		// scroll to top
		document.getElementById('domain_settings_body__wrapper')!.scrollTop = 0;
	}, [sdk, props, localActions, modalsActions]);

	/* Save Without Locking */
	const handleSaveWithoutLocking = useCallback(async () => {
		if (!localState.localMetadata) {
			return;
		}

		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleSaveWithoutLockingModalConfirm();

		try {
			const tx = await sdk.instance.setDomainMetadata(
				props.domainId,
				localState.localMetadata,
				props.registrar.signer,
			);

			try {
				modalsActions.handleSaveWithoutLockingModalProcessing();

				await tx.wait();

				await handleUpdatedMetadata();

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

		// scroll to top
		document.getElementById('domain_settings_body__wrapper')!.scrollTop = 0;
	}, [
		sdk,
		props,
		localState,
		localActions,
		modalsActions,
		handleUpdatedMetadata,
	]);

	/* Save And Lock */
	const handleSaveAndLock = useCallback(async () => {
		if (!localState.localMetadata) {
			return;
		}

		localActions.setWarning(undefined);
		localActions.setSuccess(undefined);

		modalsActions.handleSaveAndLockModalConfirm();

		try {
			const tx = await sdk.instance.setAndLockDomainMetadata(
				props.domainId,
				localState.localMetadata,
				props.registrar.signer,
			);

			try {
				modalsActions.handleSaveAndLockModalProcessing();

				await tx.wait();

				await handleUpdatedMetadata();

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

		// scroll to top
		document.getElementById('domain_settings_body__wrapper')!.scrollTop = 0;
	}, [
		sdk,
		props,
		localState,
		localActions,
		modalsActions,
		handleUpdatedMetadata,
	]);

	/* Finish */
	const handleFinish = useCallback(() => {
		props.onClose();
	}, [props]);

	return useMemo(
		() => ({
			handleFetchMetadata,
			handleLocalMetadataChange,
			handleCheckAndSetDomainMetadataLockStatus,
			handleShowingLockedWarning,
			handleUnlock,
			handleLock,
			handleSaveWithoutLocking,
			handleSaveAndLock,
			handleFinish,
		}),
		[
			handleFetchMetadata,
			handleLocalMetadataChange,
			handleCheckAndSetDomainMetadataLockStatus,
			handleShowingLockedWarning,
			handleUnlock,
			handleLock,
			handleSaveWithoutLocking,
			handleSaveAndLock,
			handleFinish,
		],
	);
};
