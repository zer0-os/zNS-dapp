//- React Imports
import React from 'react';

//- Lib Imports
import { NFTViewModalContext } from '../providers/NFTViewModalProvider/NFTViewModalProvider.context';

export const useNFTViewModal = () => React.useContext(NFTViewModalContext);
