//- Components Imports
import { Wizard, EtherInput, FutureButton } from 'components';

//- Type Imports
import { Step } from '../TransferOwnership.types';

//- Constants Imports
import { BUTTONS, INPUT, MESSAGES } from '../TransferOwnership.constants';

//- Style Imports
import styles from './NFTDetails.module.scss';

type NFTDetailsProps = {
	image: string;
	creatorId: string;
	domainName: string;
	title: string;
	walletAddress: string;
	hasError: boolean;
	errorText: string;
	setWalletAddress: (value: string) => void;
	onNext: () => void;
};

const NFTDetails = ({
	image,
	creatorId,
	domainName,
	title,
	walletAddress,
	hasError,
	errorText,
	setWalletAddress,
	onNext,
}: NFTDetailsProps) => (
	<>
		<Wizard.NFTDetails
			assetUrl={image}
			creator={creatorId}
			domain={domainName}
			title={title}
		/>
		<div className={styles.InputWrapper}>
			<p>{MESSAGES.ENTER_ADDRESS}</p>
			<div>
				<div className={styles.Inputs}>
					<EtherInput
						ethlogo
						text={walletAddress}
						onChange={setWalletAddress}
						placeholder={INPUT.TEXT_INPUT_PLACEHOLDER}
						type={INPUT.TYPE}
						error={hasError}
						errorText={errorText}
					/>
				</div>
			</div>
		</div>

		<div className={styles.InputSubmitButton}>
			<FutureButton glow onClick={onNext}>
				{BUTTONS[Step.Details]}
			</FutureButton>
		</div>
	</>
);

export default NFTDetails;
