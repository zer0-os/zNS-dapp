import React from 'react';
import { renderWithRedux } from './renderWithRedux';

export const renderHook = (
	hook: { (): any },
	state = {},
	reduxState = {},
): any => {
	let hookData;

	const MockComponent: React.FC = () => {
		hookData = hook();

		return null;
	};

	renderWithRedux(<MockComponent />, state, reduxState);

	return hookData;
};
