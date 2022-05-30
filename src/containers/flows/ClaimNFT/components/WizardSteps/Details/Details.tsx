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
import { Domain } from '@zero-tech/zns-sdk';

//- Hook Imports
import useClaimDomainData from '../../../hooks/useClaimDomainData';

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
	Spinner,
} from 'components';

// Utils Imports
import {
	getButtonText,
	isValidTokenId,
	getQuantityText,
	getQuantityTooltip,
	handleInputNotification,
	NotificationType,
} from './Details.utils';

// Style Imports
import styles from './Details.module.scss';

type DetailsProps = {
	tokenID?: string;
	isClaimDataLoading?: boolean;
	eligibleDomains?: Domain[];
	isWalletConnected: boolean;
	currentStep: Step;
	error?: string;
	connectToWallet?: () => void;
	onStartClaim?: () => void;
	onRedirect?: () => void;
	onFinish?: () => void;
	setTokenID?: (id: string) => void;
};

const cx = classNames.bind(styles);

const Details = ({
	tokenID,
	isClaimDataLoading,
	eligibleDomains,
	isWalletConnected,
	currentStep,
	error,
	connectToWallet,
	onStartClaim,
	onRedirect,
	onFinish,
	setTokenID,
}: DetailsProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////
	const [notificationType, setNotificationType] = useState<NotificationType>();
	const [inputNotification, setInputNotification] = useState<
		string | undefined
	>();
	const [requestCheck, setRequestCheck] = useState<boolean>(false);

	const { isDomainDataLoading: isCheckDataLoading, domainData } =
		useClaimDomainData(tokenID ?? '', requestCheck);
	//replace
	const isTokenClaimed = domainData?.isLocked;
	const validTokenId = isValidTokenId(tokenID ?? '');
	const hasValue = Boolean(tokenID?.length);
	const isDetailsStep = currentStep === Step.Details;
	const totalEligibleDomains = eligibleDomains?.length ?? 0;
	const hasEligibleDomains = totalEligibleDomains > 0;
	const quantityText = getQuantityText(totalEligibleDomains);
	const quantityTooltip = getQuantityTooltip(hasEligibleDomains);
	const hasError = error || notificationType === NotificationType.ERROR;
	const hasSuccess = notificationType === NotificationType.SUCCESS;

	const headerPrompt = isDetailsStep
		? MESSAGES.SEARCH_PROMPT
		: MESSAGES.MINTING_PROMPT;

	const buttonText =
		currentStep === Step.Details
			? getButtonText(isWalletConnected, hasEligibleDomains)
			: BUTTONS.FINISH;

	const promptText = isDetailsStep
		? hasEligibleDomains
			? MESSAGES.COST_PROMPT
			: ''
		: MESSAGES.CLOSE_PROMPT;

	///////////////
	// Functions //
	///////////////

	const onSubmit = () => {
		if (!isWalletConnected && connectToWallet) {
			connectToWallet();
		} else if (!hasEligibleDomains && onRedirect) {
			onRedirect();
		} else {
			isDetailsStep ? onStartClaim && onStartClaim() : onFinish && onFinish();
		}
	};

	const handleChange = (id: string) => {
		setInputNotification('');
		setNotificationType(undefined);
		setTokenID && setTokenID(id);
		setRequestCheck(false);
	};

	const onCheck = () => {
		handleInputNotification(
			setInputNotification,
			setNotificationType,
			isTokenClaimed,
		);
		setRequestCheck(true);
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

				<div className={styles.InfoContainer}>
					<div className={styles.HeaderContainer}>
						<div
							className={cx(styles.HeaderPrompt, {
								isDetailsStep: isDetailsStep,
								isMintingStep: currentStep === Step.Minting,
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
									hasNotification: hasError || hasSuccess,
								})}
							>
								{tokenID && (
									<span
										className={cx(styles.SecondaryPlaceholder, {
											hasError: hasError,
											hasSuccess: hasSuccess,
										})}
									>
										{TEXT_INPUT.PLACEHOLDER}
									</span>
								)}
								<TextInput
									className={cx(styles.Input, {
										hasValue: hasValue,
										hasError: hasError,
									})}
									onChange={handleChange}
									placeholder={TEXT_INPUT.PLACEHOLDER}
									text={tokenID}
									type={TEXT_INPUT.TYPE}
								/>

								<div className={styles.ButtonContainer}>
									<FutureButton
										glow={validTokenId}
										disabled={!validTokenId}
										onClick={onCheck}
										loading={isCheckDataLoading}
									>
										{TEXT_INPUT.BUTTON}
									</FutureButton>
								</div>
							</div>
							{inputNotification && (
								<div
									className={cx(styles.InputNotification, {
										hasError: hasError,
										hasSuccess: hasSuccess,
									})}
								>
									{inputNotification}
								</div>
							)}
						</>
					)}
					{!isClaimDataLoading ? (
						<>
							{!isWalletConnected ? (
								<div className={styles.Warning}>
									{MESSAGES.CONNECT_WALLET_PROMPT}
								</div>
							) : (
								<div className={styles.TextContainer}>
									{isDetailsStep && (
										<>
											<div className={styles.FlexRowWrapper}>
												<div className={styles.QuantityText}>
													{quantityText}
												</div>
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
						</>
					) : (
						<div className={styles.Spinner}>
							<Spinner />
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default Details;
