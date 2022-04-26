/*
 * @author Brett Collins
 *
 * This file implements the barrel pattern
 * All components are exported from here, so that they
 * can be imported from one consistent spot. Restructuring
 * the project is easier, because the ref to each component is
 * in one place.
 *
 */

// TODO: Change this file to TypeScript

//- Banners
export { default as CountdownBanner } from './Banners/CountdownBanner/CountdownBanner';
export { default as MessageBanner } from './Banners/MessageBanner/MessageBanner';
export { default as NextDrop } from './Banners/NextDrop/NextDrop.js';
export { default as MintDropNFTBanner } from './Banners/MintDropNFTBanner/MintDropNFTBanner';

//- Buttons
export { default as FilterButton } from './Buttons/FilterButton/FilterButton';
export { default as FutureButton } from './Buttons/FutureButton/FutureButton';
export { default as IconButton } from './Buttons/IconButton/IconButton';
export { default as NumberButton } from './Buttons/NumberButton/NumberButton';
export { default as ProfileButton } from './Buttons/ProfileButton/ProfileButton.js';
export { default as TextButton } from './Buttons/TextButton/TextButton';
export { default as ToggleButton } from './Buttons/ToggleButton/ToggleButton';
export { default as QuestionButton } from './Buttons/QuestionButton/QuestionButton';

//- Cards
export { default as AssetCard } from './Cards/AssetCard/AssetCard';
export { default as AssetGraphCard } from './Cards/AssetCard/AssetGraphCard/AssetGraphCard';
export { default as AssetMarketCapCard } from './Cards/AssetCard/AssetMarketCapCard/AssetMarketCapCard';
export { default as AssetPriceCard } from './Cards/AssetCard/AssetPriceCard/AssetPriceCard';
export { default as NFTCard } from './Cards/NFTCard';
export { default as PreviewCard } from './Cards/PreviewCard';

//- Dropdowns
export * from './Dropdowns';

//- Inputs
export { default as EtherInput } from './Inputs/EtherInput/EtherInput';
export { default as TextInput } from './Inputs/TextInput/TextInput';
export { default as TextInputWithTopPlaceHolder } from './Inputs/TextInput/TextInputWithTopPlaceHolder';

//- NavBars
export { default as TabBar } from './NavBars/TabBar/TabBar';

//- Tables
export { default as RequestTable } from './Tables/RequestTable/RequestTable';
export { default as GenericTable } from './Tables/GenericTable/GenericTable';

//- Other
export { default as ArrowLink } from './ArrowLink/ArrowLink';
export { default as Artwork } from './Artwork/Artwork';
export { default as ConnectToWallet } from './ConnectToWallet/ConnectToWallet';
export { default as CopyInput } from './CopyInput/CopyInput.js';
export { default as Detail } from './Detail/Detail';
export { default as HorizontalScroll } from './HorizontalScroll/HorizontalScroll';
export { default as Image } from './Image/Image';
export { default as Member } from './Member/Member';
export { default as MintPreview } from './MintPreview/MintPreview';
export { default as NFTMedia } from './NFTMedia';
export { default as TransferPreview } from './TransferPreview/TransferPreview';
export { default as Notification } from './Notification/Notification';
export { default as NotificationDrawer } from './NotificationDrawer/NotificationDrawer';
export { default as Overlay } from './Overlay/Overlay';
export { default as SearchBar } from './SearchBar/SearchBar.js';
export { default as SideBar } from './SideBar/SideBar';
export { default as Spinner } from './Spinner/Spinner';
export { default as ToggleSection } from './ToggleSection/ToggleSection.js';
export { default as TooltipLegacy } from './TooltipLegacy/Tooltip';
export { default as Tooltip } from './Tooltip/Tooltip';
export { default as WilderIcon } from './WilderIcon/WilderIcon';
export { default as ZNALink } from './ZNALink/ZNALink';
export { default as Confirmation } from './Confirmation/Confirmation';
export { default as LoadingIndicator } from './LoadingIndicator/LoadingIndicator';
export { default as Countdown } from './Countdown/Countdown';
export { default as Wizard } from './Wizard/Wizard';

//- Glyphs
export { default as StakingIcon } from './Glyphs/StakingIcon';
export { default as MarketIcon } from './Glyphs/MarketIcon';
export { default as DAOIcon } from './Glyphs/DAOIcon';
export { default as ProfileIcon } from './Glyphs/ProfileIcon';

export { default as StatsWidget } from './StatsWidget/StatsWidget';

//- Progress Indicators
export { default as StepBar } from './ProgressIndicators/StepBar/StepBar';

//- Switches
export { default as ToggleSwitch } from './Switch/ToggleSwitch/ToggleSwitch';

//- Scroll To Top
export { default as ScrollToTop } from './ScrollToTop/ScrollToTop';

//- To be implemented
// export { default as CopyInput } from './CopyInput/CopyInput.js'
// export { default as Table } from './Table/Table.js'
