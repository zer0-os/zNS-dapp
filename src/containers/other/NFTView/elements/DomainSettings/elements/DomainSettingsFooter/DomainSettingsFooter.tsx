import React from 'react';
import { FutureButton, QuestionButton, Tooltip, IconButton } from 'components';
import { Maybe } from 'lib/types';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
	DOMAIN_SETTINGS_WARNING_MESSAGES,
	DOMAIN_SETTINGS_SUCCESS_MESSAGES,
} from '../../DomainSettings.constants';
import unlockIcon from './assets/unlock.svg';
import lockIcon from './assets/lock.svg';
import './_domain-settings-footer.scss';

type DomainSettingsFooterProps = {
	isLocked: boolean;
	isSaved: boolean;
	warning: Maybe<DomainSettingsWarning>;
	success: Maybe<DomainSettingsSuccess>;
	onLock: () => void;
	onUnlock: () => void;
	onSaveWithoutLocking: () => void;
	onSaveAndLock: () => void;
	onFinish: () => void;
};

export const DomainSettingsFooter: React.FC<DomainSettingsFooterProps> = ({
	isLocked,
	isSaved,
	warning,
	success,
	onLock,
	onUnlock,
	onSaveWithoutLocking,
	onSaveAndLock,
	onFinish,
}) => {
	return (
		<div className="domain-settings-footer__container">
			<div className="domain-settings-footer__label">
				{warning && (
					<label className="warning">
						{DOMAIN_SETTINGS_WARNING_MESSAGES[warning]}
					</label>
				)}
				{success && (
					<label className="success">
						{DOMAIN_SETTINGS_SUCCESS_MESSAGES[success]}
					</label>
				)}
			</div>
			<div className="domain-settings-footer__buttons">
				<IconButton
					className="domain-settings-footer__buttons-icon"
					iconUri={isLocked ? lockIcon : unlockIcon}
				/>
				{isLocked && !isSaved && (
					<FutureButton className="" onClick={onUnlock} glow>
						Unlock MetaData
					</FutureButton>
				)}
				{!isLocked && !isSaved && (
					<>
						<FutureButton className="" onClick={onSaveWithoutLocking} glow>
							Save Changes
						</FutureButton>
						<FutureButton className="" onClick={onSaveAndLock} glow>
							Save & Lock
						</FutureButton>
					</>
				)}
				{!isLocked && isSaved && (
					<>
						<FutureButton className="" onClick={onLock} glow>
							Lock Metadata
						</FutureButton>
						<FutureButton className="" onClick={onFinish} glow>
							Finish
						</FutureButton>
					</>
				)}
				{isLocked && isSaved && (
					<FutureButton className="" onClick={onFinish} glow>
						Finish
					</FutureButton>
				)}
				<Tooltip text="This is long information to display on hover">
					<QuestionButton className="domain-settings-footer__buttons-icon" />
				</Tooltip>
			</div>
		</div>
	);
};
