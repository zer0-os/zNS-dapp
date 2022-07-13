import { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import type { Proposal, zDAO } from '@zero-tech/zdao-sdk';
import type { Option } from 'components/Dropdowns/OptionDropdown';
import { parseUnits } from 'ethers/lib/utils';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { usePropsState } from 'lib/hooks/usePropsState';
import { useValidateRouteChanges } from 'lib/hooks/useValidateRouteChanges';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';
import config from 'config';
import {
	ProposalInputFieldKeys,
	ProposalFormDefaultValues,
	ProposalFormDefaultErrors,
	DEFAULT_VOTE_DURATION_SECONDS,
	DEFAULT_VOTE_CHOICES,
	NEW_PROPOSAL_TWEET_OPTION,
} from '../CreateProposal.constants';
import {
	getTokenOption,
	getVotingDetails,
	isValidERC20Address,
	validateCreateProposalForm,
} from '../CreateProposal.helpers';
import { DAO_CREATE_PROPPAL } from '../../../Proposals/Proposals.constants';

export const useCreateProposalForm = ({
	dao,
	triggerCancel,
	tokenDropdownOptions,
}: {
	dao?: zDAO;
	triggerCancel: boolean;
	tokenDropdownOptions: Option[];
}) => {
	// Web3
	const { active, account, library } = useWeb3React<Web3Provider>();

	// Proposals
	const { fetch: refetchProposals } = useProposals();

	// Form Nav
	const history = useHistory();
	const toAllProposalsPath = useMemo(() => {
		return history.location.pathname.replace(`/${DAO_CREATE_PROPPAL}`, '');
	}, [history]);

	// Form Changes
	const defaultDiscardConfirm = {
		show: false,
		pathname: toAllProposalsPath,
	};
	const [discardConfirm, setDiscardConfirm] = useState<{
		show: boolean;
		pathname: string;
	}>(defaultDiscardConfirm);
	const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);
	const [showSuccessConfirm, setShowSuccessConfirm] = useState<boolean>(false);
	const [createdProposal, setCreatedProposal] = useState<Proposal>();

	// Form Values
	const defaultDaoProposalFormValues = {
		...ProposalFormDefaultValues,
		[ProposalInputFieldKeys.TOKEN]: tokenDropdownOptions[0].value,
		[ProposalInputFieldKeys.SENDER]: dao?.safeAddress,
	};
	const [formValues, setFormValues] = usePropsState<
		Record<ProposalInputFieldKeys, string | undefined>
	>(defaultDaoProposalFormValues);

	// Form Errors
	const [formErrors, setFormErrors] = useState<
		Record<ProposalInputFieldKeys, string | undefined>
	>(ProposalFormDefaultErrors);

	// Form Submit
	const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
	const [formSubmitErrorMessage, setFormSubmitErrorMessage] =
		useState<string>();

	// Form Data
	const tokenOptions = useMemo(() => {
		if (!formValues.token) {
			return tokenDropdownOptions;
		}

		const selectedTokenOption = getTokenOption(
			tokenDropdownOptions,
			formValues.token,
		);
		const otherTokenOptions = tokenDropdownOptions.filter(
			({ value }) => value !== selectedTokenOption!.value,
		);

		return [selectedTokenOption, ...otherTokenOptions] as Option[];
	}, [tokenDropdownOptions, formValues]);

	const votingDetails = getVotingDetails();

	// Handlers
	const handleChange = useCallback(
		(fieldKey: ProposalInputFieldKeys) => (value: string) => {
			if (value) {
				setFormErrors({
					...formErrors,
					[fieldKey]: undefined,
				});
			}

			if (fieldKey === ProposalInputFieldKeys.RECIPIENT && value) {
				setFormErrors({
					...formErrors,
					[fieldKey]: !isValidERC20Address(value)
						? 'Please enter a valid ethereum wallet address'
						: undefined,
				});
			}

			setFormValues({
				...formValues,
				[fieldKey]: value,
			});
		},
		[formValues, formErrors, setFormValues, setFormErrors],
	);

	const handleFormSubmit = useCallback(() => {
		setFormErrors(ProposalFormDefaultErrors);

		const errors = validateCreateProposalForm(formValues);

		if (Object.values(errors).some(Boolean)) {
			setFormErrors(errors);
		} else {
			setShowPublishConfirm(true);
		}
	}, [formValues, setFormErrors]);

	const handleLeaveCreateProposalForm = (
		pathname: string = toAllProposalsPath,
	) => {
		if (!isEqual(formValues, defaultDaoProposalFormValues)) {
			setDiscardConfirm({
				show: true,
				pathname,
			});
		} else {
			history.push(pathname);
		}
	};

	const handleDiscardConfirmCancel = () => {
		history.push(discardConfirm.pathname);
		setDiscardConfirm(defaultDiscardConfirm);
	};

	const handleDiscardConfirm = () => {
		setDiscardConfirm(defaultDiscardConfirm);
	};

	const handlePublishConfirmCancel = () => {
		setShowPublishConfirm(false);
		setFormSubmitErrorMessage(undefined);
	};

	const handlePublishConfirm = useCallback(async () => {
		if (!dao || !active || !account || !library) {
			return;
		}

		const snapshot = await library.getBlockNumber();

		if (!snapshot) return;

		setIsFormSubmitting(true);
		setFormSubmitErrorMessage(undefined);

		try {
			const newProposal = await dao.createProposal(library, account, {
				title: formValues.title!,
				body: formValues.body!,
				choices: DEFAULT_VOTE_CHOICES,
				duration: DEFAULT_VOTE_DURATION_SECONDS,
				snapshot,
				transfer: {
					abi: '',
					sender: formValues.sender!,
					recipient: formValues.recipient!,
					amount: parseUnits(formValues.amount!).toString(),
					...dao.votingToken,
					token: formValues.token!,
				},
			});

			refetchProposals();

			setCreatedProposal(newProposal);
			setShowSuccessConfirm(true);
			setShowPublishConfirm(false);
		} catch (e) {
			console.error(e);
			// if user rejects transaction
			if (e.code === 4001) {
				setFormSubmitErrorMessage('Transaction denied by wallet');
			} else {
				setFormSubmitErrorMessage('Failed to create a proposal, try again');
			}
		} finally {
			setIsFormSubmitting(false);
		}
	}, [
		dao,
		active,
		account,
		library,
		formValues,
		refetchProposals,
		setIsFormSubmitting,
		setCreatedProposal,
		setShowSuccessConfirm,
		setShowPublishConfirm,
		setFormSubmitErrorMessage,
	]);

	const handleTweet = () => {
		if (createdProposal) {
			const pathname = history.location.pathname.replace(
				`/${DAO_CREATE_PROPPAL}`,
				`/${createdProposal.id}`,
			);
			const newProposalUrl = encodeURIComponent(`${config.baseURL}${pathname}`);

			window.open(
				NEW_PROPOSAL_TWEET_OPTION.URL.replace(
					/NEW_PROPOSAL_TWEET_URL/g,
					newProposalUrl,
				),
				'',
				NEW_PROPOSAL_TWEET_OPTION.OPTIONS,
			);
		}
	};

	const handleViewCreatedProposal = () => {
		if (createdProposal) {
			const pathname = history.location.pathname.replace(
				`/${DAO_CREATE_PROPPAL}`,
				`/${createdProposal.id}`,
			);

			history.push(pathname);
		}
	};

	// Form Cancel
	useUpdateEffect(handleLeaveCreateProposalForm, [triggerCancel]);

	// Block other page clickings
	useValidateRouteChanges({
		unblockCheckCallback: (pathname: string): boolean => {
			return (
				isEqual(formValues, defaultDaoProposalFormValues) ||
				pathname === discardConfirm.pathname ||
				Boolean(createdProposal)
			);
		},
		blockCallback: (pathname: string) => {
			setDiscardConfirm({
				show: true,
				pathname,
			});
		},
	});

	return {
		formValues,
		formErrors,
		formData: {
			tokenOptions,
			votingDetails,
		},
		formSubmition: {
			isSubmitting: isFormSubmitting,
			error: formSubmitErrorMessage,
		},
		formConfirm: {
			Overlay: {
				show: discardConfirm.show || showPublishConfirm || showSuccessConfirm,
				hasCloseButton: !(isFormSubmitting || showSuccessConfirm),
				onClose: () => {
					if (discardConfirm.show) return handleDiscardConfirm();
					if (showPublishConfirm) return handlePublishConfirmCancel();

					return null;
				},
			},
			Discard: {
				show: discardConfirm.show,
				onCancel: handleDiscardConfirmCancel,
				onConfirm: handleDiscardConfirm,
			},
			Publish: {
				show: showPublishConfirm,
				onCancel: handlePublishConfirmCancel,
				onConfirm: handlePublishConfirm,
			},
			Success: {
				show: showSuccessConfirm,
				onCancel: handleTweet,
				onConfirm: handleViewCreatedProposal,
			},
		},
		handleChange,
		handleFormSubmit,
	};
};
