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
		<div className={`domain-settings-body__container ${isLocked && 'locked'}`}>
			<div className="domain-settings-body__top">
				{/* Domain Media Section */}
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

				{/* Domain Title & Domain Section */}
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

				{/* Domain Mint Request Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.mintRequestOn}
							onChange={localActions.setMintRequestOn}
						/>
						<label>Domain Mint Requests</label>
						<Tooltip text="This is long information to display on hover">
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>

				{/* Domain Bidding Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.biddingOn}
							onChange={localActions.setBiddingOn}
						/>
						<label>Domain Bidding</label>
						<Tooltip text="This is long information to display on hover">
							<QuestionButton small />
						</Tooltip>
					</div>
					{localState.biddingOn && (
						<div className="domain-settings-body__footer--sub-section">
							<div className="domain-settings-body__footer--sub-section-wrap">
								<div className="domain-settings-body__footer--sub-section-block">
									<ToggleSwitch
										checked={localState.bidExpiryOn}
										onChange={localActions.setBidExpiryOn}
									/>
									<label>Bid Expiry</label>
									<Tooltip text="This is long information to display on hover">
										<QuestionButton small />
									</Tooltip>
								</div>
								<div className="domain-settings-body__footer--sub-section-block">
									<TextInputWithTopPlaceHolder
										topPlaceholder={'Bids Expire After'}
										placeholder="hh:mm:ss"
										onChange={localActions.setBidExpireTime}
										text={localState.bidExpireTime}
										error={false}
										errorText={'asdf'}
									/>
								</div>
							</div>
							<div className="domain-settings-body__footer--sub-section-wrap">
								<div className="domain-settings-body__footer--sub-section-block">
									<ToggleSwitch
										checked={localState.auctionEndtimeOn}
										onChange={localActions.setAuctionEndtimeOn}
									/>
									<label>Auction End Time</label>
									<Tooltip text="This is long information to display on hover">
										<QuestionButton small />
									</Tooltip>
								</div>
								<div className="domain-settings-body__footer--sub-section-block">
									<TextInputWithTopPlaceHolder
										topPlaceholder={'Auction End Time'}
										placeholder="Mmm dd yyyy hh:mm:ss UTC"
										onChange={localActions.setAuctionEndtime}
										text={localState.auctionEndtime}
										error={false}
										errorText={'asdf'}
									/>
								</div>
							</div>
							<div className="domain-settings-body__footer--sub-section-wrap">
								<div className="domain-settings-body__footer--sub-section-block">
									<TextInputWithTopPlaceHolder
										topPlaceholder={'Auction Message (124 characters max)'}
										placeholder=""
										onChange={localActions.setAuctionMessage}
										text={localState.auctionMessage}
										error={false}
										errorText={'asdf'}
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Bid now Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.buyNowOn}
							onChange={localActions.setBuyNowOn}
						/>
						<label>Buy Now</label>
						<Tooltip text="This is long information to display on hover">
							<QuestionButton small />
						</Tooltip>
					</div>
					{localState.buyNowOn && (
						<div className="domain-settings-body__footer--sub-section no-gutters">
							<TextInputWithTopPlaceHolder
								topPlaceholder={'Buy Now Price (WILD)'}
								placeholder="1234 WILD"
								onChange={localActions.setBuyNowPrice}
								text={localState.buyNowPrice}
								error={false}
								errorText={'asdf'}
							/>
						</div>
					)}
				</div>
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.displayGridOn}
							onChange={localActions.setDisplayGridOn}
						/>
						<label>Display Domain in Grid View by Default</label>
						<Tooltip text="This is long information to display on hover">
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>

				{/* Custom Aspect Ratio in Grid View Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.customAspectRatioOn}
							onChange={localActions.setCustomAspectRatioOn}
						/>
						<label>Custom Aspect Ratio in Grid View</label>
						<Tooltip text="This is long information to display on hover">
							<QuestionButton small />
						</Tooltip>
					</div>
				</div>

				{/* Lock Metadata Section */}
				<div className="domain-settings-body__footer--section">
					<div className="domain-settings-body__footer--main-section">
						<ToggleSwitch
							checked={localState.lockMetadataOn}
							onChange={localActions.setLockMetadataOn}
						/>
						<label>Lock Metadata</label>
						<Tooltip text="This is long information to display on hover">
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
