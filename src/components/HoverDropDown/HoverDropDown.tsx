//- Style Imports
import styles from './HoverDropDown.module.scss';

//- Props
interface HoverDropDownProps {
	triggerContent: React.ReactNode;
	children: React.ReactNode;
}

const HoverDropDown: React.FC<HoverDropDownProps> = ({
	triggerContent,
	children,
}: HoverDropDownProps) => {
	////////////
	// Render //
	////////////
	return (
		<>
			<div className={styles.TriggerContentContainer}>
				{triggerContent}
				<div className={styles.DropdownContentContainer}>
					<div>{children}</div>
				</div>
			</div>
		</>
	);
};

export default HoverDropDown;
