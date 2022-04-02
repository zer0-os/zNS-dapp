import React, { useMemo, useState } from 'react';
import { TextInput } from 'components';
import {
	MintDataKey,
	FORM_PLACEHOLDERS,
	FORM_ERRORS,
} from './MintDAOForm.constants';
import { MintData } from '../../MintDAO.types';
import styles from './MintDAOForm.module.scss';

interface MintDAOFormProps {
	mintData?: MintData;
	onChange: (mintdata: MintData) => void;
}

export const MintDAOForm: React.FC<MintDAOFormProps> = ({
	mintData,
	onChange,
}) => {
	const [currentMintData, setCurrentMintData] = useState<MintData>({
		[MintDataKey.name]: mintData?.daoName || '',
		[MintDataKey.address]: mintData?.gnosisSafeAddress || '',
	});
	const [formValueChanged, setFormValueChanged] = useState({
		[MintDataKey.name]: false,
		[MintDataKey.address]: false,
	});

	const hasFormError = useMemo(() => {
		return {
			[MintDataKey.name]:
				!Boolean(currentMintData[MintDataKey.name]) &&
				formValueChanged[MintDataKey.name],
			[MintDataKey.address]:
				!Boolean(currentMintData[MintDataKey.address]) &&
				formValueChanged[MintDataKey.address],
		};
	}, [currentMintData, formValueChanged]);

	const onChangeFormField = (key: MintDataKey) => (value: string) => {
		const changedMintData: MintData = {
			...currentMintData,
			[key]: value,
		};
		setCurrentMintData(changedMintData);
		setFormValueChanged({
			...formValueChanged,
			[key]: true,
		});
		onChange(changedMintData);
	};

	return (
		<div className={styles.MintDAOFormContainer}>
			<div className={styles.MintDAOFormField}>
				<TextInput
					placeholder={FORM_PLACEHOLDERS[MintDataKey.name]}
					onChange={onChangeFormField(MintDataKey.name)}
					text={currentMintData[MintDataKey.name]}
					error={hasFormError[MintDataKey.name]}
					errorText={FORM_ERRORS[MintDataKey.name]}
				/>
			</div>

			<div className={styles.MintDAOFormField}>
				<TextInput
					placeholder={FORM_PLACEHOLDERS[MintDataKey.address]}
					onChange={onChangeFormField(MintDataKey.address)}
					text={currentMintData[MintDataKey.address]}
					error={hasFormError[MintDataKey.address]}
					errorText={FORM_ERRORS[MintDataKey.address]}
				/>
			</div>
		</div>
	);
};
