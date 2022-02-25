import { useState } from 'react';
import { FutureButton, Spinner, TextInput } from 'components';
import styles from './RaffleRegistration.module.scss';
import { ConnectWalletButton } from 'containers';

import iconDiscord from '../assets/discord.png';
import iconTwitter from '../assets/twitter.png';
import useCurrency from 'lib/hooks/useCurrency';
import { formatByDecimalPlace, formatNumber } from 'lib/utils';
import { ethers } from 'ethers';
import { ethTokenPrice } from 'lib/tokenPrices';

type RaffleRegistrationProps = {
	isWalletConnected: boolean;
	account: string | undefined;
	drop: string | undefined;
	onSubmit: (statusCallback: (status: string) => void) => Promise<void>;
	onSubmitEmail: (email: string) => Promise<boolean>;
	closeOverlay: () => void;
};

enum Steps {
	AboutRaffle,
	WalletAddress,
	CurrentBalances,
	PersonalInfo,
	FollowSocial,
}

const RaffleRegistration = (props: RaffleRegistrationProps) => {
	const { wildPriceUsd } = useCurrency();

	// Raffle entry
	const [status, setStatus] = useState<string | undefined>();
	const [registrationError, setRegistrationError] = useState<
		string | undefined
	>();
	const [isLoadingRegistration, setIsLoadingRegistration] =
		useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	// Email submission
	// const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
	const [userEmail, setUserEmail] = useState<string | undefined>();
	const [emailError, setEmailError] = useState<string | undefined>();
	// const [emailRegistrationSuccess, setEmailRegistrationSuccess] =
	// 	useState<boolean>(false);

	const [firstName, setFirstName] = useState<string | undefined>();
	const [lastName, setLastName] = useState<string | undefined>();
	const [twitter, setTwitter] = useState<string | undefined>();
	const [discord, setDiscord] = useState<string | undefined>();
	const [telegram, setTelegram] = useState<string | undefined>();
	const [balances, setBalances] = useState<any | undefined>();
	const [ethPriceUsd, SetEthPriceUsd] = useState<number>();
	const validationCriteria: any = {
		eth: '0',
		wild: '0',
		nft: 0,
	};

	const [hasSufficientBalance, setHasSufficientBalance] = useState<any>({
		eth: true,
		wild: true,
		nft: true,
	});

	const [step, setStep] = useState<Steps>(Steps.AboutRaffle);

	const isValidEmail = (email: string) => {
		if (email.length === 0) {
			return false;
		}
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	const onSubmitEmail = async () => {
		// const valid = isValidEmail(userEmail || '');
		const valid = true;
		if (!valid) {
			setEmailError('Please enter a valid email address');
		} else {
			setIsLoadingRegistration(true);
			updateStatus(
				'Please sign transaction in your wallet to be entered in the raffle...',
			);
			setEmailError(undefined);
			// setIsLoadingEmail(true);
			try {
				await props.onSubmit({
					...balances,
					email: userEmail,
					firstName,
					lastName,
					twitter,
					discord,
					telegram,
				});

				// TODO: Disable adding email to mailchimp mail list
				// const successful = await props.onSubmitEmail(userEmail!);
				// if (!successful) {
				// 	setEmailError('Failed to register to mailing list');
				// } else {
				// 	setStep(Steps.FollowSocial);
				// 	setIsLoadingRegistration(false);
				// 	// setEmailRegistrationSuccess(true);
				// }
				// setIsLoadingEmail(false);
				setStep(Steps.FollowSocial);
				setIsLoadingRegistration(false);
			} catch (e: any) {
				// @todo handle API errors here
				setEmailError(e?.message || 'Failed to register to mailing list');
				console.error('API call failed');
				setIsLoadingRegistration(false);
				// setIsLoadingEmail(false);
			}
		}
	};

	const checkBalanceEligibility = async () => {
		setIsLoadingRegistration(true);

		updateStatus('Checking your balance for eligibility');
		const ethPrice = await ethTokenPrice();
		SetEthPriceUsd(ethPrice);

		try {
			const response = await fetch(
				`https://raffle-entry-microservice.herokuapp.com/balances/${props.account}/${props.drop}`,
				// `https://raffle-entry-microservice.herokuapp.com/balances/0x9d79cD0605346f0Fa649D0EEE1DdB3c360aeb038/${props.drop}`,
				{
					method: 'GET',
				},
			);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}
			setHasSufficientBalance({
				eth: ethers.utils
					.parseEther(data.ethBalance)
					.gte(ethers.utils.parseEther(validationCriteria.eth)),
				wild: ethers.utils
					.parseEther(data.wildBalance)
					.gte(ethers.utils.parseEther(validationCriteria.wild)),
				nft: data.nftsCount >= validationCriteria.nft,
			});
			setBalances(data);
			// NOTE: Skip CurrentBalances step entirely and navigate to PersonalInfo Step
			// setStep(Steps.CurrentBalances);

			setStep(Steps.PersonalInfo);
		} catch (err: any) {
			setRegistrationError(err?.message || `Failed to fetch wallet details`);
			console.error(err);
		} finally {
			setIsLoadingRegistration(false);
		}
	};

	const onSubmitRegistration = async () => {
		setRegistrationError(undefined);
		setIsLoadingRegistration(true);

		try {
			await props.onSubmit(updateStatus);
			setHasSubmitted(true);
			setStep(Steps.WalletAddress);
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

	const onSubmitWalletAddress = async () => {};

	const aboutRaffle = () => {
		return (
			<>
				<p>
					Mintlisted members will have early access to the upcoming Pets drop.
					Sign up to the raffle with your wallet for a chance at joining the
					mintlist! <br />
					<br />
					{/* The minimum requirement is your wallet address, but if you would like
					us to be able to communicate directly with you, and increase your
					chance of securing a spot, you can provide us with more detail. */}
				</p>
				{registrationError && (
					<span className={styles.Error}>{registrationError}</span>
				)}
				{props.isWalletConnected && (
					<FutureButton
						glow
						className={styles.Button}
						onClick={checkBalanceEligibility}
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
		);
	};

	const walletAddress = () => {
		return (
			<>
				<p>Start by entering your ETH wallet address</p>
				<div className={styles.Email}>
					<TextInput
						className={styles.Input}
						onChange={onInputChange}
						disabled={true}
						placeholder={'ETH Address'}
						text={props?.account}
					/>
				</div>
				<FutureButton
					glow
					className={styles.Button}
					onClick={onSubmitWalletAddress}
				>
					Continue
				</FutureButton>
			</>
		);
	};

	const getValidationError = () => {
		let messages = [];
		for (const key in validationCriteria) {
			if (!hasSufficientBalance[key]) {
				messages.push(
					validationCriteria[key] +
						' ' +
						key.toUpperCase() +
						(key === 'nft' && validationCriteria[key] > 1 ? 's' : ''),
				);
			}
		}
		if (messages.length > 1) {
			const last = messages.pop();
			return messages.join(', ') + ' and ' + last;
		} else {
			return messages.join(', ');
		}
	};

	const currentBalances = () => {
		return (
			<>
				<p>Your current balances</p>
				<div className={styles.Balances}>
					<div className={styles.eachBalances}>
						<div>WILD</div>
						<div
							className={`${
								!hasSufficientBalance.wild ? styles.ErrorColor : ''
							} ${styles.amount}`}
						>
							{formatByDecimalPlace(balances?.wildBalance || 0, 2)}
						</div>
						<div>
							{'$' +
								formatNumber(wildPriceUsd * Number(balances?.wildBalance || 0))}
						</div>
					</div>

					<div className={styles.eachBalances}>
						<div> ETH</div>
						<div
							className={`${
								!hasSufficientBalance.eth ? styles.ErrorColor : ''
							} ${styles.amount}`}
						>
							{formatByDecimalPlace(balances?.ethBalance || 0, 2)}
						</div>
						<div>
							{'$' +
								formatNumber(
									(ethPriceUsd || 2400) * Number(balances?.ethBalance || 0),
								)}
						</div>
					</div>
					<div className={styles.eachBalances}>
						<div>Wilder NFT</div>
						<div
							className={`${
								!hasSufficientBalance.nft ? styles.ErrorColor : ''
							} ${styles.amount}`}
						>
							{balances?.nftsCount || 0}
						</div>
						{/* <div>$456.00</div> */}
					</div>
				</div>

				{hasSufficientBalance.eth &&
				hasSufficientBalance.wild &&
				hasSufficientBalance.nft ? (
					<p className={styles.Success}>
						Your balances meet the requirements for entry!
					</p>
				) : (
					<p className={`${styles.Error} ${styles.marginTop40}`}>
						You need at least <strong>{getValidationError()}</strong> to meet
						the requirements for entry
					</p>
				)}
				<FutureButton
					glow
					className={styles.Button}
					disabled={
						!(
							hasSufficientBalance.eth &&
							hasSufficientBalance.wild &&
							hasSufficientBalance.nft
						)
					}
					onClick={() => setStep(Steps.PersonalInfo)}
				>
					Continue
				</FutureButton>
			</>
		);
	};

	const personalInfoInputChange = (type: string, val: string) => {
		switch (type) {
			case 'firstName':
				setFirstName(val);
				break;
			case 'lastName':
				setLastName(val);
				break;
			case 'twitter':
				setTwitter(val);
				break;
			case 'discord':
				setDiscord(val);
				break;
			case 'telegram':
				setTelegram(val);
				break;
			default:
				break;
		}
	};

	const personalInfo = () => {
		return (
			<>
				<p>
					Please add some additional personal info. Providing additional
					optional information helps us resolve questions or conflicts that may
					prevent your entry from being counted. We recognize this reduces
					anonymity, but it helps us reduce bots and keep things fair! Any
					attempt to game the system for multiple entries will result in entries
					being disqualified.
				</p>
				<div className={styles.PersonalInfo}>
					<div className={styles.CombinedFirstAndLastFields}>
						<div className={`${styles.Email} ${styles.firstName}`}>
							<TextInput
								className={styles.Input}
								onChange={(val) => personalInfoInputChange('firstName', val)}
								placeholder={'First Name'}
								text={firstName}
							/>
						</div>
						<div className={styles.Email}>
							<TextInput
								className={styles.Input}
								onChange={(val) => personalInfoInputChange('lastName', val)}
								placeholder={'Last Name'}
								text={lastName}
							/>
						</div>
					</div>
					<div className={styles.Email}>
						<TextInput
							className={styles.Input}
							onChange={onInputChange}
							placeholder={'Email Address'}
							text={userEmail}
						/>
						{/* {emailError && (
							<span className={styles.emailError}>{emailError}</span>
						)} */}
					</div>
					<div className={styles.Email}>
						<TextInput
							className={styles.Input}
							onChange={(val) => personalInfoInputChange('twitter', val)}
							placeholder={'Twitter'}
							text={twitter}
						/>
					</div>
					<div className={styles.Email}>
						<TextInput
							className={styles.Input}
							onChange={(val) => personalInfoInputChange('discord', val)}
							placeholder={'Discord ID'}
							text={discord}
						/>
					</div>
					<div className={styles.Email}>
						<TextInput
							className={styles.Input}
							onChange={(val) => personalInfoInputChange('telegram', val)}
							placeholder={'Telegram'}
							text={telegram}
						/>
					</div>
				</div>
				{emailError && <span className={styles.Error}>{emailError}</span>}
				<FutureButton glow className={styles.Button} onClick={onSubmitEmail}>
					Continue
				</FutureButton>
			</>
		);
	};

	const followSocial = () => {
		return (
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
				<FutureButton
					glow
					className={styles.Button}
					onClick={props.closeOverlay}
				>
					Finish
				</FutureButton>
			</>
		);
	};

	const stepNode = () => {
		switch (step) {
			case Steps.AboutRaffle:
				return <>{aboutRaffle()}</>;
			case Steps.WalletAddress:
				return <>{walletAddress()}</>;
			case Steps.CurrentBalances:
				return <>{currentBalances()}</>;
			case Steps.PersonalInfo:
				return <>{personalInfo()}</>;
			case Steps.FollowSocial:
				return <>{followSocial()}</>;
			default:
				return 'error';
		}
	};

	return (
		<div className={`${styles.Container} border-primary border-rounded`}>
			<section className={styles.Header}>
				<h1 className="glow-text-white">Join The Mintlist Raffle</h1>
				<hr />
			</section>
			<section>
				{!isLoadingRegistration && <>{stepNode()}</>}
				{isLoadingRegistration && (
					<div className={styles.Loading}>
						<span>{status || 'Loading'}</span>
						<Spinner />
					</div>
				)}
			</section>
			{/* {!hasSubmitted && (
				<section>
					{!isLoadingRegistration && <>{stepNode()}</>}
					{isLoadingRegistration && (
						<div className={styles.Loading}>
							<span>{status || 'Loading'}</span>
							<Spinner />
						</div>
					)}
				</section>
			)}
			{hasSubmitted && (
				<section>
					{!isLoadingRegistration && <>{stepNode()}</>}
					{isLoadingRegistration && (
						<div className={styles.Loading}>
							<span>{status || 'Loading'}</span>
							<Spinner />
						</div>
					)}
				</section>
			)} */}
		</div>
	);
};

export default RaffleRegistration;
