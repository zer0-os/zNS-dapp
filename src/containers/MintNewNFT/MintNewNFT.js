import React, { useState } from 'react'

import { ValidatedInput, StepBar, ToggleSection, TextInput, FutureButton } from 'components'

import MintNewNFTStyle from './MintNewNFT.module.css'

const MintNewNFT = (props) => {

	const [ step, setStep ] = useState(1)
	const steps = 3

	const toStep = (i) => {console.log(i);setStep(i >= steps ? steps : i)}

	return (
		<div className={`${MintNewNFTStyle.MintNewNFT} blur border-rounded border-primary`}>
			<div className={MintNewNFTStyle.Header}>
				<h1 className={`glow-text-white`}>Mint A New NFT</h1>
				<div>
					<h2 className={`glow-text-white`}>0:/Wilder.NewNFT</h2>
					<span>By Frank Wilder</span>
				</div>
			</div>
			<StepBar
				style={{marginTop: 24}}
				step={step}
				steps={steps}
			/>
			<ToggleSection 
				open={step === 1 ? true : undefined}
				style={{marginTop: 51}}
				label={'Token Information'}
			>
				<form className={MintNewNFTStyle.Section}>
					<div style={{display: 'flex'}}>
						<div 
							className={`${MintNewNFTStyle.NFT} border-rounded border-blue`}
							// Template background for now
							style={{backgroundImage: `url(assets/nft/redpill.png)`}}
						>
						</div>
						<div className={MintNewNFTStyle.Inputs}>
							<TextInput 
								placeholder={'NFT Name'}
							/>
							<TextInput 
								style={{width: 145}}
								placeholder={'Ticker'}	
							/>
						</div>
					</div>
					<TextInput 
						multiline={true} 
						placeholder={'Story (400 characters max)'} 
						style={{height: 200, marginTop: 40}} 
					/>
				</form>
				<FutureButton 
					style={{margin: '40px auto 0 auto'}}
					onClick={() => toStep(2)}
				>Continue</FutureButton>
			</ToggleSection>
			{/* <ToggleSection 
				open={step === 2}
				style={{marginTop: 51}}
				label={'Token Dynamics'}
			>
			</ToggleSection>
			<ToggleSection 
				open={step === 3}
				style={{marginTop: 51}}
				label={'Staking'}
			>
			</ToggleSection> */}
		</div>
	)
}

export default MintNewNFT