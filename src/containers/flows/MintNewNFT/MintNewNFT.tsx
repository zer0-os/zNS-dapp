//- React Imports
import React, { useState, useEffect, useMemo } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

//- Providers
import { useZnsContracts } from 'lib/contracts';
import { useStaking } from 'lib/hooks/useStaking';
import useMint from 'lib/hooks/useMint';

//- Type Imports
import { ERC20 } from 'types';
import {
	TokenInformationType,
	// TokenDynamicType,
	TokenStakeType,
} from './types';

//- Component Imports
import { StepBar, Wizard } from 'components';
import TokenInformation from './sections/TokenInformation';
// import TokenDynamics from './sections/TokenDynamics';
import Staking from './sections/Staking';
import Summary from './sections/Summary';

//- Style Imports
import styles from './MintNewNFT.module.scss';

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

	// LOOT Balance
	const znsContracts = useZnsContracts()!;
	const lootContract: ERC20 = znsContracts.lootToken;

	// Mint/Staking Hooks
	const { mint } = useMint();
	const staking = useStaking();

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
	const [mintingStatusText, setMintingStatusText] = useState('');
	const [lootBalance, setLootBalance] = useState<number | undefined>();

	const [tokenInformation, setTokenInformation] =
		useState<TokenInformationType | null>(null);
	const [tokenStake, setTokenStake] = useState<TokenStakeType | null>(null);
	const [step, setStep] = useState(MintState.DomainDetails);
	const [error, setError] = useState('');

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
			const balance = await lootContract.balanceOf(account);
			setLootBalance(parseInt(ethers.utils.formatEther(balance), 10));
		};
		fetchTokenBalance();
	}, [lootContract, account]);

	///////////////
	// Functions //
	///////////////

	const checkIsNftValid = () => {
		let valid = true;
		// Domain name lowercase
		if (!account || !tokenInformation) {
			valid = false;
		} else if (/[A-Z]/.test(tokenInformation.domain)) {
			valid = false;
		}
		return valid;
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

	const setStatusText = (status: string) => {
		setMintingStatusText(status);
	};

	// Mints NFT through user's wallet
	const submitMint = async () => {
		if (!account) return setIsMintLoading(false);
		if (!tokenInformation) return setIsMintLoading(false);
		setStatusText(`Minting domain`);

		return await mint(
			{
				parent: domainId,
				owner: account,
				name: tokenInformation.name,
				story: tokenInformation.story,
				image: tokenInformation.image,
				domain: tokenInformation.domain,
				zna: newDomainZna,
				// @TODO Reimplement ticker when we enable dynamic tokens
				ticker: '',
				dynamic: false,
				locked: tokenInformation.locked,
				additionalMetadata: {
					gridViewByDefault: true,
				},
			},
			setStatusText,
		);
	};

	// Submits stake request through user's wallet
	const submitRequest = async () => {
		if (!account) return setIsMintLoading(false);
		if (!tokenInformation) return setIsMintLoading(false);
		if (!tokenStake) return setIsMintLoading(false);

		setStatusText(`Placing domain request`);

		return staking.placeRequest(
			{
				nft: {
					parent: domainId,
					owner: account,
					name: tokenInformation.name,
					story: tokenInformation.story,
					image: tokenInformation.image,
					domain: tokenInformation.domain,
					zna: newDomainZna,
					// @TODO Reimplement ticker when we enable dynamic tokens
					ticker: '',
					dynamic: false,
					locked: tokenInformation.locked,
				},
				requestor: account,
				stakeAmount: tokenStake.amount.toString(),
				stakeCurrency: tokenStake.currency,
			},
			setStatusText,
		);
	};

	// Start submit process - call function for minting or requesting
	const submit = () => {
		const isNftValid = checkIsNftValid();
		if (!isNftValid) {
			setError('Something went wrong - please try again');
			return;
		}

		setIsMintLoading(true);

		const doSubmit = async () => {
			try {
				if (isOwner) {
					await submitMint();
				} else {
					await submitRequest();
				}

				onMint();
			} catch (e: any) {
				setError(e && (e.message ?? ''));
				setIsMintLoading(false);
			}
		};

		doSubmit();
	};

	///////////////
	// Fragments //
	///////////////

	const newDomainZna = useMemo(() => {
		const newDomain = domain.length > 0 ? `.${domain}` : '';

		return `0://${domainName}${newDomain}`;
	}, [domainName, domain]);

	////////////
	// Render //
	////////////

	return (
		<Wizard
			header={`${isOwner ? 'Mint' : 'Request to Mint'} ${
				name ? `"${name}"` : ''
			}`}
			subHeader={newDomainZna}
			className={`${styles.MintNewNFT} border-rounded border-primary background-primary`}
			sectionDivider={false}
		>
			<StepBar
				step={step + 1}
				steps={isOwner ? ['Details'] : ['Details', 'Stake']}
				onNavigate={(i: number) => setStep(i)}
			/>

			<div className={styles.Container}>
				{/* SECTION 1: Token Information */}
				{step === MintState.DomainDetails && (
					<TokenInformation
						existingSubdomains={subdomains || []}
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
						balance={lootBalance}
						token={tokenStake}
						onContinue={(data: TokenStakeType) => getTokenStake(data)}
					/>
				)}

				{step === MintState.Summary && (
					<Summary
						token={tokenInformation}
						mintingStatusText={mintingStatusText}
						onContinue={submit}
						isMintLoading={isMintLoading}
						domain={domainName}
						errorText={error}
					/>
				)}
			</div>
		</Wizard>
	);
};

export default MintNewNFT;
