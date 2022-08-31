/*
 * @author Brett Collins
 *
 * This file implements the barrel pattern
 * All containers are exported from here, so that they
 * can be imported from one consistent spot. Restructuring
 * the project is easier, because the ref to each container is
 * in one place.
 *
 */

// Buttons
export { default as CancelBidButton } from './flows/CancelBid/CancelBidButton';
export { default as BuyNowButton } from './flows/BuyNow/BuyNowButton';
export { default as BidButton } from './buttons/BidButton/BidButton';
export { default as ConnectWalletButton } from './buttons/ConnectWalletButton/ConnectWalletButton';
export { default as SetBuyNowButton } from './flows/SetBuyNow/SetBuyNowButton';
export { default as ViewBidsButton } from './buttons/ViewBidsButton/ViewBidsButton';

// Cards
export { default as CurrentDomainPreview } from './cards/CurrentDomainPreview/CurrentDomainPreview';

//Prompts
export { default as ConnectWalletPrompt } from './prompts/ConnectWalletPrompt/ConnectWalletPrompt';

// Flows
export { default as AcceptBid } from './flows/AcceptBid/AcceptBid';
export { default as BuyNow } from './flows/BuyNow';
export { default as CancelBid } from './flows/CancelBid/CancelBid';
export { default as ClaimNFTContainer } from './flows/ClaimNFT';
export { default as MakeABid } from './flows/MakeABid/MakeABid';
export { default as MintNewNFT } from './flows/MintNewNFT/MintNewNFT';
export { default as MintDropNFT } from './flows/MintDropNFT';
export { default as SetBuyNow } from './flows/SetBuyNow';
export { default as TransferOwnership } from './flows/TransferOwnership';
export { default as Raffle } from './flows/Raffle';

// Tables
export { default as BidTable } from './Tables/BidTable/BidTable';
export { default as OwnedDomainsTable } from './Tables/OwnedDomainsTable/OwnedDomainsTable';
export { default as SubdomainTable } from './Tables/SubdomainTable/SubdomainTable';

// Lists
export { default as BidList } from './lists/BidList/BidList';

// Other
export { default as BannerContainer } from './other/BannerContainer/BannerContainer';
export { default as NFTView } from './other/NFTView/NFTView';
export { default as PageHeader } from './other/PageHeader/PageHeader';
export { default as PriceWidget } from './other/PriceWidget/PriceWidget';
export { default as Request } from './other/Request/Request';

// Legacy
export { default as Enlist } from './legacy/Enlist/Enlist';
