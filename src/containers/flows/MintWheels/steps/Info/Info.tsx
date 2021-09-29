import { Stage } from '../../types';

// Component & Container Imports
import { ConnectWalletButton } from 'containers';
import { ArrowLink, FutureButton, Spinner } from 'components';

import { EthPerWheel } from '../../helpers';

import styles from './Info.module.css';

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
	// @todo clean up logic
	const isAuctionDataLoading = props.dropStage === undefined;
	const isUserDataLoading =
		props.isWalletConnected && props.isUserWhitelisted === undefined;
	const canUserMintMore =
		props.numberPurchasedByUser !== undefined &&
		props.maxPurchasesPerUser !== undefined &&
		props.numberPurchasedByUser < props.maxPurchasesPerUser;

	///////////////
	// Fragments //
	///////////////

	const alreadyMinted = () => {
		if (isAuctionDataLoading || isUserDataLoading) {
			return;
		}
		if (props.numberPurchasedByUser !== undefined) {
			return (
				<p>
					You have minted: {props.numberPurchasedByUser} /{' '}
					{props.maxPurchasesPerUser}
				</p>
			);
		}
	};

	const eligibilityText = () => {
		if (isAuctionDataLoading || !props.isWalletConnected) {
			return;
		}
		if (isUserDataLoading) {
			return (
				<div className={styles.Checking}>
					<Spinner />
					<span>Checking your wallet</span>
				</div>
			);
		}
		if (props.dropStage === Stage.Whitelist) {
			if (props.isUserWhitelisted) {
				return (
					<p className={styles.Green}>
						Thank you for your support! As a white-listed member, you may now
						mint a Wheel before they become publicly available in *** countdown
						****
					</p>
				);
			} else {
				return (
					<p className={styles.Orange}>
						Currently Wheels are only available to white-listed supporters of
						Wilder World. Should supply last, you will be able to mint in ****
						countdown ****
					</p>
				);
			}
		}
		if (props.dropStage === Stage.Public) {
			if (props.isUserWhitelisted) {
				return (
					<p className={styles.Green}>
						Thank you for your support! You’re white-listed but the supporter
						exclusive time period has passed. Minting is now open to everyone,
						act fast to secure your Wheels.
					</p>
				);
			}
		}
	};

	const content = () => {
		if (isAuctionDataLoading || isUserDataLoading) {
			return;
		} else {
			return (
				<p>
					Each user may mint up to {props.maxPurchasesPerUser} Wheels. The cost
					for each Wheel is <b>{EthPerWheel} ETH</b> plus GAS.
				</p>
			);
		}
	};

	const button = () => {
		if (
			(props.isWalletConnected && props.isUserWhitelisted === undefined) ||
			props.dropStage === undefined
		) {
			return;
		}

		if (!props.isWalletConnected) {
			return (
				<ConnectWalletButton className={styles.Button}>
					Connect Wallet
				</ConnectWalletButton>
			);
		} else {
			if (
				props.maxPurchasesPerUser === undefined &&
				props.numberPurchasedByUser === undefined
			) {
				return;
			}
			if (
				![Stage.Upcoming, Stage.Ended, Stage.Sold].includes(props.dropStage) &&
				canUserMintMore
			) {
				return (
					<FutureButton
						className={styles.Button}
						glow={props.isUserWhitelisted || props.dropStage === Stage.Public}
						onClick={props.onContinue}
					>
						Mint Your Wheels
					</FutureButton>
				);
			} else {
				return (
					<FutureButton
						className={styles.Button}
						glow
						onClick={props.onDismiss}
					>
						Dismiss
					</FutureButton>
				);
			}
		}
	};

	////////////
	// Render //
	////////////

	return (
		<section className={styles.Container}>
			{/* Wheels Image */}
			<img alt="wheels NFT drop banner" className={styles.Image} src={banner} />

			{/* Wheels Available */}
			<div className={styles.Available}>
				<span>Wheels Available</span>
				<h2>
					{props.wheelsMinted} / {props.wheelsTotal} Wheels have been minted
				</h2>
				<ArrowLink>View Auction Rules</ArrowLink>
			</div>

			{eligibilityText()}

			{alreadyMinted()}

			{content()}

			{button()}
		</section>
	);
};

export default Info;
