//- React Imports
import React, { useState, useEffect, useRef, useContext, createContext } from 'react'

//- Context Imports
import useMint from 'lib/hooks/useMint'

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useDomainCache } from 'lib/useDomainCache'

//- Library Imports
import { randomName } from 'lib/Random'

//- Type Imports
import { TokenInformationType, TokenDynamicType, TokenStakeType, TokenType } from './types'

//- Component Imports
import { StepBar, ToggleSection, TextInput, FutureButton } from 'components'
import TokenInformation from './sections/TokenInformation'
import TokenDynamics from './sections/TokenDynamics'
import Staking from './sections/Staking'

//- Style Imports
import styles from './MintNewNFT.module.css'

type MintNewNFTProps = {
	domainId: string; // Blockchain ID of the domain we're minting to
	domainName: string; // The name of the domain we're minting to, i.e. wilder.world
	onMint: () => void;
}

const MintNewNFT: React.FC<MintNewNFTProps> = ({ domainId, domainName, onMint }) => {

	// NOTE: The only domain data MintNewNFT needs is the domain ID
	// Token Data
	const [ previewImage, setPreviewImage ] = useState('')
	const [ image, setImage ] = useState(Buffer.from(''))
	const [ name, setName ] = useState('')
	const [ domain, setDomain ] = useState('')
	const [ locked, setLocked ] = useState(false)
	const [ story, setStory ] = useState('')
	const [ dynamic, setDynamic ] = useState(false)
	const [ ticker, setTicker ] = useState('')
	const [ stake, setStake ] = useState(0)
	const [ currency, setCurrency ] = useState('')

	// Token Information Page
	const [ tokenInformation, setTokenInformation ] = useState<TokenInformationType | null>(null)
	const getTokenInformation = (data: TokenInformationType) => {
		setTokenInformation(data)
		setStep(2)
	}

	// Token Dynamics Page
	const [ tokenDynamics, setTokenDynamics ] = useState<TokenDynamicType | null>(null)
	const getTokenDynamics = (data: TokenDynamicType) => {
		setTokenDynamics(data)
		setStep(3)
	}

	// Stake Page
	const [ tokenStake, setTokenStake ] = useState<TokenStakeType | null>(null)
	const getTokenStake = (data: TokenStakeType) => {
		setTokenStake(data)
		submit()
	}

	//- Mint Context
	const { mint } = useMint()

	//- Page State
	const [ step, setStep ] = useState(1)
	const steps = 3

	//- Web3 Wallet Data
	// MintNewNFT is a container and needs a bit more brainpower than your standard component
	// I think using Context API for account data here is worthwhile
	const context = useWeb3React<Web3Provider>()
	const { account } = context // account = connected wallet ID

	//- Functions
	const toStep = (i: number) => {setStep(i >= steps ? steps : i)}
	const submit = () => {
		// Verify that all fields exist
		mint({
			name: tokenInformation.name,
			ticker: tokenInformation.ticker,
			story: tokenInformation.story,
			image: tokenInformation.image,
			domain: tokenInformation.domain,
			dynamic: tokenDynamics.dynamic,
		})
		onMint()
	}

	return (
		<div className={`${styles.MintNewNFT} blur border-rounded border-primary`}>
			{/* // TODO: Pull each section out into a seperate component */}
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Mint "{name ? name : 'A New NFT'}"</h1>
				<div style={{marginBottom: 8}}>
					<h2 className={`glow-text-white`}>wilder.{domain && domain.length ? `${domainName.substring(1)}` : ``}{domain}</h2>
				</div>
				<span>By {account && account.length ? randomName(account) : ''}</span>
			</div>
			<StepBar
				style={{marginTop: 24}}
				step={step}
				steps={['Details', 'Token Dynamics', 'Staking']}
			/>
			{/* TODO: Make ToggleSections unclickable if their open status depends on parent state */}

			{/* SECTION 1: Token Information */}
			{ step === 1 &&
				<TokenInformation
					token={tokenInformation}
					onContinue={(data: TokenInformationType) => getTokenInformation(data)} 
					setNameHeader={(name: string) => setName(name)}
					setDomainHeader={(domain: string) => setDomain(domain)}
				/>
			}

			{/* SECTION 2: Token Dynamics */}
			{ step === 2 && 
				<TokenDynamics 
					token={tokenDynamics}
					onBack={() => toStep(1)} 
					onContinue={(data: TokenDynamicType) => getTokenDynamics(data)} 
				/>
			}

			{/* SECTION 3: Staking */}
			{ step === 3 &&
				<Staking
					token={tokenStake}
					onBack={() => toStep(2)} 
					onContinue={(data: TokenStakeType) => getTokenStake(data)} 
				/>
			}
		</div>
	)
}

export default MintNewNFT