//- Component Imports
import { Svg } from './Svg';

interface StakingIconProps {
	title?: string;
	stroke?: string;
}

const StakingIcon = ({ title = '', stroke = '' }: StakingIconProps) => (
	<Svg title={title} width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M5.75 19.5V22M18.25 19.5V22M12 13.25C14.0711 13.25 15.75 11.5711 15.75 9.5C15.75 7.42893 14.0711 5.75 12 5.75C9.92893 5.75 8.25 7.42893 8.25 9.5C8.25 11.5711 9.92893 13.25 12 13.25ZM12 13.25V16.375M4.5 19.5H19.5C20.8807 19.5 22 18.3807 22 17V4.5C22 3.11929 20.8807 2 19.5 2H4.5C3.11929 2 2 3.11929 2 4.5V17C2 18.3807 3.11929 19.5 4.5 19.5Z"
			stroke={stroke}
			strokeMiterlimit="10"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
);

export default StakingIcon;
