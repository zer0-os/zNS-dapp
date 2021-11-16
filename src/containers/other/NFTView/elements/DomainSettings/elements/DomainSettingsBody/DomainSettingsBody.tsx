import React from 'react';
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
} from './hooks';
import './_domain-settings-body.scss';

type DomainSettingsBodyProps = {
	domain: Maybe<DisplayDomain>;
	unavailableDomainNames: string[];
	isLocked: boolean;
	onShowLockedWarning: () => void;
};

export const DomainSettingsBody: React.FC<DomainSettingsBodyProps> = ({
	domain,
	unavailableDomainNames,
	isLocked,
	onShowLockedWarning,
}) => {
	const { localState, localActions } = useDomainSettingsBodyData(domain);
	const handlers = useDomainSettingsBodyHandlers({
		props: {
			isLocked,
			onShowLockedWarning,
		},
		localActions,
	});

	return (
		<div
			className="domain-settings-body__container"
			onClick={handlers.handleBodyClicking}
		>
			<div className="domain-settings-body__top">
				<div className="domain-settings-body__top--left border-blue">
					<NFTMedia
						className="domain-media-wrapper"
						style={{
							objectFit: 'contain',
						}}
						alt="NFT Preview"
						ipfsUrl={domain?.image_full || domain?.image || ''}
						size="large"
					/>
				</div>
				<div className="domain-settings-body__top--right">
					<TextInputWithTopPlaceHolder
						topPlaceholder={'Title'}
						onChange={localActions.setName}
						text={localState.name || ''}
						error={false}
						errorText={'asdf'}
					/>
					<TextInputWithTopPlaceHolder
						topPlaceholder={'Subdomain Name'}
						onChange={localActions.setDomain}
						text={localState.domain}
						error={false}
						errorText={'asdf'}
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
					error={false}
					errorText={'asdf'}
				/>
			</div>
			<div className="domain-settings-body__footer">
				<h3>Advanced Domain Settings</h3>
				<div className="domain-settings-body__footer--section">
					<ToggleSwitch
						checked={localState.mintRequestOn}
						onChange={(checked) => localActions.setMintRequestOn(checked)}
					/>
					<label>Domain Mint Requests</label>
					<Tooltip text="This is long information to display on hover">
						<QuestionButton small />
					</Tooltip>
				</div>
				<div className="domain-settings-body__footer--section">
					<ToggleSwitch
						checked={localState.biddingOn}
						onChange={(checked) => localActions.setBiddingOn(checked)}
					/>
					<label>Domain Bidding</label>
					<Tooltip text="This is long information to display on hover">
						<QuestionButton small />
					</Tooltip>
				</div>
				<div className="domain-settings-body__footer--section">
					<ToggleSwitch
						checked={localState.buyNowOn}
						onChange={(checked) => localActions.setBuyNowOn(checked)}
					/>
					<label>Buy Now</label>
					<Tooltip text="This is long information to display on hover">
						<QuestionButton small />
					</Tooltip>
				</div>
				<div className="domain-settings-body__footer--section">
					<ToggleSwitch
						checked={localState.displayGridOn}
						onChange={(checked) => localActions.setDisplayGridOn(checked)}
					/>
					<label>Display Domain in Grid View by Default</label>
					<Tooltip text="This is long information to display on hover">
						<QuestionButton small />
					</Tooltip>
				</div>
				<div className="domain-settings-body__footer--section">
					<ToggleSwitch
						checked={localState.customAspectRatioOn}
						onChange={(checked) => localActions.setCustomAspectRatioOn(checked)}
					/>
					<label>Custom Aspect Ratio in Grid View</label>
					<Tooltip text="This is long information to display on hover">
						<QuestionButton small />
					</Tooltip>
				</div>
				<div className="domain-settings-body__footer--section">
					<ToggleSwitch
						checked={localState.lockMetadataOn}
						onChange={(checked) => localActions.setLockMetadataOn(checked)}
					/>
					<label>Lock Metadata</label>
					<Tooltip text="This is long information to display on hover">
						<QuestionButton small />
					</Tooltip>
				</div>
			</div>
		</div>
	);
};
