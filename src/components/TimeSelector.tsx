import { motion, type PanInfo, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { playTickSound, triggerHaptic } from "@/utils/audio";

interface TimeSelectorProps {
	options: number[];
	selected: number;
	onSelect: (value: number) => void;
}

const ITEM_WIDTH = 80;
const ITEM_SPACING = 20;

export const TimeSelector = ({
	options,
	selected,
	onSelect,
}: TimeSelectorProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const x = useMotionValue(0);
	const smoothX = useSpring(x, { stiffness: 400, damping: 40 });

	// Handle Circular Logic: Internal options list
	const internalOptions = [...options, ...options, ...options];
	const offsetCount = options.length;

	useEffect(() => {
		if (containerRef.current) {
			setWidth(containerRef.current.offsetWidth);
			// Center the initial selected item (in the second set)
			const centerOffset = containerRef.current.offsetWidth / 2;
			const selectedIndex = options.indexOf(selected) + offsetCount;
			const initialX =
				centerOffset -
				selectedIndex * (ITEM_WIDTH + ITEM_SPACING) -
				ITEM_WIDTH / 2;
			x.set(initialX);
		}
	}, [options, selected, x, offsetCount]);

	const handleDragEnd = (_: unknown, info: PanInfo) => {
		const centerOffset = width / 2;
		const currentX = x.get() + info.offset.x;

		const rawIndex =
			(centerOffset - ITEM_WIDTH / 2 - currentX) / (ITEM_WIDTH + ITEM_SPACING);
		const snappedIndex = Math.round(rawIndex);

		// Virtualized loop logic: if we go too far, snap back to middle set
		let finalIndex = snappedIndex;
		if (snappedIndex < offsetCount) {
			finalIndex = snappedIndex + offsetCount;
		} else if (snappedIndex >= offsetCount * 2) {
			finalIndex = snappedIndex - offsetCount;
		}

		const newX =
			centerOffset - finalIndex * (ITEM_WIDTH + ITEM_SPACING) - ITEM_WIDTH / 2;

		x.set(newX);

		const actualValue = internalOptions[finalIndex];
		if (actualValue !== selected) {
			onSelect(actualValue);
			playTickSound();
			triggerHaptic();
		}
	};

	// Listen to changes to play sound while dragging?
	// Ideally we want sound as we pass thresholds.
	// For now, let's play sound only on settle for simplicity, or we can use `useMotionValueEvent` if we had it.
	// Simple snap-on-release is safer for "tic tac" feel without flooding.

	return (
		<div
			className="relative h-24 w-full flex items-center justify-center overflow-hidden"
			ref={containerRef}
		>
			{/* Gradient masks for fading edges */}
			<div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
			<div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

			{/* Selection Indicator (Center highight) */}
			<div className="absolute w-[80px] h-[80px] rounded-2xl border-2 border-primary/50 shadow-[0_0_20px_rgba(0,255,157,0.2)] z-0 box-content"></div>

			<motion.div
				className="flex absolute left-0 cursor-grab active:cursor-grabbing"
				style={{ x: smoothX }}
				drag="x"
				dragConstraints={{ left: -1000, right: 1000 }} // Loose constraints, we snap anyway
				onDragEnd={handleDragEnd}
				// Custom elasticity could go here
			>
				{internalOptions.map((opt, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Essential for virtual loop
					<Item key={`${opt}-${i}`} value={opt} isSelected={opt === selected} />
				))}
			</motion.div>
		</div>
	);
};

interface ItemProps {
	value: number;
	isSelected: boolean;
}

const Item = ({ value, isSelected }: ItemProps) => {
	// Calculate distance from center to scale/fade
	// Real X position relative to container center
	// We can't easily transform inside child based on parent motion value without passing it down.
	// Let's just do simple styling for now.

	return (
		<motion.div
			className={`
                flex items-center justify-center
                w-[80px] h-[80px] rounded-xl flex-shrink-0 mr-[20px] select-none
                ${isSelected ? "bg-primary/20 text-white" : "bg-white/5 text-white/40"}
            `}
			animate={{
				scale: isSelected ? 1.1 : 0.9,
				opacity: isSelected ? 1 : 0.5,
			}}
			whileTap={{ scale: 0.95 }}
		>
			<span
				className={`text-2xl font-mono font-bold ${isSelected ? "text-primary" : ""}`}
			>
				{value}
			</span>
			<span className="text-[10px] ml-1 mb-2 opacity-50">min</span>
		</motion.div>
	);
};
