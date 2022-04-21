//- Component Imports
import { Svg } from './Svg';

interface ProfileIconProps {
	title?: string;
	stroke?: string;
}

const ProfileIcon = ({ title, stroke }: ProfileIconProps) => (
	<Svg title={title} width="24" height="24" viewBox="0 0 24 24" fill="none">
		<>
			<rect
				id="backgroundrect"
				width="100%"
				height="100%"
				x="0"
				y="0"
				fill="none"
				stroke="none"
			/>

			<path
				strokeWidth="1"
				strokeMiterlimit="4"
				strokeLinecap="round"
				strokeLinejoin="round"
				stroke={stroke}
				strokeOpacity="1"
				fill="none"
				fillOpacity="1"
			/>
			<path
				strokeWidth="1"
				strokeMiterlimit="4"
				strokeLinecap="round"
				strokeLinejoin="round"
				stroke={stroke}
				strokeOpacity="1"
				fill="none"
				fillOpacity="1"
			/>
		</>
	</Svg>
);

ProfileIcon.defaultProps = {
	title: '',
	stroke: '',
};

export default ProfileIcon;
