import React from 'react';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { DisplayDomain, Maybe } from 'lib/types';
import {
	NFTMedia,
	TextInputWithTopPlaceHolder,
	ToggleSwitch,
	Tooltip,
	QuestionButton,
} from 'components';
import {
	useDomainSettingsBodyData,
	useDomainSettingsBodyHandlers,
	useDomainSettingsBodyLifecycle,
} from './hooks';
import { ERROR_KEYS } from './DomainSettingsBody.constants';
import {
	DomainSettingsTooltipType,
	DOMAIN_SETTINGS_TOOLTIPS,
} from '../../DomainSettings.constants';
import './_domain-settings-body.scss';

type DomainSettingsBodyProps = {
	domain: Maybe<DisplayDomain>;
	metadata: Maybe<DomainMetadata>;
	unavailableDomainNames: string[];
	isLocked: boolean;
	onShowLockedWarning: () => void;
	onMetadataChange: (metadata: DomainMetadata) => void;
};

export const DomainSettingsBody: React.FC<DomainSettingsBodyProps> = ({
	domain,
	metadata,
	unavailableDomainNames,
	isLocked,
	onShowLockedWarning,
	onMetadataChange,
}) => {
	const { localState, localActions, formattedData } = useDomainSettingsBodyData(
		domain,
		metadata,
	);

	const handlers = useDomainSettingsBodyHandlers({
		props: {
			isLocked,
			metadata,
			unavailableDomainNames,
			onShowLockedWarning,
			onMetadataChange,
		},
		localState,
		localActions,
		formattedData,
	});

	useDomainSettingsBodyLifecycle({
		localState,
		handlers,
	});

	return (
		<div
			className={`domain-settings-body__container ${isLocked && 'locked'}`}
			id="domain_settings_body__wrapper"
		>
			<div className="domain-settings-body__top">
				{/* Domain Media Section */}
				<div className="domain-settings-body__top--left border-blue">
					<NFTMedia
						className="domain-media-wrapper"
						style={{
							objectFit: 'contain',
						}}
						alt="NFT Preview"
						ipfsUrl={metadata?.image || ''}
						size="large"
					/>
				</div>

				{/* Domain Title & Domain Section */}
				<div className="domain-settings-body__top--right">
					<TextInputWithTopPlaceHolder
						topPlaceholder={'Title'}
						onChange={localActions.setName}
						text={localState.name || ''}
						error={!!localState.errors[ERROR_KEYS.NAME]}
						errorText={localState.errors[ERROR_KEYS.NAME]}
					/>
					<TextInputWithTopPlaceHolder
						topPlaceholder={'Subdomain Name'}
						onChange={localActions.setDomain}
						text={localState.domain}
						error={!!localState.errors[ERROR_KEYS.SUB_DOMAIN]}
						errorText={localState.errors[ERROR_KEYS.SUB_DOMAIN]}
						disabled
					/>
				</div>
			</div>
			<div className="domain-settings-body__center">
				<TextInputWithTopPlaceHolder
					autosize
					multiline
					topPlaceholder={'Story (400 characters max)'}
					onChange={localActions.setStory}
					text={localState.story || ''}
					error={!!localState.errors[ERROR_KEYS.STORY]}
					errorText={localState.errors[ERROR_KEYS.STORY]}
				/>
			</div>
			<div className="domain-settings-body__footer">
				<h3>Advanced Domain Settings</h3>

				{/* Domain Mint Request Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.isMintable}
							onChange={localActions.setIsMintable}
						/>
						<label>Domain Mint Requests</label>
						<Tooltip
							text={
								DOMAIN_SETTINGS_TOOLTIPS[
									DomainSettingsTooltipType.SETTINGS_MINT_REQUEST
								]
							}
						>
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>

				{/* Domain Bidding Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.isBiddable}
							onChange={localActions.setIsBiddable}
						/>
						<label>Domain Bidding</label>
						<Tooltip
							text={
								DOMAIN_SETTINGS_TOOLTIPS[
									DomainSettingsTooltipType.UNLSETTINGS_BIDDING
								]
							}
						>
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>

				{/* Grid View By Default Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.gridViewByDefault}
							onChange={localActions.setGridViewByDefault}
						/>
						<label>Display Domain in Grid View by Default</label>
						<Tooltip
							text={
								DOMAIN_SETTINGS_TOOLTIPS[
									DomainSettingsTooltipType.SETTINGS_GRID_VIEW_DEFAULT
								]
							}
						>
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>

				{/* Custom Domain Header Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.customDomainHeader}
							onChange={localActions.setCustomDomainHeader}
						/>
						<label>Custom Domain Header</label>
						<Tooltip
							text={
								DOMAIN_SETTINGS_TOOLTIPS[
									DomainSettingsTooltipType.SETTINGS_CUSTOM_DOMAIN_HEADER
								]
							}
						>
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>
			</div>

			{isLocked && (
				<div
					className="domain-settings-body__blocked"
					onClick={handlers.handleBodyClicking}
				/>
			)}
		</div>
	);
};
