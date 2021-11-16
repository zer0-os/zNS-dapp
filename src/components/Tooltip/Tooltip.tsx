//- React Imports
import React from 'react';

// Library Imports
import { useLayer, useHover, Arrow } from 'react-laag';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';

//- Style Imports
import styles from './Tooltip.module.scss';

type TooltipProps = {
	children: React.ReactNode | string | number;
	text: string;
	auto?: boolean;
	placement?:
		| 'top-start'
		| 'top-center'
		| 'top-end'
		| 'left-start'
		| 'left-center'
		| 'left-end'
		| 'right-start'
		| 'right-center'
		| 'right-end'
		| 'bottom-start'
		| 'bottom-center'
		| 'bottom-end';
	triggerOffset?: number;
	delayEnter?: number;
	delayLeave?: number;
	hideOnScroll?: boolean;
	animationProps?: MotionProps;
};

const Tooltip: React.FC<TooltipProps> = ({
	children,
	text,
	auto = true,
	placement = 'top-center',
	triggerOffset = 8,
	delayEnter = 100,
	delayLeave = 200,
	hideOnScroll = true,
	animationProps = {
		initial: { opacity: 0, scale: 0.9 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.9 },
		transition: { duration: 0.1 },
	},
}) => {
	const [isOver, hoverProps] = useHover({
		delayEnter,
		delayLeave,
		hideOnScroll,
	});

	const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
		isOpen: isOver,
		auto,
		placement,
		triggerOffset,
	});

	const trigger = (
		<span className="tooltip-text-wrapper" {...triggerProps} {...hoverProps}>
			{children}
		</span>
	);

	// We're using framer-motion for our enter / exit animations.
	// This is why we need to wrap our actual tooltip inside `<AnimatePresence />`.
	return (
		<>
			{trigger}
			{renderLayer(
				<AnimatePresence>
					{isOver && (
						<motion.div
							className={styles.Tooltip}
							{...animationProps}
							{...layerProps}
						>
							{text}
							<Arrow {...arrowProps} className={styles.Arrow} />
						</motion.div>
					)}
				</AnimatePresence>,
			)}
		</>
	);
};

export default Tooltip;
