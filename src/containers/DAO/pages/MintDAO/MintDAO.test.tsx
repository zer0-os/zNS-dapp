// Testing imports
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { renderWithRedux } from 'lib/testUtils';

// Component import
import MintDAO from './MintDAO';

// Types and constants imports
import { Step, StepStatus, ErrorType } from './MintDAO.types';
import { TITLES, MESSAGES, BUTTONS, ERRORS } from './MintDAO.constants';
import {
	MintDataKey,
	FORM_PLACEHOLDERS,
} from './elements/MintDAOForm/MintDAOForm.constants';

/////////////////////////////
// Mock external functions //
/////////////////////////////
const mockOnClose = jest.fn();

///////////
// Setup //
///////////
const renderComponent = () =>
	renderWithRedux(<MintDAO onClose={mockOnClose} />);

///////////
// Tests //
///////////

describe('MintDAO component', () => {
	describe('Unlock', () => {
		beforeEach(() => {
			renderComponent();
		});

		it('should render unlock wizard', () => {
			// Unlock title present
			expect(
				screen.getByText(TITLES[Step.Unlock][StepStatus.Normal]),
			).toBeInTheDocument();

			// Unlock message present
			const messages = MESSAGES[Step.Unlock][StepStatus.Normal].split(' \n\n ');
			for (const message of messages) {
				expect(screen.getByText(message)).toBeInTheDocument();
			}

			// Unlock buttons present
			expect(
				screen.getByText(BUTTONS[Step.Unlock].PRIMARY),
			).toBeInTheDocument();
			expect(
				screen.getByText(BUTTONS[Step.Unlock].SECONDARY),
			).toBeInTheDocument();
		});

		it('should close unlock wizard on cancel button clicking', () => {
			const cancelButton = screen.getByText(BUTTONS[Step.Unlock].SECONDARY);
			// Unlock cancel button present
			expect(cancelButton).toBeInTheDocument();
			// Cancel button clicking
			userEvent.click(cancelButton);
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should show confirm message on unlock button clicking', () => {
			const unlockButton = screen.getByText(BUTTONS[Step.Unlock].PRIMARY);
			const cancelButton = screen.getByText(BUTTONS[Step.Unlock].SECONDARY);
			// Unlock button present
			expect(unlockButton).toBeInTheDocument();
			// Unlock button clicking
			userEvent.click(unlockButton);
			// Unlock button absent
			expect(unlockButton).not.toBeInTheDocument();
			expect(cancelButton).not.toBeInTheDocument();
			// Unlock confirm message present
			expect(
				screen.getByText(MESSAGES[Step.Unlock][StepStatus.Confirm]),
			).toBeInTheDocument();
		});

		it('should show unlock processing message on mouse clicking', async () => {
			const unlockButton = screen.getByText(BUTTONS[Step.Unlock].PRIMARY);
			// Unlock button present
			expect(unlockButton).toBeInTheDocument();
			// Unlock button clicking
			userEvent.click(unlockButton);
			// Unlock confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Unlock][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm success with mouse clicking
			userEvent.click(confirmMessage);
			// Unlock processing message present
			expect(
				await screen.findByText(MESSAGES[Step.Unlock][StepStatus.Processing]),
			).toBeInTheDocument();
		});

		it('should show unlock error message on mouse double clicking', async () => {
			const unlockButton = screen.getByText(BUTTONS[Step.Unlock].PRIMARY);
			// Unlock button present
			expect(unlockButton).toBeInTheDocument();
			// Unlock button clicking
			userEvent.click(unlockButton);
			// Unlock confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Unlock][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm failure with mouse double clicking
			userEvent.dblClick(confirmMessage);
			// Unlock processing message present
			expect(
				await screen.findByText(ERRORS[ErrorType.Library]),
			).toBeInTheDocument();
		});

		it('should show mint wizard on mouse clicking', async () => {
			const unlockButton = screen.getByText(BUTTONS[Step.Unlock].PRIMARY);
			// Unlock button present
			expect(unlockButton).toBeInTheDocument();
			// Unlock button clicking
			userEvent.click(unlockButton);
			// Unlock confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Unlock][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm success with mouse clicking
			userEvent.click(confirmMessage);
			// Unlock processing message present
			const processingMessage = await screen.findByText(
				MESSAGES[Step.Unlock][StepStatus.Processing],
			);
			expect(processingMessage).toBeInTheDocument();
			// Mocking processing success with mouse clicking
			userEvent.click(processingMessage);
			// Mint title present
			expect(
				await screen.findByText(TITLES[Step.Mint][StepStatus.Normal]),
			).toBeInTheDocument();
		});
	});

	describe('Mint', () => {
		beforeEach(async () => {
			renderComponent();

			const unlockButton = screen.getByText(BUTTONS[Step.Unlock].PRIMARY);
			// Unlock button present
			expect(unlockButton).toBeInTheDocument();
			// Unlock button clicking
			userEvent.click(unlockButton);
			// Unlock confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Unlock][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm success with mouse clicking
			userEvent.click(confirmMessage);
			// Unlock processing message present
			const processingMessage = await screen.findByText(
				MESSAGES[Step.Unlock][StepStatus.Processing],
			);
			expect(processingMessage).toBeInTheDocument();
			// Mocking processing success with mouse clicking
			userEvent.click(processingMessage);
			// Mint title present
			expect(
				await screen.findByText(TITLES[Step.Mint][StepStatus.Normal]),
			).toBeInTheDocument();
			// Fill Mint form inputs
			const nameInput = screen.getByPlaceholderText(
				FORM_PLACEHOLDERS[MintDataKey.name],
			);
			const addressInput = screen.getByPlaceholderText(
				FORM_PLACEHOLDERS[MintDataKey.address],
			);
			userEvent.type(nameInput, 'mock name');
			userEvent.type(addressInput, 'mock address');
		});

		it('should render mint wizard', () => {
			// Mint title present
			expect(
				screen.getByText(TITLES[Step.Mint][StepStatus.Normal]),
			).toBeInTheDocument();
			// Mint buttons present
			expect(screen.getByText(BUTTONS[Step.Mint].PRIMARY)).toBeInTheDocument();
			expect(
				screen.getByText(BUTTONS[Step.Mint].SECONDARY),
			).toBeInTheDocument();
		});

		it('should close mint wizard on cancel button clicking', () => {
			const cancelButton = screen.getByText(BUTTONS[Step.Mint].SECONDARY);
			// Mint cancel button present
			expect(cancelButton).toBeInTheDocument();
			// Cancel button clicking
			userEvent.click(cancelButton);
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should show confirm message on mint button clicking', () => {
			const mintkButton = screen.getByText(BUTTONS[Step.Mint].PRIMARY);
			const cancelButton = screen.getByText(BUTTONS[Step.Mint].SECONDARY);
			// Mint buttons present
			expect(mintkButton).toBeInTheDocument();
			// Mint button clicking
			userEvent.click(mintkButton);
			// Mint button absent
			expect(mintkButton).not.toBeInTheDocument();
			expect(cancelButton).not.toBeInTheDocument();
			// Mint confirm message present
			expect(
				screen.getByText(MESSAGES[Step.Mint][StepStatus.Confirm]),
			).toBeInTheDocument();
		});

		it('should show mint processing message on mouse clicking', async () => {
			// Mint button present
			const mintButton = screen.getByText(BUTTONS[Step.Mint].PRIMARY);
			expect(mintButton).toBeInTheDocument();
			// Mint button clicking
			userEvent.click(mintButton);
			// Mint confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Mint][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm success with mouse clicking
			userEvent.click(confirmMessage);
			// Mint processing message present
			expect(
				await screen.findByText(MESSAGES[Step.Mint][StepStatus.Processing]),
			).toBeInTheDocument();
		});

		it('should show mint error message on mouse double clicking', async () => {
			// Mint button present
			const mintButton = screen.getByText(BUTTONS[Step.Mint].PRIMARY);
			expect(mintButton).toBeInTheDocument();
			// Mint button clicking
			userEvent.click(mintButton);
			// Mint confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Mint][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm failure with mouse double clicking
			userEvent.dblClick(confirmMessage);
			// Mint processing message present
			expect(
				await screen.findByText(ERRORS[ErrorType.Library]),
			).toBeInTheDocument();
		});

		it('should finish on mouse clicking', async () => {
			// Mint button present
			const mintButton = screen.getByText(BUTTONS[Step.Mint].PRIMARY);
			expect(mintButton).toBeInTheDocument();
			// Mint button clicking
			userEvent.click(mintButton);
			// Mint confirm message present
			const confirmMessage = screen.getByText(
				MESSAGES[Step.Mint][StepStatus.Confirm],
			);
			expect(confirmMessage).toBeInTheDocument();
			// Mocking confirm success with mouse clicking
			userEvent.click(confirmMessage);
			// Mint processing message present
			const processingMessage = await screen.findByText(
				MESSAGES[Step.Mint][StepStatus.Processing],
			);
			expect(processingMessage).toBeInTheDocument();
			// Mocking processing success with mouse clicking
			userEvent.click(processingMessage);
		});
	});
});
