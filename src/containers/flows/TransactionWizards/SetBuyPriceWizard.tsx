import { TextInput, ToggleButton } from 'components';
import { BigNumber } from 'ethers';
import { Domain } from 'lib/types';
import React, { useState } from 'react';
import { TransactionWizard } from './TransactionWizard';

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

	const numberRegexp = /\D/g;

	const [priceValue, setPriceValue] = useState('');
	const [newBuyPrice, setNewBuyPrice] = useState<BigNumber | undefined>();

	///////////////
	// Functions //
	///////////////

	const priceInputHandler = (text: string) => {
		setPriceValue(text.replace(numberRegexp, ''));
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
			<div>
				<ToggleButton toggled={true} onClick={() => {}} /> Buy Now
			</div>
			<br />
			<TextInput
				text={priceValue}
				placeholder="Buy Now Price (WILD)"
				onChange={priceInputHandler}
			/>
		</>
	);

	const confirm = () => (
		<>
			Are you sure you want to set a buy now price of <b>{newBuyPrice} WILD</b>{' '}
			for <b>NFT {domain.name}?</b>
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
			steps={[
				{
					stepName: 'Approve',
					stepTemplate: 'approval',
					stepAdditionalData: zAuctionApproval,
					actions: {
						cancel: async () => {},
						next: async () => {},
					},
				},
				{
					stepName: 'Set',
					stepTemplate: 'NFTPreview',
					stepAdditionalData: setPriceInput,
					actions: {
						cancel: async () => {},
						next: async () => {},
					},
				},
				{
					stepName: 'Confirm',
					stepTemplate: 'NFTPreview',
					stepAdditionalData: confirm,
					actions: {
						cancel: async () => {},
						next: async () => {},
					},
				},
				{
					stepName: 'Success',
					stepTemplate: 'NFTPreview',
					stepAdditionalData: success,
					actions: {
						cancel: async () => {},
						next: async () => {},
					},
				},
			]}
		/>
	);
};

export default SetBuyPriceWizard;
