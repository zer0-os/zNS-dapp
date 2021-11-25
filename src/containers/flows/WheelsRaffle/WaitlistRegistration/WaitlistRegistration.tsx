import { useState } from 'react';
import { FutureButton, Spinner, TextInput } from 'components';
import styles from './WaitlistRegistration.module.scss';
import { isValidEmail } from './validation';

import iconDiscord from '../assets/discord.png';
import iconTwitter from '../assets/twitter.png';

type WaitlistRegistrationProps = {
	hasSubmitted: boolean;
	onSubmit: (email: string) => Promise<boolean>;
};

const WaitlistRegistration = (props: WaitlistRegistrationProps) => {
	const [userEmail, setUserEmail] = useState<string | undefined>();
	const [error, setError] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onInputChange = (email: string) => {
		setUserEmail(email);
	};

	const onSubmit = async () => {
		const valid = isValidEmail(userEmail || '');
		if (!valid) {
			setError('Please enter a valid email address');
		} else {
			setError(undefined);
			setIsLoading(true);
			try {
				const successful = await props.onSubmit(userEmail!);
				if (!successful) {
					setError('Failed to register to mailing list');
					setIsLoading(false);
				}
			} catch {
				// @todo handle API errors here
				console.error('API call failed');
				setIsLoading(false);
			}
		}
	};

	return (
		<div className={`${styles.Container} border-primary border-rounded`}>
			<section className={styles.Header}>
				<h1 className="glow-text-white">Guarantee Your Crib</h1>
				<hr />
			</section>
			{!props.hasSubmitted && (
				<section>
					<label className={styles.Label}>
						Enter your email to be notified about the Wilder Cribs raffle:
					</label>
					{!isLoading && (
						<>
							<TextInput
								className={styles.Input}
								onChange={onInputChange}
								placeholder={'Email Address'}
								text={userEmail}
							/>
							{error && <span className={styles.Error}>{error}</span>}
							<FutureButton glow className={styles.Button} onClick={onSubmit}>
								Continue
							</FutureButton>
						</>
					)}
					{isLoading && (
						<div className={styles.Loading}>
							<span>Submitting email</span>
							<Spinner />
						</div>
					)}
				</section>
			)}
			{props.hasSubmitted && (
				<>
					<p className={styles.Success}>
						You’ve been added to our mailing list.
					</p>
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

export default WaitlistRegistration;
