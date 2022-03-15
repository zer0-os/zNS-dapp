//- Style Imports
import styles from './HoverDropdown.module.scss';

//- Props
interface HoverDropdownProps {
	triggerContent: React.ReactNode;
	children: React.ReactNode;
}

const HoverDropdown: React.FC<HoverDropdownProps> = ({
	triggerContent,
	children,
}: HoverDropdownProps) => {
	return (
		<>
			<div className={styles.TriggerContentContainer}>
				{triggerContent}
				<div className={styles.DropdownContentContainer}>
					<div className={styles.Content}>{children}</div>
				</div>
			</div>
		</>
	);
};

export default HoverDropdown;
