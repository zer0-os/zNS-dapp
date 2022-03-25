// Style Imports
import styles from './Wizard.module.scss';
import classNames from 'classnames/bind';

// Preset Screens
import Loading from './Presets/Loading';
import Buttons from './Presets/Buttons';
import Confirmation from './Presets/Confirmation';
import NFTDetails from './Presets/NFTDetails';

type WizardProps = {
	header: string;
	subHeader?: string;
	children: React.ReactNode;
	className?: string;
	onClick?: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
};

const Wizard = ({
	header,
	subHeader,
	children,
	className,
	onClick,
}: WizardProps) => (
	<div
		className={classNames(
			styles.Container,
			className,
			'border-rounded border-primary background-primary',
		)}
		onClick={onClick && onClick}
	>
		{/* Header */}
		<div className={styles.Header}>
			<h1 className="glow-text-white">{header}</h1>
			{subHeader && <h2 className="glow-text-white">{subHeader}</h2>}
			<hr className="glow" />
		</div>

		{/* Wizard Body */}
		{children}
	</div>
);

// Include sub-components in export
Wizard.Loading = Loading;
Wizard.Buttons = Buttons;
Wizard.Confirmation = Confirmation;
Wizard.NFTDetails = NFTDetails;

export default Wizard;
