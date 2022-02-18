import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'store';
import {
	setTransferringRequest as reduxSetTransferringRequest,
	setTransferredRequest as reduxSetTransferredRequest,
} from 'store/transfer/actions';
import { getTransferring, getTransferred } from 'store/transfer/selectors';
import { TransferSubmitParams } from 'lib/types';
import { TransferState } from '../types';

export type UseTransferReduxReturn = {
	reduxState: TransferState;
	reduxActions: {
		setTransferring: (params: TransferSubmitParams) => void;
		setTransferred: (params: TransferSubmitParams) => void;
	};
};

export const useTransferRedux = (): UseTransferReduxReturn => {
	const dispatch = useDispatch();

	const reduxState = useSelector((state: AppState) => ({
		transferring: getTransferring(state),
		transferred: getTransferred(state),
	}));

	const setTransferring = useCallback(
		(params: TransferSubmitParams) => {
			dispatch(reduxSetTransferringRequest(params));
		},
		[dispatch],
	);

	const setTransferred = useCallback(
		(params: TransferSubmitParams) => {
			dispatch(reduxSetTransferredRequest(params));
		},
		[dispatch],
	);

	const reduxActions = useMemo(
		() => ({
			setTransferring,
			setTransferred,
		}),
		[setTransferring, setTransferred],
	);

	return { reduxState, reduxActions };
};
