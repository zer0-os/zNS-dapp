// Component & Container Imports
import { ConnectWalletButton } from 'containers';
import { ArrowLink, FutureButton } from 'components';
import Loading from '../Loading/Loading';

// Library Imports
import { Stage } from '../../types';

// Style Imports
import styles from './Info.module.scss';

type InfoProps = {
	dropStage: Stage;
	errorMessage?: string;
	isUserWhitelisted?: boolean;
	isWalletConnected: boolean;
	maxPurchasesPerUser?: number;
	numberPurchasedByUser?: number;
	onContinue: () => void;
	onDismiss: () => void;
	wheelsMinted: number;
	wheelsTotal: number;
	pricePerNFT: number;
};

const Info = (props: InfoProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	// Warning: Some ugly booleans ahead

	// If any of the auction data items are undefined it
	// must be loading
	const isAuctionDataLoading = props.dropStage === undefined;

	// If wallet is connnected and the user data is undefined
	// it must be loading
	const isUserDataLoading =
		props.isWalletConnected &&
		(props.isUserWhitelisted === undefined ||
			props.numberPurchasedByUser === undefined);

	// If all data is loaded, and it's the public release
	// or it's the whitelist release and the user is whitelisted
	const isUserEligible =
		!isUserDataLoading &&
		!isAuctionDataLoading &&
		(props.dropStage === Stage.Public ||
			(props.dropStage === Stage.Whitelist &&
				props.isUserWhitelisted &&
				props.maxPurchasesPerUser! > 0));

	// If the user has any wheels left to mint
	const userHasWheelsRemaining =
		isUserEligible && props.numberPurchasedByUser! < props.maxPurchasesPerUser!;

	///////////////
	// Fragments //
	///////////////

	const mintButton = () => {
		return (
			<FutureButton
				className={styles.Button}
				glow={props.isUserWhitelisted || props.dropStage === Stage.Public}
				onClick={props.onContinue}
			>
				Mint Your Beasts
			</FutureButton>
		);
	};

	const connectWalletButton = () => {
		return (
			<ConnectWalletButton className={styles.Button}>
				Connect Wallet
			</ConnectWalletButton>
		);
	};

	const dismissButton = () => {
		return (
			<FutureButton className={styles.Button} glow onClick={props.onDismiss}>
				Dismiss
			</FutureButton>
		);
	};

	const body = () => {
		if (!props.isWalletConnected) {
			return (
				<>
					<p>
						You will be able to mint {props.maxPurchasesPerUser} Beasts if your
						wallet was whitelisted in our raffle on Monday, January 17, 2022.
						<br></br>
						<br></br>
						The cost for each Beast is <b>{props.pricePerNFT} ETH</b> plus GAS.
					</p>
					{connectWalletButton()}
				</>
			);
		}
		if (isAuctionDataLoading) {
			return <Loading text={'Loading Auction Data'} />;
		}
		if (isUserDataLoading) {
			return <Loading text={'Loading User Data'} />;
		}
		if (isUserEligible) {
			if (userHasWheelsRemaining) {
				return (
					<>
						<p>
							You have minted {props.numberPurchasedByUser} /{' '}
							{props.maxPurchasesPerUser} Beasts. The cost for each Beast is{' '}
							<b>{props.pricePerNFT} ETH</b> plus GAS.
						</p>
						{props.errorMessage !== undefined && (
							<p className="error-text text-center">{props.errorMessage}</p>
						)}
						{mintButton()}
					</>
				);
			} else if (Boolean(props.maxPurchasesPerUser)) {
				return (
					<>
						<p className={styles.Green}>
							Congratulations, you have minted {props.numberPurchasedByUser}/
							{props.maxPurchasesPerUser} of your Beasts.
						</p>
						{dismissButton()}
					</>
				);
			} else {
				return (
					<>
						<p>
							You have minted {props.numberPurchasedByUser} Beasts. The cost for
							each Beast is <b>{props.pricePerNFT} ETH</b> plus GAS.
						</p>

						{mintButton()}
					</>
				);
			}
		} else {
			return (
				<>
					<p className={styles.Orange}>
						Currently, Beasts are only available to whitelisted supporters of
						Wilder World. If supply lasts, you will be able to mint when the
						whitelist sale ends.
					</p>
					{dismissButton()}
				</>
			);
		}
	};

	////////////
	// Render //
	////////////

	return (
		<section className={styles.Container}>
			{/* Wheels Image */}
			<video
				autoPlay={true}
				className={styles.Image}
				loop={true}
				playsInline
				controls
				disablePictureInPicture
				controlsList="nodownload noremoteplayback noplaybackrate nofullscreen"
				poster={
					'https://res.cloudinary.com/fact0ry/video/upload/so_0/c_fit,h_426,w_672/v1649690004/zns/beasts-mint-main.jpg'
				}
				preload="metadata"
			>
				<source
					src={
						'https://res.cloudinary.com/fact0ry/video/upload/q_100,c_fit,h_426,w_672/v1649690004/zns/beasts-mint-main.webm'
					}
					type="video/webm"
				></source>
				<source
					src={
						'https://res.cloudinary.com/fact0ry/video/upload/q_100,c_fit,h_426,w_672/v1649690004/zns/beasts-mint-main.mp4'
					}
					type="video/mp4"
				></source>
				<source
					src={
						'https://res.cloudinary.com/fact0ry/video/upload/q_100,c_fit,h_426,w_672/v1649690004/zns/beasts-mint-main.ogv'
					}
					type="video/ogg"
				></source>
			</video>

			{/* Wheels Available */}
			{!isAuctionDataLoading && (
				<div className={styles.Available}>
					<span>Beasts Available</span>
					<h2>{props.wheelsTotal - props.wheelsMinted} Beasts Remaining</h2>
					<ArrowLink href="https://zine.wilderworld.com/wolfpack-genesis-drop/">
						View Auction Rules
					</ArrowLink>
				</div>
			)}

			{body()}
		</section>
	);
};

export default Info;
