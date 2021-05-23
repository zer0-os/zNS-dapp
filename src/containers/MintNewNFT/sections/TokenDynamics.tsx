//- React Imports
import React, { useState, useRef, useContext } from 'react'

import { NFTContext } from '../NFTContext'

//- Style Imports
import styles from '../MintNewNFT.module.css'

//- Component Imports
import { ToggleButton, TextInput, FutureButton } from 'components'

type TokenDynamicsProps = {
    onContinue: () => void;
    onBack: () => void;
}

const TokenDynamics: React.FC<TokenDynamicsProps> = ({ onContinue, onBack }) => { 

    const { dynamic, setDynamic, ticker, setTicker } = useContext(NFTContext)

    return(
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <p style={{marginTop: 80, fontSize: 18, lineHeight: 1.3}}>Tokens in Wilder can be valued on the market automatically using a bonding curve. This allows them to be bought and sold instantly, like trading a currency. If you’re not sure about this option, leave it set to “Default”</p>
            <ToggleButton 
                toggled={dynamic}
                onClick={() => setDynamic(!dynamic)}
                labels={['Default', 'Dynamic']}
                style={{marginTop: 9}}
            />
            <TextInput 
                placeholder={'Ticker'}
                onChange={(ticker: string) => setTicker(ticker.length < 4 ? ticker.toUpperCase() : ticker.toUpperCase().substring(0,4))}
                text={ticker.toUpperCase()}
                style={{width: 216, marginTop: 24}}
                alphanumeric
            />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 128}}>
                <FutureButton 
                    style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18, width: 130}}
                    onClick={onBack}
                    glow
                >Back</FutureButton>
                <FutureButton 
                    style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18, marginLeft: 48, width: 130 }}
                    onClick={onContinue}
                    glow
                >Continue</FutureButton>
			</div>
        </div>
    )
}

export default TokenDynamics