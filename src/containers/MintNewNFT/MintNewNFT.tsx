//- React Imports
import React, { useState, useRef, useEffect } from 'react';

//- Context Imports
import useMint from 'lib/hooks/useMint';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Library Imports
import { randomName } from 'lib/Random';

//- Type Imports
import {
	TokenInformationType,
	TokenDynamicType,
	TokenStakeType,
} from './types';

//- Component Imports
import { StepBar } from 'components';
import TokenInformation from './sections/TokenInformation';
import TokenDynamics from './sections/TokenDynamics';
import Staking from './sections/Staking';
import Summary from './sections/Summary';

//- Style Imports
import styles from './MintNewNFT.module.css';

type MintNewNFTProps = {
	domainId: string; // Blockchain ID of the domain we're minting to
	domainName: string; // The name of the domain we're minting to, i.e. wilder.world
	onMint: () => void;
};

const MintNewNFT: React.FC<MintNewNFTProps> = ({
	domainId,
	domainName,
	onMint,
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
	const getTokenInformation = (data: TokenInformationType) => {
		setTokenInformation(data);
		setStep(2);
	};

	// Token Dynamics Page
	const [tokenDynamics, setTokenDynamics] = useState<TokenDynamicType | null>(
		null,
	);
	const getTokenDynamics = (data: TokenDynamicType) => {
		setTokenDynamics(data);
		setStep(3);
	};

	// Stake Page
	const [tokenStake, setTokenStake] = useState<TokenStakeType | null>(null);
	const getTokenStake = (data: TokenStakeType) => {
		setTokenStake(data);
		setStep(3);
	};

	//- Mint Context
	const { mint } = useMint();

	//- Page State
	const [step, setStep] = useState(1);

	const [containerHeight, setContainerHeight] = useState(0);
	useEffect(() => {
		const el = containerRef.current;
		if (el) {
			const child = el.children[0];
			if (child && child.clientHeight > 0)
				return setContainerHeight(child.clientHeight);
		}
	}, [step]);

	//- Web3 Wallet Data
	// MintNewNFT is a container and needs a bit more brainpower than your standard component
	// I think using Context API for account data here is worthwhile
	const context = useWeb3React<Web3Provider>();
	const { account } = context; // account = connected wallet ID

	//- Functions
	const toStep = (i: number) => {
		setStep(i);
	};
	const submit = () => {
		setIsMintLoading(true);
		if (!account) return setIsMintLoading(false);
		if (!tokenInformation || !tokenStake) return setIsMintLoading(false);

		const doSubmit = async () => {
			// Verify that all fields exist
			try {
				const hasSubmitMint = mint({
					parent: domainId,
					owner: account,
					name: tokenInformation.name,
					story: tokenInformation.story,
					image: tokenInformation.image,
					domain: tokenInformation.domain,
					zna: domainName,
					// @TODO Reimplement ticker when we enable dynamic tokens
					ticker:
						tokenDynamics && tokenDynamics.ticker ? tokenDynamics.ticker : '',
					dynamic:
						tokenDynamics && tokenDynamics.dynamic
							? tokenDynamics.dynamic
							: false,
					locked: tokenInformation.locked,
				});
				await hasSubmitMint;
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
					Mint "{name ? name : 'A New NFT'}"
				</h1>
				<div style={{ marginBottom: 8 }}>
					<h2 className={`glow-text-white`}>
						wilder.
						{domain && domain.length ? `${domainName.substring(1)}.` : ``}
						{domain}
					</h2>
				</div>
				<span>By {account && account.length ? randomName(account) : ''}</span>
			</div>
			<StepBar
				style={{ marginTop: 24 }}
				step={step}
				steps={['Details', 'Staking']}
				onNavigate={(i: number) => toStep(i)}
			/>
			{/* TODO: Make ToggleSections unclickable if their open status depends on parent state */}

			<div
				ref={containerRef}
				className={styles.Container}
				style={{ height: containerHeight }}
			>
				{/* SECTION 1: Token Information */}
				{step === 1 && (
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
				{step === 2 && (
					<Staking
						token={tokenStake}
						onContinue={(data: TokenStakeType) => getTokenStake(data)}
					/>
				)}

				{step === 3 && (
					<Summary
						token={tokenInformation}
						dynamic={tokenDynamics}
						staking={tokenStake}
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
