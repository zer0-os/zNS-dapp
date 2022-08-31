import React from 'react';
import questionIcon from './assets/question.svg';
import './_question-button.scss';

type QuestionButtonProps = {
	className?: string;
	small?: boolean;
};

const QuestionButton: React.FC<QuestionButtonProps> = ({
	className,
	small = false,
}) => {
	return (
		<button
			className={`question-button ${className || ''} ${small ? 'small' : ''}`}
		>
			<img alt="Have a question?" src={questionIcon} />
		</button>
	);
};

export default QuestionButton;
