import { useState } from 'react';
import { FutureButton, Spinner } from 'components';
import styles from './RaffleRegistration.module.scss';
import { ConnectWalletButton } from 'containers';

import iconDiscord from '../assets/discord.png';
import iconTwitter from '../assets/twitter.png';

type RaffleRegistrationProps = {
	isWalletConnected: boolean;
	onSubmit: (statusCallback: (status: string) => void) => Promise<void>;
};

const RaffleRegistration = (props: RaffleRegistrationProps) => {
	const [status, setStatus] = useState<string | undefined>();
	const [error, setError] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	const onSubmit = async () => {
		setError(undefined);
		setIsLoading(true);

		try {
			await props.onSubmit(updateStatus);
			setHasSubmitted(true);
		} catch (e) {
			setError(e);
			console.error(e);
		}

		setIsLoading(false);
	};

	const updateStatus = (status: string) => {
		setStatus(status);
	};

	return (
		<div className={`${styles.Container} border-primary border-rounded`}>
			<section className={styles.Header}>
				<h1 className="glow-text-white">Guarantee Your Ride</h1>
				<hr />
			</section>
			{!hasSubmitted && (
				<section>
					{!isLoading && (
						<>
							<p>
								The upcoming Wilder Wheels drop will first be available to
								whitelisted members. Whitelist spots will be selected through a
								raffle. In order to register you will need to sign a message
								with your wallet, then you're all set.
							</p>
							{error && <span className={styles.Error}>{error}</span>}
							{props.isWalletConnected && (
								<FutureButton glow className={styles.Button} onClick={onSubmit}>
									Continue
								</FutureButton>
							)}
							{!props.isWalletConnected && (
								<ConnectWalletButton className={styles.Button}>
									Connect Wallet
								</ConnectWalletButton>
							)}
						</>
					)}
					{isLoading && (
						<div className={styles.Loading}>
							<span>{status || 'Loading'}</span>
							<Spinner />
						</div>
					)}
				</section>
			)}
			{hasSubmitted && (
				<>
					<p className={styles.Success}>You’ve been added the raffle.</p>
					<div className={styles.Socials}>
						<span>Follow our socials to get the latest info:</span>
						<div>
							<a
								href={'https://discord.com/invite/wilderworld'}
								target="_blank"
								rel="noreferrer"
							>
								<img src={iconDiscord} />
								Discord
							</a>
							<a
								href={'https://twitter.com/WilderWorld'}
								target="_blank"
								rel="noreferrer"
							>
								<img alt="twitter" src={iconTwitter} />
								Twitter
							</a>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default RaffleRegistration;
