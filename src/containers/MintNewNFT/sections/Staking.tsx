//- React Imports
import React, { useState, useRef, useContext } from 'react'

//- Type Imports
import { TokenStakeType } from '../types'

//- Component Imports
import { TextInput, FutureButton } from 'components'

type StakingProps = {
    token: TokenStakeType | null;
    onContinue: (data: TokenStakeType) => void;
    onBack: () => void;
}

const Staking: React.FC<StakingProps> = ({ token, onContinue, onBack }) => {

    const [ amount, setAmount ] = useState('')
    const [ currency, setCurrency ] = useState('')
    const [ errors, setErrors ] = useState<string[]>([])

    const pressContinue = () => {
        // Validate
        const e: string[] = []
        if(!amount.length) e.push('amount')
        if(!currency.length) e.push('currency')
        if(e.length) return setErrors(e)
        onContinue({
            amount: amount, 
            currency: currency
        })
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <p style={{marginTop: 80, fontSize: 18, lineHeight: 1.3}}>In order to reserve space for your token in Wilder, you’ll need to put up some capital. You can bid what you think is a reasonable amount; if the owner accepts your offer, the transaction will proceed automatically. If your offer is rejected, the transaction will be cancelled.</p>
            <div style={{display: 'flex', width: '100%', marginTop: 9}}>
                <TextInput 
                    placeholder={'Amount'}
                    onChange={(amount: string) => setAmount(amount)}
                    text={amount}
                    style={{width: '50%'}}
                    error={errors.includes('amount')}
                    numeric
                />
                <TextInput 
                    placeholder={'Currency'}
                    onChange={(currency: string) => setCurrency(currency)}
                    text={currency}
                    error={errors.includes('currency')}
                    style={{width: '50%', marginLeft: 24}}
                />
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 80}}>
                <FutureButton 
                    style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18, width: 130}}
                    onClick={onBack}
                    glow
                >Back</FutureButton>
                <FutureButton 
                    style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18, marginLeft: 48, width: 130 }}
                    onClick={pressContinue}
                    glow
                >Continue</FutureButton>
			</div>
        </div>
    )

}

export default Staking