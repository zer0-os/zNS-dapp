import React from 'react';
import {
	Overlay,
	IconButton,
	FutureButton,
	LoadingIndicator,
} from 'components';
import {
	DomainSettingsModalType,
	DomainSettingsModalStatus,
	DOMAIN_SETTINGS_MODALS,
} from '../../DomainSettings.constants';
import closeIcon from './assets/close-icon.svg';
import './_domain-settings-modal.scss';

type DomainSettingsModalProps = {
	type: DomainSettingsModalType;
	status: DomainSettingsModalStatus;
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

export const DomainSettingsModal: React.FC<DomainSettingsModalProps> = ({
	type,
	status,
	isOpen,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) {
		return null;
	}

	const modalOptions = DOMAIN_SETTINGS_MODALS[type];

	return (
		<Overlay
			classNames="domain-settings-modal__overlay"
			centered
			open={isOpen}
			hasCloseButton={false}
			onClose={onCancel}
		>
			<div className="domain-settings-modal__modal blur border-rounded border-primary">
				{/* Header */}
				<div className="domain-settings-modal__modal-header">
					<h1 className="glow-text-white">{modalOptions.title}</h1>
					<IconButton
						className="domain-settings-modal__modal-header--close-icon"
						onClick={onCancel}
						iconUri={closeIcon}
					/>
				</div>
				{/* Body */}
				<div className="domain-settings-modal__modal-body">
					{modalOptions.description[status] && (
						<label>{modalOptions.description[status]}</label>
					)}
					{status !== DomainSettingsModalStatus.NORMAL && (
						<LoadingIndicator style={{ marginTop: 24 }} text="" />
					)}
				</div>
				{/* Footer */}
				{status === DomainSettingsModalStatus.NORMAL && (
					<div className="domain-settings-modal__modal-footer">
						{modalOptions.buttons?.cancel && (
							<FutureButton className="cancel-btn" onClick={onCancel} glow>
								{modalOptions.buttons?.cancel}
							</FutureButton>
						)}
						{modalOptions.buttons?.confirm && (
							<FutureButton className="confirm-btn" onClick={onConfirm} glow>
								{modalOptions.buttons?.confirm}
							</FutureButton>
						)}
					</div>
				)}
			</div>
		</Overlay>
	);
};
