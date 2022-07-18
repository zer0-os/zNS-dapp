// React Imports
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Library Imports
import classNames from 'classnames/bind';
import { ClaimableDomain } from '@zero-tech/zsale-sdk';
import useNotification from 'lib/hooks/useNotification';

//- Types Imports
import { Step } from 'containers/flows/ClaimNFT/ClaimNFT.types';

// Component Imports
import {
	Wizard,
	QuestionButton,
	Tooltip,
	ArrowLink,
	Spinner,
} from 'components';

// Utils Imports
import {
	getButtonText,
	getQuantityText,
	getQuantityTooltip,
} from './Details.utils';

// Constants Imports
import {
	VIDEO_FORMAT_SRC,
	VIDEO_FORMAT_TYPE,
	VIDEO_SETTINGS,
	MESSAGES,
	TOOLTIP,
	BUTTONS,
	EXTERNAL_URL,
} from './Details.constants';
import { ROUTES } from 'constants/routes';
import { CLAIM_FLOW_NOTIFICATIONS } from 'constants/notifications';

// Style Imports
import styles from './Details.module.scss';
import CheckTokenInput from './CheckTokenInput';

type DetailsProps = {
	tokenID?: string;
	isClaimDataLoading?: boolean;
	isClaiming?: boolean;
	eligibleDomains?: ClaimableDomain[];
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
	isClaiming,
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
	const history = useHistory();
	const location = useLocation();
	const { addNotification } = useNotification();
	const isDetailsStep = currentStep === Step.Details;
	const totalEligibleDomains = eligibleDomains?.length ?? 0;
	const hasEligibleDomains = totalEligibleDomains > 0;
	const quantityText = getQuantityText(totalEligibleDomains);
	const quantityTooltip = getQuantityTooltip(hasEligibleDomains);

	const headerPrompt = isDetailsStep
		? MESSAGES.SEARCH_PROMPT
		: isClaiming
		? MESSAGES.MINTING_PROMPT
		: MESSAGES.MINTING_SUCCESS;

	const buttonText =
		currentStep === Step.Details
			? getButtonText(isWalletConnected, hasEligibleDomains)
			: isClaiming
			? BUTTONS.FINISH
			: BUTTONS.VIEW_IN_PROFILE;

	const promptText = isDetailsStep
		? hasEligibleDomains
			? MESSAGES.COST_PROMPT
			: ''
		: MESSAGES.CLOSE_PROMPT;

	///////////////
	// Functions //
	///////////////

	const handleOnOpenProfile = useCallback(() => {
		history.push({
			pathname: ROUTES.PROFILE,
			state: { previous: location.pathname },
		});
		addNotification(CLAIM_FLOW_NOTIFICATIONS.REFRESH);
	}, [addNotification, history, location.pathname]);

	const onSubmit = () => {
		if (!isWalletConnected && connectToWallet) {
			connectToWallet();
		} else if (!hasEligibleDomains && onRedirect) {
			onRedirect();
		} else {
			isDetailsStep
				? onStartClaim && onStartClaim()
				: isClaiming
				? onFinish && onFinish()
				: handleOnOpenProfile();
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
					poster={VIDEO_FORMAT_SRC[VIDEO_FORMAT_TYPE.NFT_JPEG]}
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
								isMintingStep: !isDetailsStep && isClaiming,
								claimComplete: !isDetailsStep && !isClaiming,
							})}
						>
							{headerPrompt}
						</div>
						{isClaiming && (
							<Tooltip
								deepPadding
								text={isDetailsStep ? TOOLTIP.DETAILS : TOOLTIP.MINTING}
							>
								<QuestionButton small />
							</Tooltip>
						)}
					</div>
					{isDetailsStep && <CheckTokenInput />}
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
												href={EXTERNAL_URL.CLAIM_ZINE}
												isLinkToExternalUrl
											>
												{MESSAGES.READ_MORE}
											</ArrowLink>
										</>
									)}

									{isClaiming && (
										<div className={styles.Prompt}>{promptText}</div>
									)}
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
