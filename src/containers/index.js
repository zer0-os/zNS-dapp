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

export { default as BidList } from './BidList/BidList';
export { default as Enlist } from './Enlist/Enlist';
export { default as MakeABid } from './MakeABid/MakeABid';
export { default as MintNewNFT } from './MintNewNFT/MintNewNFT';
export { default as Shop } from './Shop/Shop';
export { default as NFTView } from './NFTView/NFTView';
export { default as OwnedDomainsTable } from './OwnedDomainsTable/OwnedDomainsTable';
export { default as Request } from './Request/Request';
