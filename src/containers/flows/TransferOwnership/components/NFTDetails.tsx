//- Components Imports
import { Wizard, EtherInput, FutureButton } from 'components';

//- Type Imports
import { Step } from '../TransferOwnership.types';

//- Constants Imports
import constants from '../TransferOwnership.constants';

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
			<p>{constants.MESSAGES.ENTER_ADDRESS}</p>
			<div>
				<div className={styles.Inputs}>
					<EtherInput
						ethlogo
						text={walletAddress}
						onChange={setWalletAddress}
						placeholder={constants.INPUT.TEXT_INPUT_PLACEHOLDER}
						type={constants.INPUT.TYPE}
					/>
				</div>
			</div>
		</div>

		<div className={styles.InputSubmitButton}>
			<FutureButton glow={valid} onClick={() => valid && onNext()}>
				{constants.BUTTONS[Step.Details].PRIMARY}
			</FutureButton>
		</div>
	</>
);

export default NFTDetails;
