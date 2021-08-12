//- React Imports
import React, { useState, useRef, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

//- Providers
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { useMintProvider } from 'lib/providers/MintProvider';
import { useZnsContracts } from 'lib/contracts';

//- Type Imports
import { ERC20 } from 'types';
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
import { rootDomainName } from 'lib/utils/domains';

type MintNewNFTProps = {
	domainId: string; // Blockchain ID of the domain we're minting to
	domainName: string; // The name of the domain we're minting to, i.e. wilder.world
	domainOwner: string; // account that owns the domain we're minting to (parent)
	onMint: () => void;
	subdomains: string[];
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
	subdomains,
}) => {
	//////////
	// Web3 //
	//////////

	// Context
	const context = useWeb3React<Web3Provider>();
	const { account } = context; // account = connected wallet ID

	// WILD Balance
	const znsContracts = useZnsContracts()!;
	const wildContract: ERC20 = znsContracts.wildToken;

	// Mint/Staking Hooks
	const mint = useMintProvider();
	const staking = useStakingProvider();

	// @todo refactor into useEffect so we don't have to calculate each render
	let isOwner = account && account.toLowerCase() === domainOwner.toLowerCase();

	//////////////////
	// State & Data //
	//////////////////

	// NOTE: The only domain data MintNewNFT needs is the domain ID
	// Token Data
	const [name, setName] = useState('');
	const [domain, setDomain] = useState('');
	const [isMintLoading, setIsMintLoading] = useState(false);
	const [wildBalance, setWildBalance] = useState<number | undefined>();
	const [containerHeight, setContainerHeight] = useState(0);
	const [existingSubdomains, setExistingSubdomains] = useState<
		string[] | undefined
	>();

	const containerRef = useRef<HTMLDivElement>(null);

	const [tokenInformation, setTokenInformation] =
		useState<TokenInformationType | null>(null);
	const [tokenStake, setTokenStake] = useState<TokenStakeType | null>(null);
	const [step, setStep] = useState(MintState.DomainDetails);

	// @todo reimplement for later releases
	// Token Dynamics Page
	// const [tokenDynamics, setTokenDynamics] = useState<TokenDynamicType | null>(
	// 	null,
	// );
	// const getTokenDynamics = (data: TokenDynamicType) => {
	// 	setTokenDynamics(data);
	// 	setStep(3);
	// };

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (!account) {
			return;
		}

		const fetchTokenBalance = async () => {
			const balance = await wildContract.balanceOf(account);
			setWildBalance(parseInt(ethers.utils.formatEther(balance), 10));
		};
		fetchTokenBalance();
	}, [wildContract, account]);

	useEffect(() => {
		resize();
	}, [step, isMintLoading]);

	useEffect(() => {
		const parent = domainName.substring(1);
		let existingNames;
		if (!parent.length) {
			existingNames = subdomains.map((sub: string) => {
				const split = sub.split('wilder.');
				return split[split.length - 1];
			});
		} else {
			existingNames = subdomains.map((sub: string) => {
				const split = sub.split(domainName.substring(1));
				const dot = split[split.length - 1].split('.');
				console.log(dot[dot.length - 1]);
				return dot[dot.length - 1];
			});
		}
		setExistingSubdomains(existingNames);
	}, [domainName, subdomains]);

	///////////////
	// Functions //
	///////////////

	const resize = () => {
		const el = containerRef.current;
		if (el) {
			const child = el.children[0];
			if (child && child.clientHeight > 0)
				return setContainerHeight(child.clientHeight);
		}
	};

	// Sets the token stake data from the token stake section
	const getTokenStake = (data: TokenStakeType) => {
		setTokenStake(data);
		setStep(MintState.Summary);
	};

	// Sets the token information data from token information section
	const getTokenInformation = (data: TokenInformationType) => {
		setTokenInformation(data);

		if (isOwner) {
			setStep(MintState.Summary);
		} else {
			setStep(MintState.Staking);
		}
	};

	// Mints NFT through user's wallet
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

	// Submits stake request through user's wallet
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

	// Start submit process - call function for minting or requesting
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

	///////////////
	// Fragments //
	///////////////

	const domainString = () => {
		const parentDomain =
			domainName.length > 1 ? `.${domainName.substring(1)}` : '';
		const newDomain = domain.length > 0 ? `.${domain}` : '';
		const str = `0://${rootDomainName}${parentDomain}${newDomain}`;
		return <>{str}</>;
	};

	////////////
	// Render //
	////////////

	return (
		<div className={`${styles.MintNewNFT} blur border-rounded border-primary`}>
			{isMintLoading && <div className={styles.Blocker}></div>}
			{/* // TODO: Pull each section out into a seperate component */}
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>
					{isOwner ? 'Mint' : 'Request to Mint'} "{name ? name : 'A New NFT'}"
				</h1>
				<div style={{ marginBottom: 8 }}>
					<h2 className={`glow-text-white`}>{domainString()}</h2>
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
				steps={isOwner ? ['Details'] : ['Details', 'Stake']}
				onNavigate={(i: number) => setStep(i)}
			/>

			<div
				ref={containerRef}
				className={styles.Container}
				style={{ height: containerHeight }}
			>
				{/* SECTION 1: Token Information */}
				{step === MintState.DomainDetails && (
					<TokenInformation
						existingSubdomains={existingSubdomains || []}
						token={tokenInformation}
						onContinue={(data: TokenInformationType) =>
							getTokenInformation(data)
						}
						onResize={resize}
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
						balance={wildBalance}
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
