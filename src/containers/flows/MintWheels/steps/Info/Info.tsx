// Component & Container Imports
import { ConnectWalletButton } from 'containers';
import { ArrowLink, FutureButton } from 'components';
import Loading from '../Loading/Loading';

// Library Imports
import { Stage } from '../../types';
import { EthPerWheel } from '../../helpers';

// Style Imports
import styles from './Info.module.css';

// Asset Imports
import banner from './assets/banner.png';

type InfoProps = {
	dropStage: Stage;
	isUserWhitelisted?: boolean;
	isWalletConnected: boolean;
	maxPurchasesPerUser?: number;
	numberPurchasedByUser?: number;
	onContinue: () => void;
	onDismiss: () => void;
	wheelsMinted: number;
	wheelsTotal: number;
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
			(props.dropStage === Stage.Whitelist && props.isUserWhitelisted));

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
				Mint Your Wheels
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
						Each user may mint up to 2 Wheels. The cost for each Wheels is{' '}
						<>{EthPerWheel} ETH</> plus GAS.
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
							{props.maxPurchasesPerUser} Wheels. The cost for each set of
							Wheels is <b>{EthPerWheel} ETH</b> plus GAS.
						</p>
						{mintButton()}
					</>
				);
			} else {
				return (
					<>
						<p className={styles.Green}>
							Congratulations, you have minted {props.numberPurchasedByUser}/
							{props.maxPurchasesPerUser} of your Wheels.
						</p>
						{dismissButton()}
					</>
				);
			}
		} else {
			return (
				<>
					<p className={styles.Orange}>
						Currently, Wheels are only available to white-listed supporters of
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
				muted
				playsInline
				poster={
					'https://res.cloudinary.com/fact0ry/video/upload/so_0/c_fit,h_396,w_642/v1632961671/zns/minting-wheels.jpg'
				}
				preload="metadata"
			>
				<source
					src={
						'https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_396,w_642/v1632961671/zns/minting-wheels.webm'
					}
					type="video/webm"
				></source>
				<source
					src={
						'https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_396,w_642/v1632961671/zns/minting-wheels.mp4'
					}
					type="video/mp4"
				></source>
				<source
					src={
						'https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_396,w_642/v1632961671/zns/minting-wheels.ogv'
					}
					type="video/ogg"
				></source>
			</video>

			{/* Wheels Available */}
			{!isAuctionDataLoading && (
				<div className={styles.Available}>
					<span>Wheels Available</span>
					<h2>
						{props.wheelsMinted} / {props.wheelsTotal} Wheels have been minted
					</h2>
					<ArrowLink>View Auction Rules</ArrowLink>
				</div>
			)}

			{body()}
		</section>
	);
};

export default Info;
