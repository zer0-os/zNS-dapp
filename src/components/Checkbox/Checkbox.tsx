//- React Imports
import React, { useState } from 'react';

//- Style Imports
import styles from './Checkbox.module.scss';

//- Interface Declarations
interface CheckboxProps {
	name: string;
	id: string;
	selected?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ name, id, selected, ...rest }) => {
	const [checked, setCkecked] = useState(selected);

	const handleChange = () => {
		setCkecked(!checked);
	};

	return (
		<>
			<input
				className={styles.Checkbox + (checked ? ` ${styles.Checked}` : '')}
				type="checkbox"
				name={name}
				id={id}
				onChange={handleChange}
				{...rest}
			/>
			<div
				className={styles.Icon}
				style={{ display: checked ? 'inline-block' : 'none' }}
			>
				<svg
					width="10"
					height="8"
					viewBox="0 0 10 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M1 4.2L3.54545 7L9 1" stroke="#58C573" />
				</svg>
			</div>
		</>
	);
};

export default Checkbox;
