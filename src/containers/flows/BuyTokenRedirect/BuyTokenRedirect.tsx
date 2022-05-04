//- Style Imports
import styles from './BuyTokenRedirect.module.scss';

//- Icon Imports
import openExternalUrl from 'assets/open-external-url.svg';

//- Library Imports
import useCurrency from 'lib/hooks/useCurrency';

//- Constants Imports
import * as constants from './constants';

//- Utils Imports
import { UrlList, Size } from './utils';

//- Global Utils Imports
import { formatByDecimalPlace } from 'lib/utils/number';

//- Component Imports
import { HoverDropdown } from 'components';

//- Props
interface IProps {
	walletConnected?: boolean;
}

const BuyTokenRedirect = ({ walletConnected }: IProps) => {
	//- Wallet Data
	const { wildPriceUsd, wildPercentageChange } = useCurrency();
	/////////////////////
	// React Fragments //
	/////////////////////

	//- Current Price
	const currentPriceDetails = (size: string, title?: string) => {
		const isSizeSmall =
			size === Size.SML ? styles.CurrentPriceSml : styles.CurrentPriceLrg;

		return (
			<div className={size === Size.SML ? styles.Details : ''}>
				{title && <span className={styles.TickerName}>{title}</span>}
				<div className={styles.CurrentPriceContainer}>
					<span className={isSizeSmall}>${wildPriceUsd}</span>
					<span
						className={`${styles.PercentageChange} ${
							wildPercentageChange < 0
								? styles.PercentageChangeNegative
								: styles.PercentageChangePositive
						}`}
					>
						{size === Size.LRG
							? `(${formatByDecimalPlace(wildPercentageChange, 1)}%)`
							: `${formatByDecimalPlace(wildPercentageChange, 1)}%`}
					</span>
				</div>
			</div>
		);
	};

	//- External Url
	const externalUrl = () => (
		<div className={styles.ExternalUrl}>
			<a href={constants.COIN_MARKET_CAP_URL} target="_blank" rel="noreferrer">
				{constants.COIN_MARKET_CAP_BTN}
			</a>
			<img alt={constants.EXTERNAL_URL_ICON} src={openExternalUrl} />
		</div>
	);

	//- Divider
	const divider = () => (
		<>
			<p className={styles.DividerCopy}>{constants.DIVIDER_COPY}</p>
			<div className={styles.Divider}></div>
		</>
	);

	//- Url Icon Row
	const externalUrlRow = (
		urlList: {
			title: string;
			href: string;
			src: string;
		}[],
	) => (
		<div className={styles.UrlRowContainer}>
			{urlList.map((item) => (
				<a key={item.title} target="_blank" rel="noreferrer" href={item.href}>
					<div className={styles.IconWrapper}>
						<img alt={`${item.title}-logo`} src={item.src} />
						<p>{item.title}</p>
					</div>
				</a>
			))}
		</div>
	);

	const dropdownButton = (
		<div className={styles.WildPriceContainer}>
			{currentPriceDetails(Size.SML, constants.TICKER_NAME)}
		</div>
	);

	const dropdownContent = (
		<div className={`${styles.DropdownContent}`}>
			<div className={`${styles.Section} ${styles.SectionBaseline}`}>
				{currentPriceDetails(Size.LRG)}
				{externalUrl()}
			</div>
			<div className={`${styles.Section} ${styles.SectionCenter}`}>
				{divider()}
			</div>
			<div className={styles.Section}>{externalUrlRow(UrlList)}</div>
		</div>
	);
	////////////
	// Render //
	////////////

	return (
		<>
			<HoverDropdown triggerContent={dropdownButton} direction="up">
				{dropdownContent}
			</HoverDropdown>
		</>
	);
};

export default BuyTokenRedirect;
