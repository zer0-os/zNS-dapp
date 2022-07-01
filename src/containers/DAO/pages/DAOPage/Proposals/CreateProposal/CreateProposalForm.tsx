import React from 'react';

// - Library
import type { zDAO } from '@zero-tech/zdao-sdk';
import classNames from 'classnames';

// - Hooks
import { useCreateProposalForm } from './hooks';

// - Component
import {
	MarkDownEditor,
	OptionDropdown,
	TextInputWithTopPlaceHolder,
	Tooltip,
	QuestionButton,
	EtherscanLink,
	FutureButton,
	Overlay,
	Confirmation,
	LoadingIndicator,
} from 'components';

// - Types
import type { Option } from 'components/Dropdowns/OptionDropdown';
import { VotingDetailItem } from './CreateProposal.types';

// - Constants
import {
	ProposalCreateSections,
	ProposalInputFieldKeys,
	ProposalInputFields,
	ProposalFormConfirmModalText,
} from './CreateProposal.constants';

// - Helpers
import { getTokenOption } from './CreateProposal.helpers';

// - Assets
import ChevronDownIcon from './assets/chevron-down.svg';

// - Styles
import styles from './CreateProposal.module.scss';

type CreateProposalFormProps = {
	dao?: zDAO;
	triggerCancel: boolean;
	tokenDropdownOptions: Option[];
};

