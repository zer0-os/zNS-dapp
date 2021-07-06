//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache'; // Domain data
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Component Imports
import { ArrowLink, FutureButton, Member, Image, Overlay } from 'components';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';
import useNotification from 'lib/hooks/useNotification';
import { getBidsForNft } from 'lib/zAuction';

//- Style Imports
import styles from './NFTView.module.css';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';
import copyIcon from './assets/copy-icon.svg';
import { Maybe } from 'true-myth';
import { DisplayParentDomain } from 'lib/types';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { BigNumber } from 'ethers';
import { useZnsContracts } from 'lib/contracts';

type NFTViewProps = {
	domain: string;
	onEnlist: () => void;
};

const NFTView: React.FC<NFTViewProps> = ({ domain, onEnlist }) => {
	// TODO: NFT page data shouldn't change before unloading - maybe deep copy the data first

	//- Notes:
	// It's worth having this component consume the domain context
	// because it needs way more data than is worth sending through props

	const { addNotification } = useNotification();

	//- Page State
	const [zna, setZna] = useState('');
	const [image, setImage] = useState<string>(''); // Image from metadata url
	const [name, setName] = useState<string>(''); // Name from metadata url
	const [description, setDescription] = useState<string>(''); // Description from metadata url
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);

	//- Web3 Domain Data
	const { useDomain } = useDomainCache();
	const domainContext = useDomain(domain.substring(1));
	const data: Maybe<DisplayParentDomain> = domainContext.data;

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';
	const domainId = data.isNothing()
		? ''
		: BigNumber.from(data.value.id).toString();
	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainId}`;

	//- Functions
	const copyContractToClipboard = () => {
		addNotification('Copied address to clipboard.');
		navigator.clipboard.writeText(domainId);
	};

	useEffect(() => {
		if (!data.isNothing() && data.value.metadata && !data.value.image) {
			setIsOwnedByYou(data.value.owner.id === account);

			// Get bid data
			// @durien
			const nftId = '???';
			getBidsForNft(nftId);

			// Get metadata
			fetch(data.value.metadata).then(async (d: Response) => {
				const nftData = await d.json();
				setZna(domain);
				setImage(nftData.image);
				setName(nftData.title || nftData.name);
				setDescription(nftData.description);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<div className={styles.NFTView}>
			<Overlay
				centered
				img
				open={isImageOverlayOpen}
				onClose={() => setIsImageOverlayOpen(false)}
			>
				<Image
					src={image}
					style={{
						width: 'auto',
						maxHeight: '80vh',
						maxWidth: '80vw',
						objectFit: 'contain',
						textAlign: 'center',
					}}
				/>
			</Overlay>

			<div
				className={`${styles.NFT} blur border-primary border-rounded`}
				style={{ backgroundImage: `url(${galaxyBackground})` }}
			>
				<div className={`${styles.Image} border-rounded`}>
					<Image
						style={{
							height: 422,
							borderRadius: 10,
							borderWidth: 2,
						}}
						className="border-primary border-radius"
						src={image}
						onClick={() => setIsImageOverlayOpen(true)}
					/>
				</div>
				<div className={styles.Info}>
					<div>
						<h1 className="glow-text-white">{name}</h1>
						<span>
							{zna.length > 0 ? `0://wilder.${zna.substring(1)}` : ''}
						</span>
						<div className={styles.Members}>
							<Member
								id={!data.isNothing() ? data.value.owner.id : ''}
								name={!data.isNothing() ? randomName(data.value.owner.id) : ''}
								image={
									!data.isNothing() ? randomImage(data.value.owner.id) : ''
								}
								subtext={'Owner'}
							/>
							<Member
								id={!data.isNothing() ? data.value.minter.id : ''}
								name={!data.isNothing() ? randomName(data.value.minter.id) : ''}
								image={
									!data.isNothing() ? randomImage(data.value.minter.id) : ''
								}
								subtext={'Creator'}
							/>
						</div>
					</div>
					{/* Price data doesn't exist yet */}
					{/* <div className={styles.Price}>
						<span className={styles.Crypto}>
							{Number(2521).toLocaleString()} WILD{' '}
							<span className={styles.Fiat}>
								(${Number(1304.12).toLocaleString()})
							</span>
						</span>
					</div> */}
					<div className={styles.Buttons}>
						<FutureButton
							glow={isOwnedByYou}
							onClick={() => {}}
							style={{ height: 36, borderRadius: 18 }}
						>
							Transfer Ownership
						</FutureButton>
						<FutureButton
							glow={!isOwnedByYou}
							onClick={onEnlist}
							style={{ height: 36, borderRadius: 18 }}
						>
							WAITLIST
						</FutureButton>
					</div>
				</div>
			</div>
			<div className={styles.Horizontal} style={{ marginTop: 20 }}>
				<div
					className={`${styles.Box} ${styles.Story} blur border-primary border-rounded`}
				>
					<h4>Story</h4>
					<p>{description}</p>
				</div>
				{/* <div className={styles.Horizontal}>
						<div className={`${styles.Box} blur border-primary border-rounded`}>
							<h4>Views</h4>
							<span className="glow-text-white">
								{Number(1000).toLocaleString()}
							</span>
						</div>
						<div className={`${styles.Box} blur border-primary border-rounded`}>
							<h4>Edition</h4>
							<span className="glow-text-white">
								{Number(1).toLocaleString()} of {Number(1).toLocaleString()}
							</span>
						</div>
					</div> */}
				<div
					className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
				>
					<h4>Token Id</h4>
					<p className="glow-text-white">
						<img
							onClick={copyContractToClipboard}
							className={styles.Copy}
							src={copyIcon}
							alt={'Copy Contract Icon'}
						/>
						{domainId}
					</p>
					<ArrowLink
						style={{
							marginTop: 8,
							width: 140,
							fontWeight: 700,
						}}
						href={etherscanLink}
					>
						View on Etherscan
					</ArrowLink>
				</div>
			</div>
			<div></div>
		</div>
	);
};

export default NFTView;
