//- React Imports
import { useState, useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom'

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

//- Library Imports
import { randomNumber } from 'lib/Random'

//- Components
import { 
    AssetGraphCard,
    AssetMarketCapCard,
    AssetPriceCard,
    FutureButton,
    FilterBar,
    HorizontalScroll,
    DomainTable,
    TextButton,
    TitleBar,
    NextDrop,
    Overlay,
    Profile,
    SearchBar,
    PreviewCard,
    SideBar
} from 'components'

type ZNSProps = {
    domain: string;
}

const ZNS: React.FC<ZNSProps> = ({ domain }) => {

    const [ isGridView, setIsGridView ] = useState(false)

    //- Domain State
    const [ currentDomainContext, setCurrentDomainContext ] = useState(null)
    
    //- MVP Version 
    const [ mvpVersion, setMvpVersion ] = useState(1)
    const mvpFilterSelect = (mvp: string) => setMvpVersion(mvp === 'MVP 1' ? 1 : 3)

    //- Web3 
    const { useDomain } = useDomainCache()
    const domainContext = useDomain(domain.charAt(0) === '/' ? domain.substring(1) : domain)
    const { data } = domainContext

    //- Data
    const [ tableData, setTableData ] = useState([])
    const isRoot = !data.isNothing() && !data.value.parent
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
            setTableData(d)
        }
    }, [ data ])

    useEffect(() => {
        setTableData([])
    }, [ domain ])

    return (
        <div className='page-spacing'>
            <FilterBar onSelect={mvpFilterSelect} filters={['MVP 1', 'MVP 3']}>
            <TitleBar>
                <div>
                    <Link to={''}>0:/</Link>
                    { domain.split('.').map((part, i) => 
                        <Link to={''}>{i > 0 ? `.${part}` : part}</Link>
                    ) }
                </div>
                <div>
                    <FutureButton glow onClick={() => console.log('hello')}>Connect To Wallet</FutureButton>
                </div>
            </TitleBar>
            </FilterBar>
            { mvpVersion === 3 &&
                <>
                    <HorizontalScroll style={{marginTop: 16}}>
                        <AssetPriceCard 
                            title='Wild Price'
                            price={randomNumber(85, 400, 2)}
                            change={randomNumber(-30, 30, 2)}
                        />
                        <AssetPriceCard 
                            title='Wild Price'
                            price={randomNumber(85, 400, 2)}
                            change={randomNumber(-30, 30, 2)}
                        />
                        <AssetGraphCard
                            title='Wild Price'
                        />
                        <AssetMarketCapCard 
                            title='Total Wild Holders'
                            price={randomNumber(15000, 40000, 2)}
                        />
                        <AssetMarketCapCard 
                            title='Total Wild Holders'
                            price={randomNumber(15000, 40000, 2)}
                        />
                        <AssetMarketCapCard 
                            title='Total Wild Holders'
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
            {
                !data.isNothing() && subdomains.length > 0 &&
                <DomainTable
                    isGridView={isGridView}
                    domains={tableData}
                    isRootDomain={isRoot}
                    style={{marginTop: 16}}
                />
            }
            {
                !data.isNothing() && subdomains.length === 0 &&
                <div style={{marginTop: 24, width: '100%'}}>
                    <h1 style={{textAlign: 'center'}}>This domain has no children, render NFT page here</h1>
                </div>
            }
        </div>
    )
}

export default ZNS