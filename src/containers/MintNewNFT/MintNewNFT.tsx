//- React Imports
import React, { useState, useRef, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

//- Providers
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { useMintProvider } from 'lib/providers/MintProvider';

//- Type Imports
import {
	TokenInformationType,
	// TokenDynamicType,
	TokenStakeType,
} from './types';

//- Component Imports
import { StepBar } from 'components';
import TokenInformation from './sections/TokenInformation';
// import TokenDynamics from './sections/TokenDynamics';
import Staking from './sections/Staking';
import Summary from './sections/Summary';

//- Style Imports
import styles from './MintNewNFT.module.css';
import { rootDomainName } from 'lib/domains';

type MintNewNFTProps = {
	domainId: string; // Blockchain ID of the domain we're minting to
	domainName: string; // The name of the domain we're minting to, i.e. wilder.world
	domainOwner: string; // account that owns the domain we're minting to (parent)
	onMint: () => void;
};

enum MintState {
	DomainDetails,
	Staking,
	Summary,
}

const MintNewNFT: React.FC<MintNewNFTProps> = ({
	domainId,
	domainName,
	onMint,
	domainOwner,
}) => {
	// NOTE: The only domain data MintNewNFT needs is the domain ID
	// Token Data
	const [name, setName] = useState('');
	const [domain, setDomain] = useState('');
	const [isMintLoading, setIsMintLoading] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Token Information Page
	const [
		tokenInformation,
		setTokenInformation,
	] = useState<TokenInformationType | null>(null);

	// Token Dynamics Page
	// const [tokenDynamics, setTokenDynamics] = useState<TokenDynamicType | null>(
	// 	null,
	// );
	// const getTokenDynamics = (data: TokenDynamicType) => {
	// 	setTokenDynamics(data);
	// 	setStep(3);
	// };

	// Stake Page
	const [tokenStake, setTokenStake] = useState<TokenStakeType | null>(null);

	//- Mint / Staking Providers
	const mint = useMintProvider();
	const staking = useStakingProvider();

	//- Web3 Wallet Data
	// MintNewNFT is a container and needs a bit more brainpower than your standard component
	// I think using Context API for account data here is worthwhile
	const context = useWeb3React<Web3Provider>();
	const { account } = context; // account = connected wallet ID

	let isOwner = false;
	if (account) {
		isOwner = account.toLowerCase() === domainOwner.toLowerCase();
	}

	//- Page State
	const [step, setStep] = useState(MintState.DomainDetails);

	const [containerHeight, setContainerHeight] = useState(0);
	useEffect(() => {
		const el = containerRef.current;
		if (el) {
			const child = el.children[0];
			if (child && child.clientHeight > 0)
				return setContainerHeight(child.clientHeight);
		}
	}, [step, isMintLoading]);

	//- Functions
	const getTokenStake = (data: TokenStakeType) => {
		setTokenStake(data);
		setStep(MintState.Summary);
	};

	const getTokenInformation = (data: TokenInformationType) => {
		setTokenInformation(data);

		if (isOwner) {
			setStep(MintState.DomainDetails);
		} else {
			setStep(MintState.Staking);
		}
	};

	const submitMint = async () => {
		if (!account) return setIsMintLoading(false);
		if (!tokenInformation) return setIsMintLoading(false);

		const hasSubmitMint = mint.mint({
			parent: domainId,
			owner: account,
			name: tokenInformation.name,
			story: tokenInformation.story,
			image: tokenInformation.image,
			domain: tokenInformation.domain,
			zna: domainName,
			// @TODO Reimplement ticker when we enable dynamic tokens
			ticker: '',
			dynamic: false,
			locked: tokenInformation.locked,
		});

		return hasSubmitMint;
	};

	const submitRequest = async () => {
		if (!account) return setIsMintLoading(false);
		if (!tokenInformation) return setIsMintLoading(false);
		if (!tokenStake) return setIsMintLoading(false);

		const hasSubmitRequest = staking.placeRequest({
			nft: {
				parent: domainId,
				owner: account,
				name: tokenInformation.name,
				story: tokenInformation.story,
				image: tokenInformation.image,
				domain: tokenInformation.domain,
				zna: domainName,
				// @TODO Reimplement ticker when we enable dynamic tokens
				ticker: '',
				dynamic: false,
				locked: tokenInformation.locked,
			},
			requestor: account,
			stakeAmount: tokenStake.amount.toString(),
			stakeCurrency: tokenStake.currency,
		});

		return hasSubmitRequest;
	};

	const submit = () => {
		setIsMintLoading(true);

		const doSubmit = async () => {
			try {
				if (isOwner) {
					await submitMint();
				} else {
					await submitRequest();
				}

				onMint();
			} catch (e) {
				setIsMintLoading(false);
			}
		};

		doSubmit();
	};

	return (
		<div className={`${styles.MintNewNFT} blur border-rounded border-primary`}>
			{isMintLoading && <div className={styles.Blocker}></div>}
			{/* // TODO: Pull each section out into a seperate component */}
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>
					{isOwner ? 'Mint' : 'Request to Mint'} "{name ? name : 'A New NFT'}"
				</h1>
				<div style={{ marginBottom: 8 }}>
					<h2 className={`glow-text-white`}>
						0://{rootDomainName}.
						{domain && domain.length ? `${domainName.substring(1)}.` : ``}
						{domain}
					</h2>
				</div>
				<span>
					By{' '}
					{account && account.length
						? account.substring(0, 4) +
						  '...' +
						  account.substring(account.length - 4)
						: ''}
				</span>
			</div>
			<StepBar
				style={{ marginTop: 24 }}
				step={step + 1}
				steps={['Details', 'Stake']}
				onNavigate={(i: number) => setStep(i)}
			/>
			{/* TODO: Make ToggleSections unclickable if their open status depends on parent state */}

			<div
				ref={containerRef}
				className={styles.Container}
				style={{ height: containerHeight }}
			>
				{/* SECTION 1: Token Information */}
				{step === MintState.DomainDetails && (
					<TokenInformation
						token={tokenInformation}
						onContinue={(data: TokenInformationType) =>
							getTokenInformation(data)
						}
						setNameHeader={(name: string) => setName(name)}
						setDomainHeader={(domain: string) => setDomain(domain)}
					/>
				)}

				{/* SECTION 2: Token Dynamics */}
				{/* This section is currently disabled. When re-enabling make sure to fix the step counter */}
				{/* {step === 2 && (
					<TokenDynamics
						token={tokenDynamics}
						onBack={() => toStep(1)}
						onContinue={(data: TokenDynamicType) => getTokenDynamics(data)}
					/>
				)} */}

				{/* SECTION 3: Staking */}
				{step === MintState.Staking && (
					<Staking
						token={tokenStake}
						onContinue={(data: TokenStakeType) => getTokenStake(data)}
					/>
				)}

				{step === MintState.Summary && (
					<Summary
						token={tokenInformation}
						// dynamic={}
						// staking={tokenStake}
						onContinue={submit}
						isMintLoading={isMintLoading}
						domain={domainName}
					/>
				)}
			</div>
		</div>
	);
};

export default MintNewNFT;
