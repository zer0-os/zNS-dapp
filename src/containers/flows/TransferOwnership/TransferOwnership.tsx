import React, { useState } from 'react';

//- Style Imports
import styles from './TransferOwnership.module.css';

//- Component Imports
import {
	EtherInput,
	FutureButton,
	NFTMedia,
	Overlay,
	Member,
} from 'components';

//- Library Imports
/*
import { getMetadata } from 'lib/metadata';
*/
import { randomImage, randomName } from 'lib/Random';
import { useTransferProvider } from 'lib/providers/TransferProvider';

type TransferOwnershipProps = {
	name: string;
	image: string;
	domainName: string;
	domainId: string;
	creatorId: string;
	ownerId: string;
	onTransfer: () => void;
};

const TransferOwnership: React.FC<TransferOwnershipProps> = ({
	image,
	name,
	domainName,
	domainId,
	creatorId,
	ownerId,
	onTransfer,
}) => {
	// State
	const [walletAddress, setWalletAddress] = useState('');
	const [hasAccepted, setHasAccepted] = useState(false); // Toggle confirmation overlay
	const [isLoading, setIsLoading] = useState(false);

	// Provider
	const { transferRequest } = useTransferProvider();

	// Form validation
	const isEthAddress = (text: string) =>
		/^0x[a-fA-F0-9]{40}$/.test(String(text).toLowerCase());
	const valid = isEthAddress(walletAddress);

	const accept = () => setHasAccepted(true);
	const cancel = () => setHasAccepted(false);

	const submitTransfer = async () => {
		setIsLoading(true);

		try {
			await transferRequest({
				name,
				image,
				domainName,
				domainId,
				ownerId,
				creatorId,
				walletAddress,
			});

			onTransfer();
		} catch (err) {}
		setIsLoading(false);
	};

	return (
		<div>
			{/* Confirmation Overlay */}
			<Overlay centered open={hasAccepted} onClose={() => {}}>
				<div
					className={`${styles.Confirmation} blur border-primary border-rounded`}
				>
					<h2 className="glow-text-white">Are You Sure?</h2>
					<hr className="glow" />
					<p>
						This transaction is about to be seared upon the Blockchain. There’s
						no going back.
					</p>
					{isLoading && <p>Transaction pending user confirmation.</p>}
					<div className={styles.Buttons}>
						{!isLoading && (
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								alt
								glow
								onClick={cancel}
							>
								Cancel
							</FutureButton>
						)}
						<FutureButton
							style={{ textTransform: 'uppercase' }}
							glow
							loading={isLoading}
							onClick={submitTransfer}
						>
							Transfer
						</FutureButton>
					</div>
				</div>
			</Overlay>

			<Overlay open={!hasAccepted} onClose={() => onTransfer()}>
				<div
					className={`${styles.TransferOwnership} blur border-rounded border-primary`}
				>
					<div className={styles.Header}>
						<h1 className={`glow-text-white`}>Transfer Ownership</h1>
					</div>

					<hr className="glow" />

					<div
						className={styles.Section}
						style={{ display: 'flex', padding: '0 37.5px' }}
					>
						<div className={styles.NFT}>
							<NFTMedia alt="Bid NFT preview" ipfsUrl={image} size="small" />
						</div>

						<div className={styles.Details}>
							<h2 className="glow-text-white">{name}</h2>
							<span>
								{domainName.length > 0
									? `0://wilder.${domainName.substring(1)}`
									: ''}
							</span>

							<div className={styles.Price}>
								<div>Current Price</div>
								<span className="glow-text-white">W1.56 </span>
								<span className="glow-text-white">($8000)</span>
							</div>
							<Member
								id={creatorId}
								name={randomName(creatorId)}
								image={randomImage(creatorId)}
								subtext={'Creator'}
							/>
						</div>
					</div>

					<div className={styles.InputWrapper}>
						<p className="glow-text-blue">
							Enter the wallet address to transfer to
						</p>
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

					<FutureButton
						glow={valid}
						style={{
							height: 36,
							borderRadius: 18,
							textTransform: 'uppercase',
							margin: '0 auto',
						}}
						onClick={() => valid && accept()}
					>
						Transfer
					</FutureButton>
				</div>
			</Overlay>
		</div>
	);
};

export default TransferOwnership;
