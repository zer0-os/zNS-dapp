//- Style Imports
import classNames from 'classnames';
import styles from './HoverDropdown.module.scss';

//- Props
interface HoverDropdownProps {
	triggerContent: React.ReactNode;
	children: React.ReactNode;
	direction?: 'up' | 'down';
}

const HoverDropdown: React.FC<HoverDropdownProps> = ({
	triggerContent,
	children,
	direction = 'down',
}: HoverDropdownProps) => {
	return (
		<>
			<div className={styles.TriggerContentContainer}>
				{triggerContent}
				<div
					className={classNames(
						styles.DropdownContentContainer,
						styles[direction],
					)}
				>
					<div>{children}</div>
				</div>
			</div>
		</>
	);
};

export default HoverDropdown;
