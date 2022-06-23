//- React Imports
import { useCallback, useEffect, useRef, useState } from 'react';

//- Style Imports
import styles from './PriceWidget.module.scss';

//- Icon Imports
import openExternalUrl from 'assets/open-external-url.svg';

//- Library Imports
import useCurrency from 'lib/hooks/useCurrency';

//- Constants Imports
import { LABELS } from './constants';

import { URLS } from 'constants/urls';

//- Utils Imports
import { WildUrlRowData, ZeroUrlRowData, Size, TokenType } from './utils';

//- Global Utils Imports
import { formatByDecimalPlace } from 'lib/utils/number';

//- Component Imports
import { HoverDropdown } from 'components';

//- Selectors
import * as selectors from './selectors';

type PriceWidgetProps = {
	isRoot: boolean;
};

const PriceWidget: React.FC<PriceWidgetProps> = ({ isRoot }) => {
	//- Wallet Data
	const {
		wildPriceUsd,
		wildPercentageChange,
		zeroPriceUsd,
		zeroPercentageChange,
	} = useCurrency();

	const isMounted = useRef<boolean>();

	//- Token Data
	const [data, setData] = useState<TokenType>();

	const getTokenData = useCallback(() => {
		if (isRoot) {
			setData({
				tokenPrice: zeroPriceUsd,
				percentageChange: zeroPercentageChange,
				tokenTitle: LABELS.ZERO_TICKER,
				urlList: ZeroUrlRowData,
				urlCMC: URLS.COIN_MARKET_CAP_ZERO,
				dividerCopy: LABELS.DIVIDER_COPY_ZERO,
			});
		}
		if (!isRoot) {
			setData({
				tokenPrice: wildPriceUsd,
				percentageChange: wildPercentageChange,
				tokenTitle: LABELS.WILD_TICKER,
				urlList: WildUrlRowData,
				urlCMC: URLS.COIN_MARKET_CAP_WILD,
				dividerCopy: LABELS.DIVIDER_COPY_WILD,
			});
		}
	}, [
		isRoot,
		wildPercentageChange,
		wildPriceUsd,
		zeroPercentageChange,
		zeroPriceUsd,
	]);

	useEffect(() => {
		isMounted.current = true;
		getTokenData();
		return () => {
			isMounted.current = false;
		};
	}, [getTokenData]);

	/////////////////////
	// React Fragments //
	/////////////////////

	//- Current Price
	const currentPriceDetails = (size: string, title?: string) => {
		const isSizeSmall =
			size === Size.SML ? styles.CurrentPriceSml : styles.CurrentPriceLrg;

		return (
			<div className={size === Size.SML ? styles.Details : ''}>
				{title && (
					<span
						data-testid={selectors.tokenTitle}
						className={styles.TickerName}
					>
						{title}
					</span>
				)}
				<div className={styles.CurrentPriceContainer}>
					<span className={isSizeSmall}>
						${formatByDecimalPlace(Number(data?.tokenPrice), 4)}
					</span>
					<span
						className={`${styles.PercentageChange} ${
							Number(data?.percentageChange) < 0
								? styles.PercentageChangeNegative
								: styles.PercentageChangePositive
						}`}
					>
						{size === Size.LRG
							? `(${formatByDecimalPlace(Number(data?.percentageChange), 1)}%)`
							: `${formatByDecimalPlace(Number(data?.percentageChange), 1)}%`}
					</span>
				</div>
			</div>
		);
	};

	//- External Url
	const externalUrl = () => (
		<div className={styles.ExternalUrl}>
			<a
				data-testid={selectors.coinMarketCapRedirect}
				href={data?.urlCMC}
				target="_blank"
				rel="noreferrer"
			>
				{LABELS.COIN_MARKET_CAP_BTN}
			</a>
			<img alt={LABELS.EXTERNAL_URL_ICON} src={openExternalUrl} />
		</div>
	);

	//- Divider
	const divider = () => (
		<>
			<p data-testid={selectors.dividerCopy} className={styles.DividerCopy}>
				{data?.dividerCopy}
			</p>
			<div className={styles.Divider}></div>
		</>
	);

	//- Url Icon Row
	const externalUrlRow = (
		urlList?: {
			title: string;
			href: string;
			src: string;
		}[],
	) => (
		<div className={styles.UrlRowContainer}>
			{urlList?.map((item) => (
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
		<div
			data-testid={selectors.dropDownButton}
			className={styles.PriceContainer}
		>
			{currentPriceDetails(Size.SML, data?.tokenTitle)}
		</div>
	);

	const dropdownContent = (
		<div
			data-testid={selectors.dropDownContent}
			className={`${styles.DropdownContent}`}
		>
			<div className={`${styles.Section} ${styles.SectionBaseline}`}>
				{currentPriceDetails(Size.LRG)}
				{externalUrl()}
			</div>
			<div className={`${styles.Section} ${styles.SectionCenter}`}>
				{divider()}
			</div>
			<div className={styles.Section}>{externalUrlRow(data?.urlList)}</div>
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

export default PriceWidget;
