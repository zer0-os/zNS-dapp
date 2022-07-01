import { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import type { Proposal, zDAO } from '@zero-tech/zdao-sdk';
import type { Option } from 'components/Dropdowns/OptionDropdown';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { usePropsState } from 'lib/hooks/usePropsState';
import config from 'config';
import {
	ProposalInputFieldKeys,
	ProposalFormDefaultValues,
	ProposalFormDefaultErrors,
	DEFAULT_VOTE_DURATION_SECONDS,
	DEFAULT_VOTE_CHOICES,
	NEW_PROPOSAL_TWEET_OPTION,
} from '../CreateProposal.constants';
import { getTokenOption, getVotingDetails } from '../CreateProposal.helpers';
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
	const { active, account, library } = useWeb3React<Web3Provider>();

	// Form Nav
	const history = useHistory();
	const toAllProposals = useMemo(() => {
		const pathname = history.location.pathname.replace(
			`/${DAO_CREATE_PROPPAL}`,
			'',
		);
		const state = cloneDeep(history.location.state);

		return {
			pathname,
			state,
		};
	}, [history]);

	// Form Changes
	const [isFormChanged, setFormIsChanged] = useState<boolean>(false);
	const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);
	const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);
	const [showSuccessConfirm, setShowSuccessConfirm] = useState<boolean>(false);
	const [createdProposal, setCreatedProposal] = useState<Proposal>();

	// Form Values
	const [formValues, setFormValues] = usePropsState<
		Record<ProposalInputFieldKeys, string | undefined>
	>({
		...ProposalFormDefaultValues,
		[ProposalInputFieldKeys.TOKEN]: tokenDropdownOptions[0].value,
		[ProposalInputFieldKeys.SENDER]: dao?.safeAddress,
	});

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
			if (value === ProposalFormDefaultValues[fieldKey]) {
				setFormErrors({
					...formErrors,
					[fieldKey]: 'This field is required',
				});
			} else {
				setFormErrors({
					...formErrors,
					[fieldKey]: undefined,
				});
			}

			if (!isFormChanged) setFormIsChanged(true);

			setFormValues({
				...formValues,
				[fieldKey]: value,
			});
		},
		[formValues, formErrors, isFormChanged, setFormValues, setFormErrors],
	);

	const handleFormSubmit = useCallback(() => {
		setFormErrors(ProposalFormDefaultErrors);

		const errorKeys: ProposalInputFieldKeys[] = [];

		for (const fieldKey in formValues) {
			if (
				formValues[fieldKey as ProposalInputFieldKeys] ===
				ProposalFormDefaultValues[fieldKey as ProposalInputFieldKeys]
			) {
				errorKeys.push(fieldKey as ProposalInputFieldKeys);
			}
		}

		if (errorKeys.length) {
			const updatedFormErrors = cloneDeep(formErrors);
			for (const errorKey of errorKeys) {
				updatedFormErrors[errorKey] = 'This field is required';
			}
			setFormErrors(updatedFormErrors);
		} else {
			setShowPublishConfirm(true);
		}
	}, [formValues, formErrors, setFormErrors]);

	const handleGoToAllProposals = () => {
		if (isFormChanged) {
			setShowDiscardConfirm(true);
		} else {
			history.replace(toAllProposals);
		}
	};

	const handleDiscardConfirmCancel = () => {
		history.replace(toAllProposals);
		setShowDiscardConfirm(false);
	};

	const handleDiscardConfirm = () => {
		setShowDiscardConfirm(false);
	};

	const handlePublishConfirmCancel = () => {
		setShowPublishConfirm(false);
		setFormSubmitErrorMessage(undefined);
	};

	const handlePublishConfirm = async () => {
		if (!dao || !active || !account || !library) {
			return;
		}

		setIsFormSubmitting(true);
		setFormSubmitErrorMessage(undefined);

		try {
			// await new Promise((res) => setTimeout(res, 5000));
			const newProposal = await dao.createProposal(library, account, {
				title: formValues.title!,
				body: formValues.body!,
				choices: DEFAULT_VOTE_CHOICES,
				duration: DEFAULT_VOTE_DURATION_SECONDS,
				snapshot: library?.blockNumber,
				transfer: {
					abi: '',
					sender: formValues.sender!,
					recipient: formValues.recipient!,
					amount: formValues.amount!,
					...dao.votingToken,
					token: formValues.token!,
				},
			});

			setCreatedProposal(newProposal);
			setShowSuccessConfirm(true);
			setShowPublishConfirm(false);
		} catch (e) {
			console.error(e);
			//if user rejects transaction
			if (e.code === 4001) {
				setFormSubmitErrorMessage('Transaction denied by wallet');
			} else {
				setFormSubmitErrorMessage('Failed to create a proposal, try again');
			}
		} finally {
			setIsFormSubmitting(false);
		}
	};

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
	useUpdateEffect(handleGoToAllProposals, [triggerCancel]);

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
			Discard: {
				show: showDiscardConfirm,
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
