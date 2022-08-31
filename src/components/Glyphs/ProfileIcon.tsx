//- Component Imports
import { Svg } from './Svg';

interface ProfileIconProps {
	title?: string;
	stroke?: string;
}

const ProfileIcon = ({ title = '', stroke = '' }: ProfileIconProps) => (
	<Svg title={title} width="24" height="24" viewBox="0 0 24 24" fill="none">
		<g>
			<title>Layer 1</title>
			<g id="surface1" stroke={stroke}>
				<path
					style={{
						strokeWidth: 1,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 4,
					}}
					d="M 20 21 L 20 19 C 20 16.789062 18.210938 15 16 15 L 8 15 C 5.789062 15 4 16.789062 4 19 L 4 21 "
				/>
				<path
					style={{
						strokeWidth: 1,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 4,
					}}
					d="M 16 7 C 16 9.210938 14.210938 11 12 11 C 9.789062 11 8 9.210938 8 7 C 8 4.789062 9.789062 3 12 3 C 14.210938 3 16 4.789062 16 7 Z M 16 7 "
					stroke={stroke}
				/>
			</g>
		</g>
	</Svg>
);

export default ProfileIcon;
