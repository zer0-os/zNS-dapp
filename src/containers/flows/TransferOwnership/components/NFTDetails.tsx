//- Components Imports
import { Wizard, EtherInput, FutureButton } from 'components';

//- Constants Imports
import constants from '../TransferOwnership.constants';

//- Style Imports
import styles from '../TransferOwnership.module.scss';

type NFTDetailsProps = {
	image: string;
	creatorId: string;
	domainName: string;
	title: string;
	walletAddress: string;
	valid: boolean;
	setWalletAddress: (value: string) => void;
	onClose: () => void;
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
	onClose,
	onNext,
}: NFTDetailsProps) => (
	<>
		<Wizard.NFTDetails
			assetUrl={image}
			creator={creatorId}
			domain={domainName}
			title={title}
			// otherDetails={[
			// 	{
			// 		name: constants.OTHER_DETAILS_TITLES[Step.Details].PRIMARY,
			// 		value:
			// 			ethers.utils.formatEther(bidData.highestBid).toString() +
			// 			constants.CURRENCY.WILD,
			// 	},
			// ]}
		/>
		{/* REMOVE hard code and any unused style */}
		<div className={styles.InputWrapper}>
			<p>{constants.MESSAGES.ENTER_ADDRESS}</p>
			<div style={{ display: 'flex', width: '100%' }}>
				<div className={styles.Inputs}>
					<EtherInput
						ethlogo
						text={walletAddress}
						onChange={(text: string) => setWalletAddress(text)}
						placeholder="Ethereum Wallet"
						type="text"
					/>
				</div>
			</div>
		</div>

		<div className={styles.InputSubmitButton}>
			<FutureButton glow={valid} onClick={() => valid && onNext()}>
				Transfer
			</FutureButton>
		</div>
	</>
);

export default NFTDetails;
