import { useMemo } from 'react';
import {
	WILDER_WORLD_KEYS,
	ZERO_TECK_KEYS,
	ZNS_INFO_OPTIONS,
	ZNS_OTHER_OPTIONS,
} from '../InfoPanel.constants';

export const useInfoPanelData = () => {
	const formattedData = useMemo(() => {
		const wilderWorldOptions = WILDER_WORLD_KEYS.map(
			(key) => ZNS_INFO_OPTIONS[key],
		);
		const zeroTechOptions = ZERO_TECK_KEYS.map((key) => ZNS_INFO_OPTIONS[key]);
		const otherOptions = ZNS_OTHER_OPTIONS;

		return {
			wilderWorldOptions,
			zeroTechOptions,
			otherOptions,
		};
	}, []);

	return {
		formattedData,
	};
};
