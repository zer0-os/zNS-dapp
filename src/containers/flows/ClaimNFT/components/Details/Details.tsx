// React Imports
import { useState } from 'react';

// Constants Imports
import {
	VIDEO_FORMAT_SRC,
	VIDEO_FORMAT_TYPE,
	VIDEO_SETTINGS,
	TEXT_INPUT,
	MESSAGES,
	BUTTONS,
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
} from 'components';

// Utils Imports
import { isValidTokenId } from './Details.utils';

// Style Imports
import styles from './Details.module.scss';

type DetailsProps = {
	isWalletConnected: boolean;
	error: string;
	connectToWallet: () => void;
};

const cx = classNames.bind(styles);

const Details = ({
	isWalletConnected,
	error,
	connectToWallet,
}: DetailsProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	const [tokenID, setTokenID] = useState<string | undefined>();
	const validTokenId = isValidTokenId(tokenID ?? '');
	// replace
	const isClaimDataLoading = false;
	const hasValue = Boolean(tokenID?.length);

	///////////////
	// Functions //
	///////////////

	const onCheck = () => console.log('onCheck');

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
							<Tooltip deepPadding text={TEXT_INPUT.TOOLTIP}>
								<QuestionButton small />
							</Tooltip>
						</div>
						<div
							className={cx(styles.InputContainer, {
								hasValue: hasValue,
								hasError: error,
							})}
						>
							<div
								className={cx(styles.FlexRowWrapper, {
									hasValue: hasValue,
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
							</div>
							<div className={styles.ButtonContainer}>
								<FutureButton glow={validTokenId} onClick={onCheck}>
									{/* replace - get button text to add */}
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
								{'error'}
							</div>
						)}

						{!isWalletConnected && (
							<div className={styles.Warning}>
								{MESSAGES.CONNECT_WALLET_PROMPT}
							</div>
						)}
						<Wizard.Buttons
							primaryButtonText={BUTTONS.CONNECT_WALLET}
							onClickPrimaryButton={connectToWallet}
						/>
					</div>
				)}
			</section>
		</>
	);
};

export default Details;
