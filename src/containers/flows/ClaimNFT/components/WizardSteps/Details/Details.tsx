// React Imports
import { useState } from 'react';

// Constants Imports
import {
	VIDEO_FORMAT_SRC,
	VIDEO_FORMAT_TYPE,
	VIDEO_SETTINGS,
	TEXT_INPUT,
	MESSAGES,
	TOOLTIP,
	BUTTONS,
} from './Details.constants';

// Library Imports
import classNames from 'classnames/bind';

//- Types Imports
import { Step } from 'containers/flows/ClaimNFT/ClaimNFT.types';

// Component Imports
import {
	TextInput,
	FutureButton,
	Wizard,
	QuestionButton,
	Tooltip,
	ArrowLink,
} from 'components';

// Utils Imports
import {
	getButtonText,
	isValidTokenId,
	getQuantityText,
	getQuantityTooltip,
} from './Details.utils';

// Style Imports
import styles from './Details.module.scss';

type DetailsProps = {
	ownedQuantity?: number;
	isWalletConnected: boolean;
	isClaimable: boolean;
	currentStep: Step;
	error?: string;
	connectToWallet?: () => void;
	onStartClaim?: () => void;
	onRedirect?: () => void;
	onFinish?: () => void;
};

const cx = classNames.bind(styles);

const Details = ({
	ownedQuantity,
	isWalletConnected,
	isClaimable,
	currentStep,
	error,
	connectToWallet,
	onStartClaim,
	onRedirect,
	onFinish,
}: DetailsProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////
	const [tokenID, setTokenID] = useState<string | undefined>();

	const validTokenId = isValidTokenId(tokenID ?? '');
	// replace
	const isClaimDataLoading = false;
	const hasValue = Boolean(tokenID?.length);
	const isDetailsStep = currentStep === Step.Details;
	const quantityText = getQuantityText(isClaimable, ownedQuantity ?? 0);
	const quantityTooltip = getQuantityTooltip(isClaimable);

	const headerPrompt = isDetailsStep
		? MESSAGES.SEARCH_PROMPT
		: MESSAGES.MINTING_PROMPT;

	const buttonText =
		currentStep === Step.Details
			? getButtonText(isWalletConnected, isClaimable)
			: BUTTONS.FINISH;

	const promptText = isDetailsStep
		? isClaimable
			? MESSAGES.COST_PROMPT
			: ''
		: MESSAGES.CLOSE_PROMPT;

	///////////////
	// Functions //
	///////////////

	const onCheck = () => console.log('onCheck');

	const onSubmit = () => {
		if (!isWalletConnected && connectToWallet) {
			connectToWallet();
		} else if (!isClaimable && onRedirect) {
			onRedirect();
		} else {
			isDetailsStep ? onStartClaim && onStartClaim() : onFinish && onFinish();
		}
	};

	return (
		<>
			<section className={styles.Container}>
				<video
					autoPlay={true}
					className={styles.Media}
					loop={true}
					playsInline
					controls
					disablePictureInPicture
					controlsList={VIDEO_SETTINGS.CONTROL_LIST}
					poster={VIDEO_FORMAT_SRC.NFT_JPEG}
					preload={VIDEO_SETTINGS.PRELOAD}
				>
					<source
						src={VIDEO_FORMAT_SRC[VIDEO_FORMAT_TYPE.NFT_WEBM]}
						type={VIDEO_FORMAT_TYPE.NFT_WEBM}
					></source>
					<source
						src={VIDEO_FORMAT_SRC[VIDEO_FORMAT_TYPE.NFT_MP4]}
						type={VIDEO_FORMAT_TYPE.NFT_MP4}
					></source>
					<source
						src={VIDEO_FORMAT_SRC[VIDEO_FORMAT_TYPE.NFT_OGG]}
						type={VIDEO_FORMAT_TYPE.NFT_OGG}
					></source>
				</video>

				{!isClaimDataLoading && (
					<div className={styles.InfoContainer}>
						<div className={styles.HeaderContainer}>
							<div
								className={cx(styles.HeaderPrompt, {
									isDetailsStep: isDetailsStep,
								})}
							>
								{headerPrompt}
							</div>
							<Tooltip
								deepPadding
								text={isDetailsStep ? TOOLTIP.DETAILS : TOOLTIP.MINTING}
							>
								<QuestionButton small />
							</Tooltip>
						</div>
						{isDetailsStep && (
							<>
								<div
									className={cx(styles.InputContainer, {
										hasValue: hasValue,
										hasError: error,
									})}
								>
									{tokenID && <span>{TEXT_INPUT.PLACEHOLDER}</span>}
									<TextInput
										className={cx(styles.Input, {
											hasValue: hasValue,
										})}
										onChange={(text: string) => setTokenID(text)}
										placeholder={TEXT_INPUT.PLACEHOLDER}
										text={tokenID}
										type={TEXT_INPUT.TYPE}
									/>

									<div className={styles.ButtonContainer}>
										<FutureButton
											glow={validTokenId}
											disabled={!validTokenId}
											onClick={onCheck}
										>
											{TEXT_INPUT.BUTTON}
										</FutureButton>
									</div>
								</div>
								{error && (
									<div
										className={cx(styles.Error, {
											hasError: error,
										})}
									>
										{error}
									</div>
								)}
							</>
						)}

						{!isWalletConnected ? (
							<div className={styles.Warning}>
								{MESSAGES.CONNECT_WALLET_PROMPT}
							</div>
						) : (
							<div className={styles.TextContainer}>
								{isDetailsStep && (
									<>
										<div className={styles.FlexRowWrapper}>
											<div className={styles.QuantityText}>{quantityText}</div>
											<Tooltip deepPadding text={quantityTooltip}>
												<QuestionButton small />
											</Tooltip>
										</div>
										<ArrowLink
											className={styles.ArrowLink}
											href={'url to claim zine'}
											isLinkToExternalUrl
										>
											{MESSAGES.READ_MORE}
										</ArrowLink>
									</>
								)}

								<div className={styles.Prompt}>{promptText}</div>
							</div>
						)}

						<Wizard.Buttons
							primaryButtonText={buttonText}
							onClickPrimaryButton={onSubmit}
						/>
					</div>
				)}
			</section>
		</>
	);
};

export default Details;
