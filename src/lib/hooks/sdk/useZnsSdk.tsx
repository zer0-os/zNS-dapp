import React from 'react';
import { SdkContext } from 'lib/providers/ZnsSdkProvider';

export function useZnsSdk() {
	const { instance } = React.useContext(SdkContext);
	return { instance };
}
