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
	DOMAIN_SETTINGS_UNLOCKABLE_PROMPT,
	DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS,
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
							is_locked_warning: warning === DomainSettingsWarning.LOCKED,
						})}
					>
						{DOMAIN_SETTINGS_WARNING_MESSAGES[warning]}
					</label>
				)}
				{isLocked && domain && !unlockable && (
					<label
						className={classnames('warning', {
							is_locked_warning: !unlockable,
						})}
					>
						{DOMAIN_SETTINGS_UNLOCKABLE_PROMPT}
						<Member id={domain?.lockedBy.id} />
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
						{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.UNLOCK_METADATA}
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
							{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.SAVE_CHANGES}
						</FutureButton>
						<FutureButton className="" onClick={onSaveAndLock} glow>
							{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.SAVE_AND_LOCK}
						</FutureButton>
					</div>
				)}
				{!isLocked && isSaved && (
					<div className="domain-settings-footer__buttons-wrapper">
						<FutureButton className="" onClick={onLock} glow>
							{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.LOCK_METADATA}
						</FutureButton>
						<FutureButton className="" onClick={onFinish} glow>
							{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.FINISH}
						</FutureButton>
					</div>
				)}
				{isLocked &&
					isSaved &&
					(!warning ? (
						<FutureButton className="" onClick={onFinish} glow>
							{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.FINISH}
						</FutureButton>
					) : (
						<FutureButton
							className=""
							onClick={onUnlock}
							disabled={!unlockable}
							glow={unlockable}
						>
							{DOMAIN_SETTINGS_INITIAL_BUTTON_LABELS.UNLOCK_METADATA}
						</FutureButton>
					))}
				{tooltipText && (
					<Tooltip text={tooltipText}>
						<QuestionButton className="domain-settings-footer__buttons-icon" />
					</Tooltip>
				)}
			</div>
		</div>
	);
};
