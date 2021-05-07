//- React Imports
import { useState, useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom'

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { useEagerConnect, useInactiveListener } from 'lib/hooks/provider-hooks';

//- Library Imports
import { randomNumber } from 'lib/Random'

//- Components & Containers
import { 
    AssetGraphCard,
    AssetMarketCapCard,
    AssetPriceCard,
    ConnectToWallet,
    FutureButton,
    FilterBar,
    HorizontalScroll,
    DomainTable,
    TextButton,
    TitleBar,
    NextDrop,
    IconButton,
    Overlay,
    Profile,
    SearchBar,
    PreviewCard,
    SideBar
} from 'components'
import {
    MintNewNFT
} from 'containers'

type ZNSProps = {
    domain: string;
}

const ZNS: React.FC<ZNSProps> = ({ domain }) => {

    //- Page State
    const [ overlay, setOverlay ] = useState('')
    const [ isLoading, setIsLoading ] = useState(true)

    //- Domain State
    const [ currentDomainContext, setCurrentDomainContext ] = useState(null)
    
    //- MVP Version
    const [ mvpVersion, setMvpVersion ] = useState(1)
    const mvpFilterSelect = (mvp: string) => setMvpVersion(mvp === 'MVP 1' ? 1 : 3)

    //- Web3 Wallet Data
    const walletContext = useWeb3React<Web3Provider>()
    const { account, active, deactivate } = walletContext
    const triedEagerConnect = useEagerConnect() // This line will try auto-connect to the last wallet

    //- Web3 Domain Data 
    const { useDomain } = useDomainCache()
    const domainContext = useDomain(domain.charAt(0) === '/' ? domain.substring(1) : domain)
    const { data } = domainContext

    //- Data
    const [ tableData, setTableData ] = useState([])
    const isRoot = !data.isNothing() && !data.value.parent
    const ownedDomain = !data.isNothing() && data.value.owner.id === account
    const subdomains = !data.isNothing() && data.value.subdomains ? data.value.subdomains : []

    //- Effects
    useEffect(() => {
        if(data.isNothing()) setTableData([])
        else {
            const d = subdomains.map((d: any, i: number) => {
                const s: any = {}
                s.domainId = d.id
                s.domainName = d.name
                s.domainMetadataUri = d.metadata
                s.lastBid = randomNumber(1, 100000, 2)
                s.numBids = randomNumber(1, 150, 0)
                s.lastSalePrice = randomNumber(1, 100000, 2)
                s.tradePrice = randomNumber(1, 100000, 2)
                return s
            })
            const lots = [].concat(d).concat(d).concat(d)
            setTableData(lots)
            setIsLoading(false)
        }
    }, [ data ])

    useEffect(() => {
        setTableData([])
        setIsLoading(true)
    }, [ domain ])

    return (
        <div className='page-spacing'>
            {/* Overlays */}
            {/* TODO: Switch out overlay handling to a hook */}
            { overlay.length > 0 && 
                <Overlay onClose={() => setOverlay('')}>
                    { overlay === 'ConnectToWallet' && <ConnectToWallet onConnect={() => setOverlay('')} /> }
                    { overlay === 'MintNewNFT' && <MintNewNFT onMint={() => setOverlay('')} domainName={!data.isNothing() ? data.value.name : ''} domainId={!data.isNothing() ? data.value.id : ''} /> }
                </Overlay>
            }

            {/* Nav Bar */}
            <FilterBar onSelect={mvpFilterSelect} filters={['MVP 1', 'MVP 3']}>
            <TitleBar>
                <div>
                    {/* TODO: Split this into its own component */}
                    <Link style={{textDecoration: 'none', color: 'white'}} to={''}>0://</Link>
                    { domain.split('.').map((part, i) =>
                        i === 0 ?
                        <Link style={{textDecoration: 'none', color: 'white'}} to={part}>{ part.charAt(0) === '/' ? part.substring(1, part.length) : part }</Link>
                        : 
                        <Link style={{textDecoration: 'none', color: 'white'}} to={domain.split('.').slice(0, i + 1).join('.')}>{i > 0 ? `.${part}` : part}</Link>
                    ) }
                </div>
                <div>
                    { !active && 
                        <FutureButton glow onClick={() => setOverlay('ConnectToWallet')}>Connect To Wallet</FutureButton>
                    }
                    { active &&
                        <> 
                            <FutureButton 
                                glow={isRoot} 
                                onClick={() => isRoot || ownedDomain ? setOverlay('MintNewNFT') : alert('You can only mint NFTs on domains you own')}
                            >Mint New NFT</FutureButton>
                            <IconButton 
                                onClick={() => console.log('profile')} 
                                style={{height: 32, width: 32, borderRadius: '50%'}} 
                                iconUri={'assets/dp/fake01.jpg'} 
                            />
                            <IconButton
                                onClick={() => setOverlay('ConnectToWallet')}
                                style={{height: 32, width: 32, borderRadius: '50%'}}
                                iconUri={''}
                            />
                        </>
                    }
                </div>
            </TitleBar>
            </FilterBar>

            {/* Subdomain table */}
            { mvpVersion === 3 &&
                <>
                    <HorizontalScroll style={{marginTop: 16}}>
                        <AssetPriceCard 
                            title='Wild Price'
                            price={randomNumber(85, 400, 2)}
                            change={randomNumber(-30, 30, 2)}
                        />
                        <AssetGraphCard
                            title='Wild Price'
                        />
                        <AssetPriceCard 
                            title='Test Price'
                            price={randomNumber(85, 400, 2)}
                            change={randomNumber(-30, 30, 2)}
                        />
                        <AssetMarketCapCard 
                            title='Total Test Holders'
                            price={randomNumber(15000, 40000, 2)}
                        />
                        <AssetMarketCapCard 
                            title='Total Test2 Holders'
                            price={randomNumber(15000, 40000, 2)}
                        />
                        <AssetMarketCapCard 
                            title='Total Test3 Holders'
                            price={randomNumber(15000, 40000, 2)}
                        />
                    </HorizontalScroll>
                    <NextDrop
                        title='Futopia'
                        artist='Frank Wilder'
                        date={new Date(new Date().getTime() + (24 * 60 * 60 * 1000))}
                        style={{marginTop: 16}}
                    />
                </>
            }
            
            {/* Preview Card */}
            { !isRoot && 
                <PreviewCard
                    style={{marginTop: 16}}
                    nftImageData={'hello'}
                    name='Brett'
                    domain={domain}
                    description='brett'
                    creatorId={!data.isNothing() && data.value.minter.id ? `${data.value.minter.id.substring(0, 12)}...` : ''}
                    ownerId={!data.isNothing() ? `${data.value.owner.id.substring(0, 12)}...` : ''}
                    isLoading={isLoading}
                />
            }

            {/* Subdomain Table */}
            <h1 style={{marginTop: 16}}>The subdomain array is being artificially lengthened to test this view with more components - don't panic</h1>
            <DomainTable
                domains={tableData}
                isRootDomain={isRoot}
                style={{marginTop: 16}}
                empty={(!data.isNothing() && subdomains.length === 0)}
            />
        </div>
    )
}

export default ZNS