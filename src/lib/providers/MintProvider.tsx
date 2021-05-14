//- React Imports
import React, { useState, useCallback, useEffect } from 'react'

//- Hook Imports
import useNotification from 'lib/hooks/useNotification'

export const MintContext = React.createContext({
    minting: [{}],
    minted: [{}],
    mint: (nft: NFT) => {},
})

type MintProviderType = {
    children: React.ReactNode;
}

type NFT = {
    name: string;
    ticker: string;
    story: string;
    image: Buffer;
    dynamic: boolean;
}

const MintProvider: React.FC<MintProviderType> = ({ children }) => {
    const { addNotification } = useNotification()
    const [ minting, setMinting ] = useState<NFT[]>([])
    const [ minted, setMinted ] = useState<NFT[]>([])
    const [ finishedMinting, setFinishedMinting ] = useState<NFT | null>(null)

    const mint = (nft: NFT) => {
        // TODO: Add API calls here
        setMinting([...minting, nft])
        addNotification(`Started minting ${nft.name}`)
        setTimeout(() => setFinishedMinting(nft), 5250)
    }

    // TODO: Change this hook to run when minting finishes
    useEffect(() => {
        if(finishedMinting) {
            addNotification(`Finished minting ${finishedMinting.name}`)
            setMinting(minting.filter(n => n !== finishedMinting))
            setMinted([...minted, finishedMinting])
        }
    }, [ finishedMinting ])

    const contextValue = {
        minting,
        minted,
        mint: (nft: NFT) => mint(nft),
    }

    return (
        <MintContext.Provider value={contextValue}>
            {children}
        </MintContext.Provider>
    )

}

export default MintProvider