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
	headerClassName?: string;
	subHeader?: string;
	children: React.ReactNode;
	className?: string;
	sectionDivider?: boolean;
};

const Wizard = ({
	header,
	headerClassName,
	subHeader,
	children,
	className,
	sectionDivider = true,
}: WizardProps) => (
	<div
		className={classNames(
			styles.Container,
			className,
			'border-rounded border-primary background-primary',
		)}
	>
		{/* Header */}
		<div className={classNames(styles.Header, headerClassName)}>
			<h1 className="glow-text-white">{header}</h1>
			{subHeader && <h2>{subHeader}</h2>}
			{sectionDivider && <hr className="glow" />}
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
