//- React Imports
import React from 'react';

// Modal Type Imports
import * as modalTypes from './NFTViewModalProvider.types';

export const NFTViewModalContext =
	React.createContext<modalTypes.NFTViewModalContextProps>({
		openModal: () => {},
		closeModal: () => {},
		modalContent: null,
	});
