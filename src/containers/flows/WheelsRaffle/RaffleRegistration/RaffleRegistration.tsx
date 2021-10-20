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
				<h1 className="glow-text-white">Join The Whitelist Raffle</h1>
				<hr />
			</section>
			{!hasSubmitted && (
				<section>
					{!isLoading && (
						<>
							<p>
								Whitelisted members will have early access to the upcoming
								wheels drop. Sign up to the raffle with your wallet for a chance
								at joining the whitelist!
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
					<p className={styles.Success}>You successfully joined the raffle!</p>
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
