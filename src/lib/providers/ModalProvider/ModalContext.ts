//- React Imports
import React from 'react';

// Modal Type Imports
import * as modalTypes from './ModalTypes';

export const ModalContext = React.createContext<modalTypes.ModalContextProps>({
	openModal: () => {},
	closeModal: () => {},
	modalContent: null,
});
