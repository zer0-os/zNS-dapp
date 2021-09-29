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
	onContinue: () => void;
	wheelsMinted: number;
	wheelsTotal: number;
};

const Info = (props: InfoProps) => {
	///////////////
	// Fragments //
	///////////////

	const eligibilityText = () => {
		if (!props.isWalletConnected) {
			return;
		}
		if (props.isUserWhitelisted === undefined) {
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

			{((props.isWalletConnected && props.isUserWhitelisted !== undefined) ||
				!props.isWalletConnected) && (
				<>
					{/* Info */}
					{props.dropStage === Stage.Upcoming && (
						<p>Dropping soon ***countdown***</p>
					)}
					<p>
						Each user may mint up to 2 Wheels. The cost for each Wheel is{' '}
						<b>{EthPerWheel} ETH</b> plus GAS.
					</p>
					{props.isWalletConnected && props.isUserWhitelisted !== undefined && (
						<FutureButton
							className={styles.Button}
							glow={props.isUserWhitelisted || props.dropStage === Stage.Public}
							onClick={props.onContinue}
						>
							Mint Your Wheels
						</FutureButton>
					)}
					{/* Button */}
					{!props.isWalletConnected && props.dropStage !== Stage.Upcoming && (
						<ConnectWalletButton className={styles.Button}>
							Connect Wallet
						</ConnectWalletButton>
					)}
				</>
			)}
		</section>
	);
};

export default Info;
