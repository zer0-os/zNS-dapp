//- React Imports
import React, { useState, useRef, useContext } from 'react'

import { NFTContext } from '../NFTContext'

//- Style Imports
import styles from '../MintNewNFT.module.css'

//- Component Imports
import { ValidatedInput, StepBar, ToggleSection, TextInput, FutureButton } from 'components'

type TokenDynamicsProps = {
    onContinue: () => void;
    onBack: () => void;
}

const TokenDynamics: React.FC<TokenDynamicsProps> = ({ onContinue, onBack }) => { 

    const { dynamic, setDynamic } = useContext(NFTContext)

    return(
        <>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
                <FutureButton 
                    style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18}}
                    onClick={onBack}
                    glow
                >Back</FutureButton>
                <FutureButton 
                    style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18 }}
                    onClick={onContinue}
                    glow
                >Continue</FutureButton>
			</div>
        </>
    )
}

export default TokenDynamics