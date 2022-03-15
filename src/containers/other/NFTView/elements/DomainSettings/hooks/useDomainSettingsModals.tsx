import { useState, useMemo, useCallback } from 'react';
import {
	DomainSettingsModalType,
	DomainSettingsModalStatus,
} from '../DomainSettings.constants';

type DomainSettingsModalState = {
	type: DomainSettingsModalType;
	isOpen: boolean;
	status: DomainSettingsModalStatus;
};

const initialLockModalState: DomainSettingsModalState = {
	type: DomainSettingsModalType.LOCK,
	isOpen: false,
	status: DomainSettingsModalStatus.WALLET_CONFIRMATION,
};
const initialUnlockModalState: DomainSettingsModalState = {
	type: DomainSettingsModalType.UNLOCK,
	isOpen: false,
	status: DomainSettingsModalStatus.NORMAL,
};
const initialSaveWithoutLockingModal: DomainSettingsModalState = {
	type: DomainSettingsModalType.SAVE_WITHOUT_LOCKING,
	isOpen: false,
	status: DomainSettingsModalStatus.NORMAL,
};
const initialSaveAndLockModal: DomainSettingsModalState = {
	type: DomainSettingsModalType.SAVE_AND_LOCK,
	isOpen: false,
	status: DomainSettingsModalStatus.NORMAL,
};

export const useDomainSettingsModals = () => {
	const [lockModal, setLockModal] = useState<DomainSettingsModalState>(
		initialLockModalState,
	);
	const [unlockModal, setUnlockModal] = useState<DomainSettingsModalState>(
		initialUnlockModalState,
	);
	const [saveWithoutLockingModal, setSaveWithoutLockingModal] =
		useState<DomainSettingsModalState>(initialSaveWithoutLockingModal);
	const [saveAndLockModal, setSaveAndLockModal] =
		useState<DomainSettingsModalState>(initialSaveAndLockModal);

	/**
	 *  Lock Modal Handlers
	 */
	const handleLockModalOpen = useCallback(() => {
		setLockModal({
			...initialLockModalState,
			isOpen: true,
		});
	}, []);

	const handleLockModalProcessing = useCallback(() => {
		setLockModal({
			...initialLockModalState,
			isOpen: true,
			status: DomainSettingsModalStatus.PROCESSING,
		});
	}, []);

	const handleLockModalClose = useCallback(() => {
		setLockModal(initialLockModalState);
	}, []);

	/**
	 *  Unlock Modal Handlers
	 */

	const handleUnlockModalOpen = useCallback(() => {
		setUnlockModal({
			...initialUnlockModalState,
			isOpen: true,
		});
	}, []);

	const handleUnlockModalConfirm = useCallback(() => {
		setUnlockModal({
			...initialUnlockModalState,
			isOpen: true,
			status: DomainSettingsModalStatus.WALLET_CONFIRMATION,
		});
	}, []);

	const handleUnlockModalProcessing = useCallback(() => {
		setUnlockModal({
			...initialUnlockModalState,
			isOpen: true,
			status: DomainSettingsModalStatus.PROCESSING,
		});
	}, []);

	const handleUnlockModalClose = useCallback(() => {
		setUnlockModal(initialUnlockModalState);
	}, []);

	/**
	 *  Save Without Locking Modal Handlers
	 */

	const handleSaveWithoutLockingModalOpen = useCallback(() => {
		setSaveWithoutLockingModal({
			...initialSaveWithoutLockingModal,
			isOpen: true,
		});
	}, []);

	const handleSaveWithoutLockingModalConfirm = useCallback(() => {
		setSaveWithoutLockingModal({
			...initialSaveWithoutLockingModal,
			isOpen: true,
			status: DomainSettingsModalStatus.WALLET_CONFIRMATION,
		});
	}, []);

	const handleSaveWithoutLockingModalProcessing = useCallback(() => {
		setSaveWithoutLockingModal({
			...initialSaveWithoutLockingModal,
			isOpen: true,
			status: DomainSettingsModalStatus.PROCESSING,
		});
	}, []);

	const handleSaveWithoutLockingModalClose = useCallback(() => {
		setSaveWithoutLockingModal(initialSaveWithoutLockingModal);
	}, []);

	/**
	 *  Save Without Locking Modal Handlers
	 */

	const handleSaveAndLockModalOpen = useCallback(() => {
		setSaveAndLockModal({
			...initialSaveAndLockModal,
			isOpen: true,
		});
	}, []);

	const handleSaveAndLockModalConfirm = useCallback(() => {
		setSaveAndLockModal({
			...initialSaveAndLockModal,
			isOpen: true,
			status: DomainSettingsModalStatus.WALLET_CONFIRMATION,
		});
	}, []);

	const handleSaveAndLockModalProcessing = useCallback(() => {
		setSaveAndLockModal({
			...initialSaveAndLockModal,
			isOpen: true,
			status: DomainSettingsModalStatus.PROCESSING,
		});
	}, []);

	const handleSaveAndLockModalClose = useCallback(() => {
		setSaveAndLockModal(initialSaveAndLockModal);
	}, []);

	const modalsActions = useMemo(() => {
		return {
			/* Lock */
			handleLockModalOpen,
			handleLockModalProcessing,
			handleLockModalClose,
			/* Unlock */
			handleUnlockModalOpen,
			handleUnlockModalConfirm,
			handleUnlockModalProcessing,
			handleUnlockModalClose,
			/* Save Without Locking */
			handleSaveWithoutLockingModalOpen,
			handleSaveWithoutLockingModalConfirm,
			handleSaveWithoutLockingModalProcessing,
			handleSaveWithoutLockingModalClose,
			/* Save And Lock */
			handleSaveAndLockModalOpen,
			handleSaveAndLockModalConfirm,
			handleSaveAndLockModalProcessing,
			handleSaveAndLockModalClose,
		};
	}, [
		handleLockModalOpen,
		handleLockModalProcessing,
		handleLockModalClose,
		handleUnlockModalOpen,
		handleUnlockModalConfirm,
		handleUnlockModalProcessing,
		handleUnlockModalClose,
		handleSaveWithoutLockingModalOpen,
		handleSaveWithoutLockingModalConfirm,
		handleSaveWithoutLockingModalProcessing,
		handleSaveWithoutLockingModalClose,
		handleSaveAndLockModalOpen,
		handleSaveAndLockModalConfirm,
		handleSaveAndLockModalProcessing,
		handleSaveAndLockModalClose,
	]);

	return {
		modalsState: {
			lockModal,
			unlockModal,
			saveWithoutLockingModal,
			saveAndLockModal,
		},
		modalsActions,
	};
};
