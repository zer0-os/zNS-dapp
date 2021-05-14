import { useContext } from 'react'
import { MintContext } from 'lib/providers/MintProvider'

function useMint() {
    const { minting, mint, minted } = useContext(MintContext)
    return { minting, mint, minted }
}

export default useMint