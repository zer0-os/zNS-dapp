import { Stage } from '../../types';

// Component & Container Imports
import { ConnectWalletButton } from 'containers';
import { ArrowLink, FutureButton, Spinner } from 'components';

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
		if (
			props.isUserWhitelisted === undefined &&
			props.dropStage === Stage.Whitelist
		) {
			return (
				<div className={styles.Checking}>
					<Spinner />
					<span>Checking whitelist status</span>
				</div>
			);
		}
		if (props.dropStage === Stage.Whitelist) {
			if (props.isUserWhitelisted) {
				return <p className={styles.Green}>*** Missing copy here ***</p>;
			} else {
				return (
					<p className={styles.Orange}>
						Currently WHEELS are only available to white-listed supporters of
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
						act fast to secure your wheels.
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
			<img
				alt="wheels NFT drop banner image"
				className={styles.Image}
				src={banner}
			/>

			{/* Wheels Available */}
			<div className={styles.Available}>
				<span>Wheels Available</span>
				<h2>
					{props.wheelsMinted} / {props.wheelsTotal} WHEELS have been minted
				</h2>
				<ArrowLink>View Auction Rules</ArrowLink>
			</div>

			{eligibilityText()}

			{/* Info */}
			{props.dropStage === Stage.Upcoming && (
				<p>Dropping soon ***countdown***</p>
			)}
			{(props.dropStage === Stage.Public ||
				(props.dropStage === Stage.Whitelist && props.isUserWhitelisted)) && (
				<>
					<p>
						This is some explainer text about WHEELS and what this flow
						involves, it is about two sentences long. Ready to start?
					</p>
					<p>
						You may mint up to 2 Wheels total. The cost for each Wheel is 0.07
						ETH (100 WILD) plus GAS.
					</p>
					{props.isWalletConnected && (
						<FutureButton
							className={styles.Button}
							glow={props.isUserWhitelisted || props.dropStage === Stage.Public}
							onClick={props.onContinue}
						>
							Mint Your Wheels
						</FutureButton>
					)}
				</>
			)}
			{/* Button */}
			{!props.isWalletConnected && props.dropStage !== Stage.Upcoming && (
				<ConnectWalletButton className={styles.Button}>
					Connect Wallet
				</ConnectWalletButton>
			)}
		</section>
	);
};

export default Info;
