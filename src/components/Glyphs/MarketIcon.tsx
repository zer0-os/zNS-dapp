//- Component Imports
import { Svg } from './Svg';

interface MarketIconProps {
	title?: string;
	stroke?: string;
}

const MarketIcon = ({ title = '', stroke = '' }: MarketIconProps) => (
	<Svg title={title} width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M11.9872 17.9444V3M19.1144 4.27751L4.80341 4.29354M7.59589 12.7705L4.80524 4.30768L2.01641 12.7705M21.9836 12.742L19.1948 4.27916L16.4041 12.742M17.9756 21H5.99893C5.95695 21 5.9241 20.9679 5.9241 20.927V18.0478C5.9241 18.0068 5.95695 17.9748 5.99893 17.9748H17.9756C18.0175 17.9748 18.0504 18.0068 18.0504 18.0478V20.927C18.0504 20.9679 18.0175 21 17.9756 21ZM7.61051 12.817C7.61051 14.392 6.35481 15.6676 4.80526 15.6676C3.2557 15.6676 2 14.392 2 12.817H7.61051ZM22 12.817C22 14.392 20.7443 15.6676 19.1947 15.6676C17.6452 15.6676 16.3895 14.392 16.3895 12.817H22Z"
			stroke={stroke}
			strokeMiterlimit="10"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
);

export default MarketIcon;
