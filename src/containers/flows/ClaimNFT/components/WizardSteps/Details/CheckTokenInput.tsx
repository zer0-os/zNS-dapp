import { TEXT_INPUT } from './Details.constants';
import { useState } from 'react';
import styles from './Details.module.scss';

import classNames from 'classnames/bind';
import { TextInput } from 'components';
import { FutureButton } from '../../../../../../components';
import useIsClaimable, { Status } from '../../../hooks/useIsClaimable';

const cx = classNames.bind(styles);

const CheckTokenInput = () => {
	const [inputValue, setInputValue] = useState<string | undefined>();

	const { checkClaimable, helperText, status, resetState } = useIsClaimable();

	const check = () => {
		if (inputValue && inputValue.length) {
			checkClaimable(inputValue);
		}
	};

	return (
		<>
			<div
				className={cx(styles.InputContainer, {
					hasValue: inputValue?.length,
					hasNotification: helperText !== undefined,
				})}
			>
				{inputValue && (
					<span
						className={cx(styles.SecondaryPlaceholder, {
							hasError: status === Status.ERROR,
							hasSuccess: status === Status.SUCCESS,
						})}
					>
						{TEXT_INPUT.PLACEHOLDER}
					</span>
				)}
				<TextInput
					className={cx(styles.Input, {
						hasValue: (inputValue ?? '').length > 0,
						hasError: status === Status.ERROR,
					})}
					onChange={(val: string) => {
						resetState();
						setInputValue(val);
					}}
					placeholder={TEXT_INPUT.PLACEHOLDER}
					text={inputValue}
					type={TEXT_INPUT.TYPE}
					disabled={status === Status.LOADING}
				/>

				<div className={styles.ButtonContainer}>
					<FutureButton
						glow={(inputValue ?? '').length > 0}
						disabled={(inputValue ?? '').length === 0}
						onClick={check}
						loading={status === Status.LOADING}
					>
						{TEXT_INPUT.BUTTON}
					</FutureButton>
				</div>
			</div>
			{helperText && (
				<div
					className={cx(styles.InputNotification, {
						hasError: status === Status.ERROR,
						hasSuccess: status === Status.SUCCESS,
					})}
				>
					{helperText}
				</div>
			)}
		</>
	);
};

export default CheckTokenInput;
