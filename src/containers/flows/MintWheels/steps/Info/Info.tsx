import { Stage } from '../../types';

import { ArrowLink, FutureButton } from 'components';

import styles from './Info.module.css';

type InfoProps = {
	dropStage: Stage;
	isUserEligible: boolean;
	isWalletConnected: boolean;
	onContinue: () => void;
	wheelsMinted: number;
	wheelsTotal: number;
};

const Info = (props: InfoProps) => {
	const openConnectWalletModal = () => {
		console.log('open connect wallet');
	};

	const button = () => {
		if (!props.isWalletConnected) {
			return (
				<FutureButton glow onClick={openConnectWalletModal}>
					Connect Wallet
				</FutureButton>
			);
		} else {
			return (
				<FutureButton
					glow={props.isWalletConnected && props.isUserEligible}
					onClick={props.onContinue}
				>
					Mint Your Wheels
				</FutureButton>
			);
		}
	};

	return (
		<section className={styles.Container}>
			{/* Head section */}
			<section>
				<h1>Mint Your Wheels</h1>
				<span>Your ride in the metaverse awaits</span>
				<hr />
			</section>

			{/* Body */}
			<section>
				{/* Wheels Image */}
				<div></div>

				{/* Wheels Available */}
				<div>
					<span>Wheels Available</span>
					<h2>
						{props.wheelsMinted} / {props.wheelsTotal} WHEELS have been minted
					</h2>
					<ArrowLink>View Auction Rules</ArrowLink>
				</div>

				{/* Info */}
				<p>
					This is some explainer text about WHEELS and what this flow involves,
					it is about two sentences long. Ready to start?
				</p>
				<p>
					You may mint up to 2 Wheels total. The cost for each Wheel is 0.07 ETH
					(100 WILD) plus GAS.
				</p>

				{/* Button */}
				{button()}
			</section>
		</section>
	);
};

export default Info;
