import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { TextInput, ToggleButton } from 'components';
import { providers } from 'ethers';
import useCurrency from 'lib/hooks/useCurrency';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { Domain } from 'lib/types';
import React, { useState } from 'react';
import { TransactionWizard } from './TransactionWizard';
import styles from './TransactionWizard.module.scss';

interface SetBuyPriceWizardProps {
	domain: Domain;
	cancelHandler: () => void;
	successHandler: () => void;
}

export const SetBuyPriceWizard: React.FC<SetBuyPriceWizardProps> = ({
	domain,
	cancelHandler,
	successHandler,
}) => {
	///////////
	// State //
	///////////

	const sdk = useZnsSdk();

	const walletContext = useWeb3React<Web3Provider>();
	const { account, library } = walletContext;

	const provider = library && new providers.Web3Provider(library.provider);
	const signer = provider && provider.getSigner(account!);

	const [inputError, setInputError] = useState(false);
	const [currentValue, updateCurrentValue] = React.useState<string>('');
	const [isZero, setZero] = React.useState(false);

	const { wildPriceUsd } = useCurrency();

	///////////////
	// Functions //
	///////////////

	const handleChange = (value: string) => {
		updateCurrentValue(value);
	};

	const hadleSwitch = () => {
		setZero((prevValue) => !prevValue);
	};

	const setBuyPrice = async () => {
		if (isZero) {
			return await sdk.setBuyNowPrice(domain.id, signer!, '0');
		} else if (currentValue !== '') {
			return await sdk.setBuyNowPrice(domain.id, signer!, '0');
		}
		return;
	};

	/////////////////////
	// React Fragments //
	/////////////////////

	const zAuctionApproval = () => (
		<>
			Before you can set a buy now, your wallet needs to approve zAuction. This
			is a once-off transaction costing gas.
		</>
	);

	const setPriceInput = () => (
		<>
			<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<ToggleButton toggled={!isZero} onClick={hadleSwitch} /> Buy Now
			</div>
			<br />
			{isZero ? (
				''
			) : (
				<div>
					<TextInput
						numeric
						type="text"
						text={currentValue}
						placeholder="Buy Now Price (WILD)"
						onChange={handleChange}
						error={inputError}
						errorText={'Price can not be empty'}
					/>
					<div
						style={{ textAlign: 'left', paddingLeft: '24px' }}
						className={styles.Price}
					>
						<span>
							{currentValue
								? (Number(currentValue) * wildPriceUsd).toLocaleString(
										'en-US',
										{
											style: 'currency',
											currency: 'USD',
										},
								  )
								: '0.00 USD'}
						</span>
					</div>
				</div>
			)}
		</>
	);

	const confirm = () => (
		<>
			{isZero ? (
				<p>Are you sure you want to turn off the buy now for NFT Name?</p>
			) : (
				<p>
					Are you sure you want to set a buy now price of{' '}
					<b>{currentValue} WILD</b> for <b>NFT {domain.name}?</b>
				</p>
			)}
		</>
	);

	const success = () => (
		<p style={{ color: 'var(--color-success)' }}>Buy now set successfully</p>
	);

	return (
		<TransactionWizard
			name="Set Buy Now"
			domain={domain}
			cancelHandler={cancelHandler}
			successHandler={successHandler}
			rejectMessage={
				'You will lose your changes, a buy now price will not be added.'
			}
			steps={[
				{
					stepName: 'Approve',
					stepTemplate: 'approval',
					stepAdditionalData: zAuctionApproval,
					loadingMessage: 'Approving zAuction.',
					actions: {
						cancel: async () => undefined,
						next: () => sdk.approveZAuctionToSpendTokens(domain.id, signer!),
					},
				},
				{
					stepName: 'Set',
					stepTemplate: 'NFTPreview',
					stepAdditionalData: setPriceInput,
					actions: {
						cancel: async () => undefined,
						next: async () => {
							if (currentValue === '' && !isZero) {
								setInputError(true);
								throw new Error('no price provided');
							}
						},
					},
				},
				{
					stepName: 'Confirm',
					stepTemplate: 'NFTPreview',
					stepAdditionalData: confirm,
					loadingMessage: 'Setting buy now.',
					actions: {
						cancel: async () => undefined,
						next: setBuyPrice,
					},
				},
				{
					stepName: 'Success',
					stepTemplate: 'NFTPreview',
					stepAdditionalData: success,
					actions: {
						cancel: async () => undefined,
						next: async () => {},
					},
				},
			]}
		/>
	);
};

export default SetBuyPriceWizard;
