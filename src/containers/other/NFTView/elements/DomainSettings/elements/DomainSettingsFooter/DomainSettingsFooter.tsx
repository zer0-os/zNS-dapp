import React from 'react';
import { FutureButton, QuestionButton, Tooltip, IconButton } from 'components';
import { Maybe } from 'lib/types';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
	DOMAIN_SETTINGS_WARNING_MESSAGES,
} from '../../DomainSettings.constants';
import unlockIcon from './assets/unlock.svg';
import lockIcon from './assets/lock.svg';
import './_domain-settings-footer.scss';

type DomainSettingsFooterProps = {
	isLocked: boolean;
	warning: Maybe<DomainSettingsWarning>;
	success: Maybe<DomainSettingsSuccess>;
	onUnlock: () => void;
	onSaveWithoutLocking: () => void;
	onSaveAndLock: () => void;
};

export const DomainSettingsFooter: React.FC<DomainSettingsFooterProps> = ({
	isLocked,
	warning,
	success,
	onUnlock,
	onSaveWithoutLocking,
	onSaveAndLock,
}) => {
	return (
		<div className="domain-settings-footer__container">
			<div className="domain-settings-footer__label">
				{warning && (
					<label className="warning">
						{DOMAIN_SETTINGS_WARNING_MESSAGES[warning]}
					</label>
				)}
			</div>
			<div className="domain-settings-footer__buttons">
				<IconButton
					className="domain-settings-footer__buttons-icon"
					iconUri={isLocked ? lockIcon : unlockIcon}
				/>
				{isLocked && (
					<FutureButton className="" onClick={onUnlock} glow>
						Unlock MetaData
					</FutureButton>
				)}
				{!isLocked && (
					<>
						<FutureButton className="" onClick={onSaveWithoutLocking} glow>
							Save Changes
						</FutureButton>
						<FutureButton className="" onClick={onSaveAndLock} glow>
							Save & Lock
						</FutureButton>
					</>
				)}
				<Tooltip text="This is long information to display on hover">
					<QuestionButton className="domain-settings-footer__buttons-icon" />
				</Tooltip>
			</div>
		</div>
	);
};
