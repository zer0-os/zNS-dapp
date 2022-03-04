import React from 'react';
import './_toggle-switch.scss';

type ToggleSwitchProps = {
	checked: boolean;
	labels?: string[];
	onChange: (checked: boolean) => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
	checked,
	labels = ['On', 'Off'],
	onChange,
}) => {
	const id = `toggle-switch-id-${Math.random()}`;

	return (
		<div className="toggle-switch">
			<input
				type="checkbox"
				className="toggle-switch-checkbox"
				id={id}
				checked={checked}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onChange(e.target.checked)
				}
			/>
			<label className="toggle-switch-label" htmlFor={id}>
				<span
					className="toggle-switch-inner"
					data-yes={labels[0]}
					data-no={labels[1]}
				/>
				<span className="toggle-switch-switch" />
			</label>
		</div>
	);
};

export default ToggleSwitch;