export const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
	dao,
	triggerCancel,
	tokenDropdownOptions,
}) => {
	const {
		formValues,
		formErrors,
		formData,
		formConfirm,
		formSubmition,
		handleChange,
		handleFormSubmit,
	} = useCreateProposalForm({ dao, triggerCancel, tokenDropdownOptions });

	return (
		<>
			<div className={styles.Form}>
				{/* Proposal Title Input */}
				<div className={styles.Section}>
					<TextInputWithTopPlaceHolder
						text={formValues.title}
						className={classNames(
							styles.TextInputWithTopPlaceHolder,
							styles.InputField__Title,
						)}
						topPlaceholder={ProposalInputFields.title.title}
						placeholder={
							ProposalInputFields.title.placeholder ??
							ProposalInputFields.title.title
						}
						shouldRenderTopPlaceHolder={!!formValues.title}
						onChange={handleChange(ProposalInputFieldKeys.TITLE)}
						error={!!formErrors.title}
						errorText={formErrors.title}
					/>
				</div>

				{/* Fund Details Section */}
				<div className={styles.Section}>
					{/* Title */}
					<h2 className={styles.Section__Title}>
						{ProposalCreateSections.FUND_DETAILS.title}
						<Tooltip
							text={
								<span className={styles.TooltipContent}>
									{ProposalCreateSections.FUND_DETAILS.tooltipContent}
								</span>
							}
						>
							<QuestionButton small />
						</Tooltip>
					</h2>

					<div className={styles.Section__Content}>
						{/* Token */}
						<div className={styles.Section__Content_Col}>
							<OptionDropdown
								onSelect={({ value }) =>
									handleChange(ProposalInputFieldKeys.TOKEN)(value)
								}
								options={formData.tokenOptions}
								selected={getTokenOption(
									tokenDropdownOptions,
									formValues.token,
								)}
								className={styles.TokenDropdown}
								selectedClassName={styles.TokenDropdownSelectedItem}
							>
								<TextInputWithTopPlaceHolder
									text={
										getTokenOption(tokenDropdownOptions, formValues.token)
											?.title
									}
									className={classNames(
										styles.TextInputWithTopPlaceHolder,
										styles.InputField__Title,
									)}
									topPlaceholder={ProposalInputFields.token.title}
									placeholder={
										ProposalInputFields.token.placeholder ??
										ProposalInputFields.token.title
									}
									shouldRenderTopPlaceHolder={!!formValues.token}
									onChange={() => null}
									disabled
									error={!!formErrors.token}
									errorText={formErrors.token}
								/>
								<img
									alt="select down"
									className={styles.ChevronDownIcon}
									src={ChevronDownIcon}
								/>
							</OptionDropdown>
						</div>

						{/* Amount */}
						<div className={styles.Section__Content_Col}>
							<TextInputWithTopPlaceHolder
								numeric
								text={formValues.amount}
								className={classNames(
									styles.TextInputWithTopPlaceHolder,
									styles.InputField__Title,
								)}
								topPlaceholder={ProposalInputFields.amount.title}
								placeholder={
									ProposalInputFields.amount.placeholder ??
									ProposalInputFields.amount.title
								}
								shouldRenderTopPlaceHolder={!!formValues.amount}
								onChange={handleChange(ProposalInputFieldKeys.AMOUNT)}
								error={!!formErrors.amount}
								errorText={formErrors.amount}
							/>
						</div>

						{/* From */}
						<div className={styles.Section__Content_Col}>
							<div className={styles.DaoAddress__Wrapper}>
								<div className={styles.DaoAddress__Header}>
									From
									<Tooltip
										text={
											<span className={styles.TooltipContent}>
												{ProposalCreateSections.FUND_DETAILS.tooltipContent}
											</span>
										}
									>
										<QuestionButton small />
									</Tooltip>
								</div>
								<div className={styles.DaoAddress__Content}>
									DAO Wallet: <EtherscanLink address={dao?.safeAddress} />
								</div>
							</div>
						</div>

						{/* Recipient */}
						<div className={styles.Section__Content_Col}>
							<TextInputWithTopPlaceHolder
								text={formValues.recipient}
								className={classNames(
									styles.TextInputWithTopPlaceHolder,
									styles.InputField__Title,
								)}
								topPlaceholder={ProposalInputFields.recipient.title}
								placeholder={
									ProposalInputFields.recipient.placeholder ??
									ProposalInputFields.recipient.title
								}
								shouldRenderTopPlaceHolder={!!formValues.recipient}
								onChange={handleChange(ProposalInputFieldKeys.RECIPIENT)}
								error={!!formErrors.recipient}
								errorText={formErrors.recipient}
							/>
						</div>

						{/* Body (Markdown Editor) */}
						<div
							className={classNames(
								styles.Section__Content_Col,
								styles.MarkdownEditorCol,
							)}
						>
							<MarkDownEditor
								containerClassName={styles.MarkdownEditor__Container}
								text={formValues.body}
								placeholder={
									ProposalInputFields.body.placeholder ??
									ProposalInputFields.body.title
								}
								onChange={(value?: string) =>
									handleChange(ProposalInputFieldKeys.BODY)(value!)
								}
								errorText={formErrors.body}
							/>
						</div>
					</div>
				</div>

				{/* Voting Details Section */}
				<div className={styles.Section}>
					{/* Title */}
					<h2 className={styles.Section__Title}>
						{ProposalCreateSections.VOTE_DETAILS.title}
						<Tooltip
							text={
								<span className={styles.TooltipContent}>
									{ProposalCreateSections.VOTE_DETAILS.tooltipContent}
								</span>
							}
						>
							<QuestionButton small />
						</Tooltip>
					</h2>

					<div
						className={classNames(
							styles.Section__Content,
							styles.VotingDetail__Section__Content,
						)}
					>
						{formData.votingDetails.map(
							(votingDetail: VotingDetailItem, index: number) => (
								<div className={styles.VotingDetailCol} key={index}>
									<span>{votingDetail.label}</span>
									<span>{votingDetail.value} </span>
								</div>
							),
						)}
					</div>
				</div>

				<div className={styles.Section}>
					<FutureButton
						className={styles.SubmitButton}
						glow
						onClick={handleFormSubmit}
					>
						Publish Proposal
					</FutureButton>
				</div>
			</div>

			{/* Confirm Modals */}
			{formConfirm.Discard.show && (
				<Overlay centered open onClose={formConfirm.Discard.onConfirm}>
					<Confirmation
						title={ProposalFormConfirmModalText.Discard.title}
						confirmText={ProposalFormConfirmModalText.Discard.confirm}
						cancelText={ProposalFormConfirmModalText.Discard.cancel}
						onCancel={formConfirm.Discard.onCancel}
						onConfirm={formConfirm.Discard.onConfirm}
						className={styles.Confirmation}
					>
						{ProposalFormConfirmModalText.Discard.body}
					</Confirmation>
				</Overlay>
			)}

			{formConfirm.Publish.show && (
				<Overlay
					centered
					open
					onClose={formConfirm.Publish.onCancel}
					hasCloseButton={!formSubmition.isSubmitting}
					nested={formSubmition.isSubmitting}
				>
					<Confirmation
						title={ProposalFormConfirmModalText.Publish.title}
						confirmText={ProposalFormConfirmModalText.Publish.confirm}
						cancelText={ProposalFormConfirmModalText.Publish.cancel}
						onCancel={formConfirm.Publish.onCancel}
						onConfirm={formConfirm.Publish.onConfirm}
						hideButtons={formSubmition.isSubmitting}
						className={styles.Confirmation}
					>
						{formSubmition.isSubmitting ? (
							<>
								<div className={styles.Publishing}>
									{ProposalFormConfirmModalText.Publish.body.publishing.text}
									<Tooltip
										text={
											<span className={styles.TooltipContent}>
												{
													ProposalFormConfirmModalText.Publish.body.publishing
														.tooltipContent
												}
											</span>
										}
									>
										<QuestionButton small />
									</Tooltip>
								</div>
								<LoadingIndicator text="" />
							</>
						) : (
							ProposalFormConfirmModalText.Publish.body.normal
						)}

						{formSubmition.error && (
							<div className={styles.Publishing_Error}>
								{formSubmition.error}
							</div>
						)}
					</Confirmation>
				</Overlay>
			)}

			{formConfirm.Success.show && (
				<Overlay centered open hasCloseButton={false} onClose={() => null}>
					<Confirmation
						title={ProposalFormConfirmModalText.Success.title}
						confirmText={ProposalFormConfirmModalText.Success.confirm}
						cancelText={ProposalFormConfirmModalText.Success.cancel}
						onCancel={formConfirm.Success.onCancel}
						onConfirm={formConfirm.Success.onConfirm}
						className={classNames(
							styles.Confirmation,
							styles.Confirmation_Success,
						)}
						buttonAltProps={{
							cancel: false,
						}}
					>
						{ProposalFormConfirmModalText.Success.body}
					</Confirmation>
				</Overlay>
			)}
		</>
	);
};
