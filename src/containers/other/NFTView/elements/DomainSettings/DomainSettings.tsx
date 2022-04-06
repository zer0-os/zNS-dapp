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
	useDomainSettingsLifecycle,
} from './hooks';
import './_domain-settings.scss';

export type DomainSettingsProps = {
	domainId: string;
	onClose: () => void;
};

const DomainSettings: React.FC<DomainSettingsProps> = ({
	domainId,
	onClose,
}) => {
	const {
		localState,
		localActions,
		formattedData,
		library,
		setDomainMetadata,
	} = useDomainSettingsData(domainId);
	const { modalsState, modalsActions } = useDomainSettingsModals();
	const handlers = useDomainSettingsHandlers({
		props: {
			isZnsDomain: formattedData.isZnsDomain,
			domainId,
			library,
			onClose,
			setDomainMetadata,
		},
		localState,
		localActions,
		modalsActions,
	});

	useDomainSettingsLifecycle({
		props: {
			domain: formattedData.myDomain.domain!,
			library,
		},
		handlers,
	});

	return (
		<Overlay
			classNames="domain-settings__overlay"
			open
			hasCloseButton={false}
			onClose={onClose}
		>
			<div className="domain-settings__disable-outside-clicks">
				<div className="domain-settings__modal blur border-rounded border-primary">
					{/* Header */}
					<DomainSettingsHeader
						domainUri={formattedData.domainUri}
						onClose={onClose}
					/>
					{/* Body */}
					<DomainSettingsBody
						domain={formattedData.myDomain.domain}
						metadata={localState.metadata}
						unavailableDomainNames={formattedData.unavailableDomainNames}
						isLocked={localState.isLocked}
						onShowLockedWarning={handlers.handleShowingLockedWarning}
						onMetadataChange={handlers.handleLocalMetadataChange}
					/>
					{/* Footer */}
					<DomainSettingsFooter
						isLocked={localState.isLocked}
						isChanged={localState.isChanged}
						isSaved={localState.isSaved}
						unlockable={formattedData.unlockable}
						warning={localState.warning}
						success={localState.success}
						onLock={handlers.handleLock}
						onUnlock={modalsActions.handleUnlockModalOpen}
						onSaveWithoutLocking={
							modalsActions.handleSaveWithoutLockingModalOpen
						}
						onSaveAndLock={modalsActions.handleSaveAndLockModalOpen}
						onFinish={handlers.handleFinish}
					/>
					{/* Modals */}
					<DomainSettingsModal
						{...modalsState.unlockModal}
						onConfirm={handlers.handleUnlock}
						onCancel={modalsActions.handleUnlockModalClose}
					/>
					<DomainSettingsModal
						{...modalsState.lockModal}
						onConfirm={handlers.handleLock}
						onCancel={modalsActions.handleLockModalClose}
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
			</div>
		</Overlay>
	);
};

export default DomainSettings;
