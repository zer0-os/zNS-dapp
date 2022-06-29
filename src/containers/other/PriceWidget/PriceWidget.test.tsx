//- Test Imports
import { renderWithRedux } from 'lib/testUtils';
import { currencyReady } from 'store/currency/currency.mockData';

//- Constants Imports
import { LABELS } from './constants';
import { URLS } from 'constants/urls';

//- Components Imports
import PriceWidget from './PriceWidget';

//- Selectors Imports
import * as selectors from './selectors';

const setUp = (isRoot: boolean) =>
	renderWithRedux(<PriceWidget isRoot={isRoot} />);

describe('PriceWidget', () => {
	it('should contain dropdown button', () => {
		const isRoot = true;
		const { getByTestId } = setUp(isRoot);

		expect(getByTestId(selectors.dropDownButton)).toBeInTheDocument();
	});

	it('should contain dropdown content', () => {
		const isRoot = true;
		const { getByTestId } = setUp(isRoot);

		expect(getByTestId(selectors.dropDownContent)).toBeInTheDocument();
	});

	describe('when isRoot true', () => {
		describe('dropdown button', () => {
			it('should contain Zero token information', () => {
				const isRoot = true;
				const { getByTestId } = setUp(isRoot);

				const dropDownButton = getByTestId(selectors.dropDownButton);
				const tokenTitle = getByTestId(selectors.tokenTitle);

				// DropDown Button Assertions
				expect(tokenTitle).toHaveTextContent(LABELS.ZERO_TICKER);
				expect(dropDownButton).toHaveTextContent(
					`${currencyReady.zeroPriceUsd}`,
				);
				expect(dropDownButton).toHaveTextContent(
					`${currencyReady.zeroPercentageChange}`,
				);
			});
		});

		describe('dropdown content', () => {
			it('should contain Zero token information', () => {
				const isRoot = true;
				const { getByTestId } = setUp(isRoot);

				const dropDownContent = getByTestId(selectors.dropDownContent);
				const dividerCopy = getByTestId(selectors.dividerCopy);
				const urlCMC = getByTestId(selectors.coinMarketCapRedirect);

				// DropDown Content Assertions
				expect(dropDownContent).toHaveTextContent(
					`${currencyReady.zeroPriceUsd}`,
				);
				expect(dropDownContent).toHaveTextContent(
					`${currencyReady.zeroPercentageChange}`,
				);
				expect(dividerCopy).toHaveTextContent(LABELS.DIVIDER_COPY_ZERO);
				expect(urlCMC).toHaveAttribute('href', URLS.COIN_MARKET_CAP_ZERO);
			});
		});

		describe('when isRoot false', () => {
			describe('dropdown button', () => {
				it('should contain Wild token information', () => {
					const isRoot = false;
					const { getByTestId } = setUp(isRoot);

					const dropDownButton = getByTestId(selectors.dropDownButton);
					const tokenTitle = getByTestId(selectors.tokenTitle);

					// DropDown Button Assertions
					expect(tokenTitle).toHaveTextContent(LABELS.WILD_TICKER);
					expect(dropDownButton).toHaveTextContent(
						`${currencyReady.wildPriceUsd}`,
					);
					expect(dropDownButton).toHaveTextContent(
						`${currencyReady.wildPercentageChange}`,
					);
				});
			});

			describe('dropdown content', () => {
				it('should contain Wild token information', () => {
					const isRoot = false;
					const { getByTestId } = setUp(isRoot);

					const dropDownContent = getByTestId(selectors.dropDownContent);
					const dividerCopy = getByTestId(selectors.dividerCopy);
					const urlCMC = getByTestId(selectors.coinMarketCapRedirect);

					// DropDown Content Assertions
					expect(dropDownContent).toHaveTextContent(
						`${currencyReady.wildPriceUsd}`,
					);
					expect(dropDownContent).toHaveTextContent(
						`${currencyReady.wildPercentageChange}`,
					);
					expect(dividerCopy).toHaveTextContent(LABELS.DIVIDER_COPY_WILD);
					expect(urlCMC).toHaveAttribute('href', URLS.COIN_MARKET_CAP_WILD);
				});
			});
		});
	});
});
