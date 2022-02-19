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
export { default as BidButton } from './buttons/BidButton/BidButton';
export { default as ConnectWalletButton } from './buttons/ConnectWalletButton/ConnectWalletButton';

// Cards
export { default as CurrentDomainPreview } from './cards/CurrentDomainPreview/CurrentDomainPreview';

//Prompts
export { default as ConnectWalletPrompt } from './prompts/ConnectWalletPrompt/ConnectWalletPrompt';

// Flows
export { default as BuyTokenRedirect } from './flows/BuyTokenRedirect/BuyTokenRedirect';
export { default as MakeABid } from './flows/MakeABid/MakeABid';
export { default as MintNewNFT } from './flows/MintNewNFT/MintNewNFT';
export { default as MintWheels } from './flows/MintWheels';
export { default as SetBuyNow } from './flows/SetBuyNow';
export { default as TransferOwnership } from './flows/TransferOwnership';
export { default as WheelsRaffle } from './flows/WheelsRaffle';

// Tables
export { default as OwnedDomainsTable } from './Tables/OwnedDomainsTable/OwnedDomainsTable';
export { default as SubdomainTable } from './Tables/SubdomainTable/SubdomainTable';

// Modals
export { default as ProfileModal } from './modals/ProfileModal/ProfileModal';

// Lists
export { default as BidList } from './lists/BidList/BidList';

// Other
export { default as BannerContainer } from './other/BannerContainer/BannerContainer';
export { default as NFTView } from './other/NFTView/NFTView';
export { default as PageHeader } from './other/PageHeader/PageHeader';
export { default as Request } from './other/Request/Request';

// Legacy
export { default as Enlist } from './legacy/Enlist/Enlist';
