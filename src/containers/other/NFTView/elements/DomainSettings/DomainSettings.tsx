import React from 'react';
import { Overlay } from 'components';
import {
	DomainSettingsHeader,
	DomainSettingsBody,
	DomainSettingsFooter,
	DomainSettingsModal,
} from './elements';
import {
	useDomainSettingsData,
	useDomainSettingsModals,
	useDomainSettingsHandlers,
} from './hooks';
import './_domain-settings.scss';

type DomainSettingsProps = {
	domainId: string;
	onClose: () => void;
};

const DomainSettings: React.FC<DomainSettingsProps> = ({
	domainId,
	onClose,
}) => {
	const { localState, localActions, formattedData } =
		useDomainSettingsData(domainId);
	const { modalsState, modalsActions } = useDomainSettingsModals();
	const handlers = useDomainSettingsHandlers({
		localState,
		localActions,
		modalsActions,
	});

	return (
		<Overlay
			classNames="domain-settings__overlay"
			open
			hasCloseButton={false}
			onClose={onClose}
		>
			<div className="domain-settings__modal blur border-rounded border-primary">
				{/* Header */}
				<DomainSettingsHeader
					domainUri={formattedData.domainUri}
					onClose={onClose}
				/>
				{/* Body */}
				{formattedData.myDomain.domain?.title && (
					<DomainSettingsBody
						domain={formattedData.myDomain.domain}
						unavailableDomainNames={formattedData.unavailableDomainNames}
						isLocked={localState.isLocked}
						onShowLockedWarning={handlers.handleShowingLockedWarning}
					/>
				)}
				{/* Footer */}
				<DomainSettingsFooter
					isLocked={localState.isLocked}
					warning={localState.warning}
					success={localState.success}
					onUnlock={modalsActions.handleUnlockModalOpen}
					onSaveWithoutLocking={modalsActions.handleSaveWithoutLockingModalOpen}
					onSaveAndLock={modalsActions.handleSaveAndLockModalOpen}
				/>
				{/* Modals */}
				<DomainSettingsModal
					{...modalsState.unlockModal}
					onConfirm={handlers.handleUnlock}
					onCancel={modalsActions.handleUnlockModalClose}
				/>
				<DomainSettingsModal
					{...modalsState.saveWithoutLockingModal}
					onConfirm={handlers.handleSaveWithoutLocking}
					onCancel={modalsActions.handleSaveWithoutLockingModalClose}
				/>
				<DomainSettingsModal
					{...modalsState.saveAndLockModal}
					onConfirm={handlers.handleSaveAndLock}
					onCancel={modalsActions.handleSaveAndLockModalClose}
				/>
			</div>
		</Overlay>
	);
};

export default DomainSettings;
