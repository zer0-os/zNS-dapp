//- Components Imports
import { Wizard, EtherInput, FutureButton } from 'components';
import { BUTTONS, INPUT, MESSAGES } from '../TransferOwnership.constants';

//- Type Imports
import { Step } from '../TransferOwnership.types';

//- Constants Imports

//- Style Imports
import styles from './NFTDetails.module.scss';

type NFTDetailsProps = {
	image: string;
	creatorId: string;
	domainName: string;
	title: string;
	walletAddress: string;
	valid: boolean;
	setWalletAddress: (value: string) => void;
	onNext: () => void;
};

const NFTDetails = ({
	image,
	creatorId,
	domainName,
	title,
	walletAddress,
	setWalletAddress,
	valid,
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
					/>
				</div>
			</div>
		</div>

		<div className={styles.InputSubmitButton}>
			<FutureButton glow={valid} onClick={() => valid && onNext()}>
				{BUTTONS[Step.Details].PRIMARY}
			</FutureButton>
		</div>
	</>
);

export default NFTDetails;
