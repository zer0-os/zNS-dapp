//- React Imports
import React from 'react';

//- Lib Imports
import { ModalContext } from 'lib/providers/ModalProvider/ModalContext';

export const useModal = () => React.useContext(ModalContext);
