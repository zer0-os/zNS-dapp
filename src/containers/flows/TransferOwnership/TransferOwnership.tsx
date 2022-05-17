//- React Imports
import { useEffect, useRef, useState } from 'react';

//- Global Component Imports
import { Overlay, Wizard } from 'components';

//- Transfer Ownership Imports
import NFTDetails from './components/NFTDetails';

//- Type Imports
import { Step } from './TransferOwnership.types';

//- Constant Imports
import { BUTTONS, MESSAGES, STEP_TITLES } from './TransferOwnership.constants';
import { ROOT_DOMAIN } from 'constants/domains';

//- Utils Imports
import { isValid } from './TransferOwnership.utils';

//- Library Imports
import { useTransfer } from 'lib/hooks/useTransfer';

export type TransferOwnershipProps = {
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
	const [inputError, setInputError] = useState<string>('');
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);

	// Prevent state update to unmounted component
	const isMounted = useRef(false);

	// Providers
	const { transferRequest } = useTransfer();

	// Input Error Conditions
	const isOwnersAddress = ownerId.toLowerCase() === walletAddress.toLowerCase();
	const hasInputError = inputError !== '';
	const valid = isValid(walletAddress);
	const zna = (ROOT_DOMAIN.length ? ROOT_DOMAIN + '.' : '') + domainName;

	///////////////
	// Functions //
	///////////////
	const onClose = () => onTransfer();
	const onNext = () => {
		setCurrentStep(Step.Confirmation);
	};

	const onAccept = () => {
		if (valid && !isOwnersAddress) {
			onNext();
		} else if (valid && isOwnersAddress) {
			setInputError(MESSAGES.REQUEST_ADDRESS_NOT_VALID_ERROR);
		} else setInputError(MESSAGES.REQUEST_INVALID_ADDRESS);
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
			setError(MESSAGES.TRANSACTION_ERROR);
		}
		if (!isMounted.current) return;
		setIsLoading(false);
	};

	/////////////
	// Effects //
	/////////////
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	});

	const steps = {
		[Step.Details]: (
			<NFTDetails
				creatorId={creatorId}
				domainName={zna}
				title={name}
				image={image}
				walletAddress={walletAddress}
				hasError={hasInputError}
				errorText={inputError}
				setWalletAddress={setWalletAddress}
				onNext={onAccept}
			/>
		),
		[Step.Confirmation]: isLoading ? (
			<Wizard.Loading
				message={MESSAGES.TEXT_CONFIRMATION}
				subtext={MESSAGES.TEXT_ACCEPT_PROMPT}
			/>
		) : (
			<Wizard.Confirmation
				error={error}
				message={MESSAGES.TEXT_CONFIRMATION}
				primaryButtonText={BUTTONS[Step.Confirmation].PRIMARY}
				onClickPrimaryButton={submitTransfer}
				secondaryButtonText={BUTTONS[Step.Confirmation].SECONDARY}
				onClickSecondaryButton={onClose}
			/>
		),
	};

	return (
		<Overlay centered open onClose={onClose}>
			<Wizard header={STEP_TITLES[currentStep]}>{steps[currentStep]}</Wizard>
		</Overlay>
	);
};

export default TransferOwnership;
