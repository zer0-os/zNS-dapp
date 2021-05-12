//- React Imports
import { useState, useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom'
import { Spring, animated } from 'react-spring';

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { useEagerConnect, useInactiveListener } from 'lib/hooks/provider-hooks';

//- Library Imports
import { randomNumber } from 'lib/Random'
import IPFSClient from 'lib/ipfs-client'
import useNotification from 'lib/hooks/useNotification'

//- Style Imports
import styles from './ZNS.module.css'

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
    SideBar,
    ZNALink,
    Notification,
} from 'components'
import {
    MintNewNFT,
    NFTView
} from 'containers'

type ZNSProps = {
    domain: string;
}

const ZNS: React.FC<ZNSProps> = ({ domain }) => {

    //- Page State
    const [ isLoading, setIsLoading ] = useState(true)
    const [ hasLoaded, setHasLoaded ] = useState(false)

    //- Overlay State
    const [ isWalletOverlayOpen, setIsWalletOverlayOpen ] = useState(false)
    const [ isMintOverlayOpen, setIsMintOverlayOpen ] = useState(false)
    const [ isProfileOverlayOpen, setIsProfileOverlayOpen ] = useState(false)

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
            // Set the domain data for table view
            const d = subdomains.map((d: any, i: number) => ({
                domainId: d.id,
                domainName: d.name,
                domainMetadataUri: d.metadata,
                lastBid: randomNumber(1, 100000, 2),
                numBids: randomNumber(1, 150, 0),
                lastSalePrice: randomNumber(1, 100000, 2),
                tradePrice: randomNumber(1, 100000, 2),
            }))
            setTableData(d)

            // Get the data for Preview Card
            //- Note:
            // We're checking subdomains here, because we want to defer the IPFS
            // call to NFT View to prevent unneeded IPFS calls
            if(!data.isNothing() && data.value.subdomains.length > 0 && data.value.metadata) {
                // TODO: Maybe move this method into lib/ipfs-client.ts since we use it in a couple places
                // TODO: Worth deferring all the metadata loading to the domain table component?
                IPFSClient.cat(data.value.metadata.slice(21)).then((d: any) => {
                    const nftData = JSON.parse(d)
                    data.value.image = nftData.image
                    data.value.name = nftData.title
                    data.value.description = nftData.description
                    setIsLoading(false)
                })
            }
            setHasLoaded(true)
        }
    }, [ data, hasLoaded ])

    useEffect(() => {
        setTableData([])
        setIsLoading(true)
    }, [ domain ])

    return (
        <div className='page-spacing' style={{opacity: hasLoaded ? 1 : 0, transition: 'opacity 0.2s ease-in-out', paddingTop: mvpVersion === 1 ? 155 : 139 }}>
            {/* <Notification /> */}
            {/* Overlays */}
            {/* TODO: Switch out overlay handling to a hook */}
            <Overlay open={isWalletOverlayOpen} onClose={() => setIsWalletOverlayOpen(false)}><ConnectToWallet onConnect={() => setIsWalletOverlayOpen(false)} /></Overlay>
            <Overlay open={isMintOverlayOpen} onClose={() => setIsMintOverlayOpen(false)}><MintNewNFT onMint={() => setIsMintOverlayOpen(false)} domainName={!data.isNothing() ? data.value.name : ''} domainId={!data.isNothing() ? data.value.id : ''} /></Overlay>
            <Overlay open={isProfileOverlayOpen} onClose={() => setIsProfileOverlayOpen(false)}><Profile id={account ? account : ''}/></Overlay>

            {/* Nav Bar */}
            <FilterBar onSelect={mvpFilterSelect} filters={['MVP 1', 'MVP 3']}>
            <TitleBar>
                <div>
                    {/* TODO: Split this into its own component */}
                    <ZNALink domain={domain} />
                </div>
                <div>
                    { !active && 
                        <FutureButton glow onClick={() => setIsWalletOverlayOpen(true)}>Connect To Wallet</FutureButton>
                    }
                    { active &&
                        <> 
                            <FutureButton 
                                glow={isRoot} 
                                onClick={() => isRoot || ownedDomain ? setIsMintOverlayOpen(true) : alert('You can only mint NFTs on domains you own')}
                            >Mint New NFT</FutureButton>
                            <IconButton
                                onClick={() => setIsProfileOverlayOpen(true)} 
                                style={{height: 32, width: 32, borderRadius: '50%'}} 
                                iconUri={`https://picsum.photos/seed/${account}/200/300`} 
                            />
                            {/* TODO: Change the triple dot button to a component */}
                            <div 
                                className={styles.Dots}
                                onClick={() => setIsWalletOverlayOpen(true)}
                            >
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </>
                    }
                </div>
            </TitleBar>
            </FilterBar>

                        

            {/* Preview Card */}
            { mvpVersion === 3 &&
                <Spring from={{ opacity: 0, marginTop: -97 }} to={{ opacity: isRoot ? 1 : 0, marginTop: isRoot ? 0 : -97 }}>
                    { styles => 
                        <animated.div style={styles}>
                            <NextDrop
                                title='Futopia'
                                artist='Frank Wilder'
                                date={new Date(new Date().getTime() + (24 * 60 * 60 * 1000))}
                                style={{marginTop: 16}}
                            />
                        </animated.div>
                    }
                </Spring>
            }

            {/* Preview Card */}
            <Spring from={{ opacity: 0, marginTop: -236 }} to={{ opacity: !isRoot && hasLoaded && subdomains.length ? 1 : 0, marginTop: !isRoot && hasLoaded && subdomains.length ? 0 : -236 }}>
                { styles => 
                    <animated.div style={styles}>
                        <PreviewCard
                            image={!data.isNothing() ? data.value.image : ''}
                            name={!data.isNothing() ? data.value.name : 'nothing'}
                            domain={domain}
                            description={!data.isNothing() ? data.value.description : ''}
                            creatorId={!data.isNothing() && data.value.minter && data.value.minter.id ? `${data.value.minter.id.substring(0, 12)}...` : ''}
                            ownerId={!data.isNothing() ? `${data.value.owner.id.substring(0, 12)}...` : ''}
                            isLoading={isLoading}
                        />
                    </animated.div>
                }
            </Spring>

            {/* Subdomain table */}
            { mvpVersion === 3 && subdomains.length > 0 &&
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
                </>
            }

            {/* Subdomain Table */}
            { subdomains.length > 0 && 
                <DomainTable
                    domains={tableData}
                    isRootDomain={isRoot}
                    style={{marginTop: 16}}
                    empty={(!data.isNothing() && subdomains.length === 0)}
                    mvpVersion={mvpVersion}
                />
            }

            { !data.isNothing() && subdomains.length === 0 &&
                <NFTView
                    domain={domain}
                />
            }
        </div>
    )
}

export default ZNS