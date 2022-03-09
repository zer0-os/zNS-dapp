//- React Imports
import { useState } from 'react';

//- Global Component Imports
import { Overlay, Wizard } from 'components';

//- Transfer Ownership Imports
import NFTDetails from './components/NFTDetails';

//- Type Imports
import { Step } from './TransferOwnership.types';

//- Constant Imports
import constants from './TransferOwnership.constants';

//- Utils Imports
import { isValid } from './TransferOwnership.utils';

//- Library Imports
import { useTransfer } from 'lib/hooks/useTransfer';

type TransferOwnershipProps = {
	name: string;
	image: string;
	domainName: string;
	domainId: string;
	creatorId: string;
	ownerId: string;
	onTransfer: () => void;
};

const TransferOwnership = ({
	image,
	name,
	domainName,
	domainId,
	creatorId,
	ownerId,
	onTransfer,
}: TransferOwnershipProps) => {
	//////////////////
	// State & Data //
	//////////////////
	const [walletAddress, setWalletAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [stepTitle, setStepTitle] = useState<string>(
		constants.TITLES[Step.Details].PRIMARY,
	);

	// Providers
	const { transferRequest } = useTransfer();

	///////////////
	// Functions //
	///////////////
	const valid = isValid(walletAddress);
	const onClose = () => onTransfer();
	const onAccept = () => {
		setCurrentStep(Step.Confirmation);
		setStepTitle(constants.TITLES[Step.Confirmation].PRIMARY);
	};

	const submitTransfer = async () => {
		setIsLoading(true);
		setError(undefined);
		try {
			await transferRequest({
				name,
				image,
				domainName,
				domainId,
				ownerId,
				creatorId,
				walletAddress,
				onClose,
			});
		} catch (e) {
			setError(constants.MESSAGES.TRANSACTION_ERROR);
		}
		setIsLoading(false);
	};

	const steps = {
		[Step.Details]: (
			<NFTDetails
				creatorId={creatorId}
				domainName={domainName}
				title={name}
				image={image}
				valid={valid}
				walletAddress={walletAddress}
				setWalletAddress={setWalletAddress}
				onNext={() => valid && onAccept()}
				onClose={onClose}
			/>
		),
		[Step.Confirmation]: isLoading ? (
			<Wizard.Loading
				message={constants.MESSAGES.TEXT_CONFIRMATION}
				subtext={constants.MESSAGES.TEXT_ACCEPT_PROMPT}
			/>
		) : (
			<Wizard.Confirmation
				error={error}
				message={constants.MESSAGES.TEXT_CONFIRMATION}
				primaryButtonText={constants.BUTTONS[Step.Confirmation].PRIMARY}
				onClickPrimaryButton={submitTransfer}
				secondaryButtonText={constants.BUTTONS[Step.Confirmation].SECONDARY}
				onClickSecondaryButton={onClose}
			/>
		),
	};

	return (
		<Overlay centered open onClose={onClose}>
			<Wizard header={stepTitle}>{steps[currentStep]}</Wizard>
		</Overlay>
	);
};

export default TransferOwnership;
