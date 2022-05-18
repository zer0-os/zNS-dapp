//-React Imports
import React, { useMemo } from 'react';

//- Library Improts
import { Maybe, DisplayDomain } from 'lib/types';
import classnames from 'classnames';

//-Component Imports
import {
	FutureButton,
	QuestionButton,
	Tooltip,
	IconButton,
	Member,
} from 'components';
import './_domain-settings-footer.scss';

//- Constants Imports
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
	DOMAIN_SETTINGS_WARNING_MESSAGES,
	DOMAIN_SETTINGS_SUCCESS_MESSAGES,
	DomainSettingsTooltipType,
	DOMAIN_SETTINGS_TOOLTIPS,
} from '../../DomainSettings.constants';

//- Assets Imports
import unlockIcon from './assets/unlock.svg';
import lockIcon from './assets/lock.svg';
import lockWarningIcon from './assets/lock-warning.svg';

type DomainSettingsFooterProps = {
	domain: Maybe<DisplayDomain>;
	isLocked: boolean;
	isChanged: boolean;
	isSaved: boolean;
	unlockable: boolean;
	warning: Maybe<DomainSettingsWarning>;
	success: Maybe<DomainSettingsSuccess>;
	onLock: () => void;
	onUnlock: () => void;
	onSaveWithoutLocking: () => void;
	onSaveAndLock: () => void;
	onFinish: () => void;
};

export const DomainSettingsFooter: React.FC<DomainSettingsFooterProps> = ({
	domain,
	isLocked,
	isChanged,
	isSaved,
	unlockable,
	warning,
	success,
	onLock,
	onUnlock,
	onSaveWithoutLocking,
	onSaveAndLock,
	onFinish,
}) => {
	const tooltipText = useMemo(() => {
		if (isLocked)
			return DOMAIN_SETTINGS_TOOLTIPS[DomainSettingsTooltipType.LOCKED];
		if (!isLocked && !isSaved)
			return DOMAIN_SETTINGS_TOOLTIPS[DomainSettingsTooltipType.UNLOCKED];
		if (!isLocked && isSaved)
			return DOMAIN_SETTINGS_TOOLTIPS[
				DomainSettingsTooltipType.SAVED_AND_UNLOCKED
			];

		return undefined;
	}, [isLocked, isSaved]);

	return (
		<div className="domain-settings-footer__container">
			<div className="domain-settings-footer__label">
				{warning && (
					<label
						className={classnames('warning', {
							is_locked_warning:
								warning === DomainSettingsWarning.LOCKED ||
								warning === DomainSettingsWarning.LOCKED_BY,
						})}
					>
						{DOMAIN_SETTINGS_WARNING_MESSAGES[warning]}
						{warning === DomainSettingsWarning.LOCKED_BY && domain ? (
							<Member id={domain?.lockedBy.id} />
						) : (
							''
						)}
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
					className="domain-settings-footer__buttons-icon lock--icon"
					iconUri={
						isLocked
							? warning === DomainSettingsWarning.LOCKED
								? lockWarningIcon
								: lockIcon
							: unlockIcon
					}
				/>
				{isLocked && !isSaved && (
					<FutureButton
						className=""
						onClick={onUnlock}
						disabled={!unlockable}
						glow={unlockable}
					>
						Unlock MetaData
					</FutureButton>
				)}
				{!isLocked && !isSaved && (
					<div className="domain-settings-footer__buttons-wrapper">
						<FutureButton
							className=""
							onClick={onSaveWithoutLocking}
							glow={isChanged}
							disabled={!isChanged}
						>
							Save Changes
						</FutureButton>
						<FutureButton className="" onClick={onSaveAndLock} glow>
							Save & Lock
						</FutureButton>
					</div>
				)}
				{!isLocked && isSaved && (
					<div className="domain-settings-footer__buttons-wrapper">
						<FutureButton className="" onClick={onLock} glow>
							Lock Metadata
						</FutureButton>
						<FutureButton className="" onClick={onFinish} glow>
							Finish
						</FutureButton>
					</div>
				)}
				{isLocked && isSaved && (
					<FutureButton className="" onClick={onFinish} glow>
						Finish
					</FutureButton>
				)}
				{tooltipText && (
					<Tooltip text={tooltipText}>
						<QuestionButton className="domain-settings-footer__buttons-icon" />
					</Tooltip>
				)}
			</div>
		</div>
	);
};
