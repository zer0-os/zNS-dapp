import { useState } from 'react';
import { FutureButton, Spinner, TextInput } from 'components';
import styles from './RaffleRegistration.module.scss';
import { ConnectWalletButton } from 'containers';

import iconDiscord from '../assets/discord.png';
import iconTwitter from '../assets/twitter.png';

type RaffleRegistrationProps = {
	isWalletConnected: boolean;
	onSubmit: (statusCallback: (status: string) => void) => Promise<void>;
	onSubmitEmail: (email: string) => Promise<boolean>;
};

const RaffleRegistration = (props: RaffleRegistrationProps) => {
	// Raffle entry
	const [status, setStatus] = useState<string | undefined>();
	const [registrationError, setRegistrationError] = useState<
		string | undefined
	>();
	const [isLoadingRegistration, setIsLoadingRegistration] =
		useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	// Email submission
	const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
	const [userEmail, setUserEmail] = useState<string | undefined>();
	const [emailError, setEmailError] = useState<string | undefined>();
	const [emailRegistrationSuccess, setEmailRegistrationSuccess] =
		useState<boolean>(false);

	const isValidEmail = (email: string) => {
		if (email.length === 0) {
			return false;
		}
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	const onSubmitEmail = async () => {
		const valid = isValidEmail(userEmail || '');
		if (!valid) {
			setEmailError('Please enter a valid email address');
		} else {
			setEmailError(undefined);
			setIsLoadingEmail(true);
			try {
				const successful = await props.onSubmitEmail(userEmail!);
				if (!successful) {
					setEmailError('Failed to register to mailing list');
				} else {
					setEmailRegistrationSuccess(true);
				}
				setIsLoadingEmail(false);
			} catch {
				// @todo handle API errors here
				console.error('API call failed');
				setIsLoadingEmail(false);
			}
		}
	};

	const onSubmitRegistration = async () => {
		setRegistrationError(undefined);
		setIsLoadingRegistration(true);

		try {
			await props.onSubmit(updateStatus);
			setHasSubmitted(true);
		} catch (e) {
			setRegistrationError(e);
			console.error(e);
		}

		setIsLoadingRegistration(false);
	};

	const onInputChange = (email: string) => {
		setUserEmail(email);
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
					{!isLoadingRegistration && (
						<>
							<p>
								Whitelisted members will have early access to the upcoming cribs
								drop. Sign up to the raffle with your wallet for a chance at
								joining the whitelist!
							</p>
							{registrationError && (
								<span className={styles.Error}>{registrationError}</span>
							)}
							{props.isWalletConnected && (
								<FutureButton
									glow
									className={styles.Button}
									onClick={onSubmitRegistration}
								>
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
					{isLoadingRegistration && (
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
					{!emailRegistrationSuccess && (
						<>
							<div className={styles.Email}>
								<p>
									Enter your email to be notified about the Wilder Cribs sale:
								</p>
								<TextInput
									className={styles.Input}
									onChange={onInputChange}
									placeholder={'Email Address'}
									text={userEmail}
								/>
							</div>
							{emailError && <span className={styles.Error}>{emailError}</span>}
							<FutureButton
								glow
								className={styles.Button}
								onClick={onSubmitEmail}
								loading={isLoadingEmail}
							>
								Submit
							</FutureButton>
						</>
					)}
					{emailRegistrationSuccess && (
						<>
							<br />
							<p className={styles.Success}>
								You have been added to our Cribs mail list!
							</p>
						</>
					)}
					<div className={styles.Socials}>
						<span>Follow our socials to get the latest info:</span>
						<div>
							<a
								href={'https://discord.com/invite/wilderworld'}
								target="_blank"
								rel="noreferrer"
							>
								<img src={iconDiscord} alt="discord" />
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
