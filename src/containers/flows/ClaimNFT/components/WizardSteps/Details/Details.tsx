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
} from './Details.constants';

// Library Imports
import classNames from 'classnames/bind';

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
	isWalletConnected: boolean;
	isClaimable: boolean;
	error?: string;
	connectToWallet: () => void;
	onStartClaim: () => void;
	onRedirect: () => void;
};

const cx = classNames.bind(styles);

const Details = ({
	isWalletConnected,
	isClaimable,
	error,
	connectToWallet,
	onStartClaim,
	onRedirect,
}: DetailsProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	const [tokenID, setTokenID] = useState<string | undefined>();

	const validTokenId = isValidTokenId(tokenID ?? '');
	// replace
	const isClaimDataLoading = false;
	const hasValue = Boolean(tokenID?.length);
	const buttonText = getButtonText(isWalletConnected, isClaimable);
	const quantityText = getQuantityText(isClaimable, 0);
	const quantityTooltip = getQuantityTooltip(isClaimable);

	///////////////
	// Functions //
	///////////////

	const onCheck = () => console.log('onCheck');

	const onSubmit = () => {
		if (!isWalletConnected) {
			connectToWallet();
		} else if (isWalletConnected && isClaimable) {
			onStartClaim();
		} else {
			onRedirect();
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
							<div className={styles.Header}>{TEXT_INPUT.HEADER}</div>
							<Tooltip deepPadding text={TOOLTIP.TEXT_INPUT}>
								<QuestionButton small />
							</Tooltip>
						</div>
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

						{!isWalletConnected ? (
							<div className={styles.Warning}>
								{MESSAGES.CONNECT_WALLET_PROMPT}
							</div>
						) : (
							<div className={styles.TextContainer}>
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
								{isClaimable && (
									<div className={styles.CostPrompt}>
										{MESSAGES.COST_PROMPT}
									</div>
								)}
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
