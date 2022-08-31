import React from 'react';

// - Library
import type { zDAO } from '@zero-tech/zdao-sdk';
import classNames from 'classnames/bind';

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
	Wizard,
} from 'components';

// - Types
import type { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
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

const cx = classNames.bind(styles);

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
						className={cx(styles.TextInputWithTopPlaceHolder, {
							Error: !!formErrors.title,
						})}
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
									className={cx(styles.TextInputWithTopPlaceHolder, {
										Error: !!formErrors.token,
									})}
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
								className={cx(styles.TextInputWithTopPlaceHolder, {
									Error: !!formErrors.amount,
								})}
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
								className={cx(styles.TextInputWithTopPlaceHolder, {
									Error: !!formErrors.recipient,
								})}
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
								classNames={{
									container: cx(styles.MarkdownEditor__Container, {
										Error: !!formErrors.body,
									}),
									error: styles.MarkdownEditor__Error,
								}}
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
						{formData.votingDetails.map((votingDetail: VotingDetailItem) => (
							<div
								className={styles.VotingDetailCol}
								key={JSON.stringify(votingDetail)}
							>
								<span>{votingDetail.label}</span>
								<span>{votingDetail.value} </span>
							</div>
						))}
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
			{formConfirm.Overlay.show && (
				<Overlay
					centered
					open
					hasCloseButton={formConfirm.Overlay.hasCloseButton}
					nested
					onClose={formConfirm.Overlay.onClose}
				>
					{formConfirm.Discard.show && (
						<Wizard
							header={ProposalFormConfirmModalText.Discard.title}
							className={styles.Confirmation}
						>
							<p>{ProposalFormConfirmModalText.Discard.body}</p>

							<Wizard.Buttons
								primaryButtonText={ProposalFormConfirmModalText.Discard.confirm}
								secondaryButtonText={
									ProposalFormConfirmModalText.Discard.cancel
								}
								onClickPrimaryButton={formConfirm.Discard.onConfirm}
								onClickSecondaryButton={formConfirm.Discard.onCancel}
							/>
						</Wizard>
					)}

					{formConfirm.Publish.show && (
						<Wizard
							header={ProposalFormConfirmModalText.Publish.title}
							className={styles.Confirmation}
						>
							{formSubmition.isSubmitting ? (
								<Wizard.Loading
									message={ProposalFormConfirmModalText.Publish.body.publishing}
								/>
							) : (
								ProposalFormConfirmModalText.Publish.body.normal
							)}

							{formSubmition.error && (
								<p className={classNames(styles.Error, styles.Publish_Error)}>
									{formSubmition.error}
								</p>
							)}

							{!formSubmition.isSubmitting && (
								<Wizard.Buttons
									primaryButtonText={
										ProposalFormConfirmModalText.Publish.confirm
									}
									secondaryButtonText={
										ProposalFormConfirmModalText.Publish.cancel
									}
									onClickPrimaryButton={formConfirm.Publish.onConfirm}
									onClickSecondaryButton={formConfirm.Publish.onCancel}
									secondaryButtonVariant="secondary"
								/>
							)}
						</Wizard>
					)}

					{formConfirm.Success.show && (
						<Wizard
							header={ProposalFormConfirmModalText.Success.title}
							className={styles.Confirmation}
						>
							<p className={styles.Success}>
								{ProposalFormConfirmModalText.Success.body}
							</p>
							<Wizard.Buttons
								primaryButtonText={ProposalFormConfirmModalText.Success.confirm}
								onClickPrimaryButton={formConfirm.Success.onConfirm}
							/>
						</Wizard>
					)}
				</Overlay>
			)}
		</>
	);
};
